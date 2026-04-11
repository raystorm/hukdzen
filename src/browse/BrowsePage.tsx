import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { matchPath, useLocation, useNavigate, useSearchParams } from "react-router";
import { 
   Box, MenuItem,
   FormControl, InputLabel, Select, SelectChangeEvent, IconButton,
   Typography,
} from '@mui/material'
//import SortIcon from '@mui/icons-material/Sort';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

import { useAppSelector } from '../app/hooks';
import { theme } from '../components/shared/theme';
import { BROWSE_PATH } from "../components/shared/constants";
import { useSkipRender } from "../components/hooks/useSkipRender";

import { browseActions } from './browseSlice';
import { boxListActions } from '../Box/BoxList/BoxListSlice';
import { documentListActions } from '../docs/docList/documentListSlice';

import { BrowseSidebar } from './BrowseSidebar';
import { ContentGrid } from '../components/shared/ContentGrid';

import type { Document } from "../docs/DocumentTypes";
import { SortDirection } from "../Search/searchTypes";
import { emptyDocument } from "../docs/initialDocumentDetails";
import { DefaultBox, emptyBox, printBox } from "../Box/boxTypes";
import type { printableName } from '../types';
import { printName, nullFilter } from '../types';
import { buildSummary } from '../Content/ContentType';

import { DocumentFieldDefinition } from '../types/fieldDefitions';

const uiSortOptions = [
   { value: 'eng_title',       label: DocumentFieldDefinition.eng.title.label },
   { value: 'eng_description', label: DocumentFieldDefinition.eng.description.label },
   { value: 'bc_title',        label: DocumentFieldDefinition.bc.title.label },
   { value: 'bc_description',  label: DocumentFieldDefinition.bc.description.label },
   { value: 'ak_title',        label: DocumentFieldDefinition.ak.title.label },
   { value: 'ak_description',  label: DocumentFieldDefinition.ak.description.label },
];

const baseOptions = Object.entries(DocumentFieldDefinition)
                          .map(([key, def]) => ({ value: key, label: def.label }));

const sortOptions = [...baseOptions, ...uiSortOptions];

export const BrowsePage: React.FC = () =>
{
   const dispatch       = useDispatch();
   const navigate       = useNavigate();
   const skipRender     = useSkipRender(BROWSE_PATH);
   const [searchParams] = useSearchParams();

   const { selectedBox, visibleFields, sort, filters } = useAppSelector(state => state.browse);
   const { items: boxes } = useAppSelector(state => state.boxList);
   const { items: documents } = useAppSelector(state => state.documentList);
   const { isProcessing } = useAppSelector(state => state.ui);

   let user = useAppSelector(state => state.currentUser);

   useEffect(() =>
   {
      if ( skipRender() ) { return; }

      // Check for boxId in URL params
      const boxIdParam = searchParams.get('boxId');
      if (boxIdParam)
      {
         const box = boxes?.find(b => b?.id === boxIdParam);
         if (box)
         {
            dispatch(browseActions.setSelectedBox(box));
            dispatch(documentListActions.getDocumentsByBoxId(boxIdParam));
            return;
         }
      }

      // Set default box if none selected
      if (!selectedBox || emptyBox.id === selectedBox.id)
      {
         dispatch(browseActions.setSelectedBox(DefaultBox));
         dispatch(documentListActions.getDocumentsByBoxId(DefaultBox.id));
      }
   }, [dispatch, selectedBox, skipRender, searchParams, boxes]);

   useEffect(() =>
   {
      if ( skipRender() ) { return; }
      if (!boxes || boxes.length === 0)
      { dispatch(boxListActions.getAllReadableBoxes(user)); }
   }, [dispatch, user]);

   const matchesFilters = useCallback((docValue: any, filterValues: string[]) =>
   {
      if (!docValue) { return false; }
      const docValueStr = String(docValue).toLowerCase();
      return filterValues.some(filter => 
         docValueStr.includes(String(filter).toLowerCase())
      );
   }, []);

   const filteredAndSortedDocuments = React.useMemo(() =>
   {
      if ( skipRender() ) { return []; }
      if ( !documents || 0 === documents.length ) { return []; }

      return [...documents]
         .filter(nullFilter<Document>)
         .filter(doc =>
         {
            // Dynamic filtering for all fields
            for (const [filterKey, filterValues] of Object.entries(filters))
            {
               if (Array.isArray(filterValues) && 0 < filterValues.length )
               {
                  let docValue;
                  
                  // Map filter keys to document fields
                  switch (filterKey)
                  {
                     case 'authors':
                        docValue = doc.author?.id;
                        break;
                     case 'contentOwners':
                        docValue = doc.contentOwner?.id;
                        break;
                     case 'types':
                        docValue = doc.type;
                        break;
                     case 'keywords':
                        // Special handling for keywords array
                        if (!doc.keywords?.some(keyword => filterValues.includes(keyword)))
                        { return false; }
                        continue;
                     case 'eng_titles':
                        docValue = doc.eng?.title;
                        break;
                     case 'bc_titles':
                        docValue = doc.bc?.title;
                        break;
                     case 'ak_titles':
                        docValue = doc.ak?.title;
                        break;
                     case 'eng_descriptions':
                        docValue = doc.eng?.description;
                        break;
                     case 'bc_descriptions':
                        docValue = doc.bc?.description;
                        break;
                     case 'ak_descriptions':
                        docValue = doc.ak?.description;
                        break;
                     case 'fileKeys':
                        docValue = doc.fileKey;
                        break;
                     case 'versions':
                        docValue = doc.version;
                        break;
                     case 'ids':
                        docValue = doc.id;
                        break;
                     default:
                        continue;
                  }
                  
                  // Handle special empty filter
                  const hasEmptyFilter = filterValues.includes('<empty>');
                  const isEmpty = !docValue || ( typeof docValue === 'string'
                                                      && docValue.trim() === '' );

                  if (hasEmptyFilter)
                  {
                     // If document is empty, it matches the empty filter
                     if (isEmpty) { continue; }
                     
                     // Document has value, check if it matches other non-empty filters
                     const nonEmptyFilters = filterValues.filter(v => v !== '<empty>');
                     if (nonEmptyFilters.length > 0)
                     {
                        if (!matchesFilters(docValue, nonEmptyFilters))
                        { return false; }
                     }
                     // Only empty filter selected, but document has value - exclude it
                     else { return false; }
                  }
                  else // No empty filter, case-insensitive substring matching
                  {  if (!matchesFilters(docValue, filterValues)) { return false; } }
               }
               
               // Date range filtering
               if (filterKey === 'created' || filterKey === 'updated')
               {
                  const dateFilter = filterValues as any;
                  if (dateFilter.from || dateFilter.to)
                  {
                     const docDateValue = filterKey === 'created' ? doc.created : doc.updated;
                     if (!docDateValue) { continue; }
                     
                     const docDate = new Date(docDateValue);
                     if (dateFilter.from && docDate < new Date(dateFilter.from))
                     { return false; }
                     if (dateFilter.to && docDate > new Date(dateFilter.to))
                     { return false; }
                  }
               }
            }
            return true;
         })
         .sort((a, b) =>
         {
            // Map underscore field keys to nested structure for sorting
            let aVal: any;
            let bVal: any;
            
            if (sort.field.includes('_')) {
               // Handle nested fields like eng_title -> eng.title
               const [lang, prop] = sort.field.split('_');
               aVal = a[lang as keyof Document]?.[prop as any] || '';
               bVal = b[lang as keyof Document]?.[prop as any] || '';
            } else {
               // Handle direct properties
               aVal = a[sort.field as keyof Document] || '';
               bVal = b[sort.field as keyof Document] || '';
            }
            
            let compare: number;
            if (typeof aVal === 'string' && typeof bVal === 'string')
            { compare = String(aVal).localeCompare(String(bVal)); }
            else if (typeof aVal === 'number' && typeof bVal === 'number')
            { compare = aVal - bVal; }
            else //assume printableNameType
            {
               const aName = printName(aVal as printableName);
               const bName = printName(bVal as printableName);
               compare = String(aName).localeCompare(String(bName));
            }
            return sort.direction === SortDirection.ASC ? compare : -compare;
         });
   }, [documents, sort, filters]);

   const handleBoxSelect = useCallback((event: SelectChangeEvent<string>) =>
   {
      const boxId = event.target.value;
      const box = boxes?.find(b => b?.id === boxId);
      if (box)
      {
         dispatch(browseActions.setSelectedBox(box));
         dispatch(documentListActions.getDocumentsByBoxId(boxId));
      }
   }, [dispatch, boxes]);

   const handleFieldToggle = useCallback((field: string) =>
   {
      const newFields = visibleFields.includes(field) ?
                visibleFields.filter(f => f !== field) : [...visibleFields, field];
      dispatch(browseActions.setVisibleFields(newFields));
   }, [dispatch, visibleFields]);

   const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) =>
   { dispatch(browseActions.setFilters(newFilters)); }, [dispatch]);

   const handleClearFilters = useCallback(() =>
   { dispatch(browseActions.clearFilters()); }, [dispatch]);

   const handleSortFieldChange = useCallback((event: SelectChangeEvent<string>) =>
   {
      dispatch(browseActions.setSort({ field: event.target.value,
                                       direction: sort.direction }));
   }, [dispatch, sort.direction]);

   const handleSortDirectionToggle = useCallback(() =>
   {
      const toggled = sort.direction === SortDirection.ASC ?
                                        SortDirection.DESC : SortDirection.ASC;
      dispatch(browseActions.setSort({ field: sort.field, direction: toggled }));
   }, [dispatch, sort]);

   const LoadingBoxMessage: Document[] = [{
      ...emptyDocument,
      eng: buildSummary('Getting the Box Contents'),
      bc:  buildSummary('yagwa lusa\'wn xbiis'),
      ak:  buildSummary('yagwa lusa\'wn ckbeesh'),
   }]

   const emptyBoxMessage: Document[] = [{
      ...emptyDocument,
      eng: buildSummary('Box is empty'),
      bc:  buildSummary('lug̱a̱la̱m xbiis'),
      ak:  buildSummary('lug̱galam ckbeesh'),
   }]

   //normal
   const ASCIcon = <SortByAlphaIcon fontSize='large'
                                     sx={{ bgcolor: theme.palette.primary.main,
                                           color: theme.palette.primary.contrastText,
                                           borderRadius: '10%',
                           }}/>
   //upside down
   const DESCIcon = <SortByAlphaIcon style={{ transform: 'scale(-1, 1)'}}
                                      fontSize='large'
                                      sx={{ bgcolor: theme.palette.secondary.main,
                                             color: theme.palette.secondary.contrastText,
                                             borderRadius: '10%',
                            }}/>

   if ( skipRender() ) { return <></>; }

   return (
      <Box sx={{ p: 3 }}>
         <h2>Browse Content Items</h2>

         <Box sx={{ gap: 2, mb: 2, alignItems: 'center' }}>
           <FormControl sx={{ minWidth: '10rem' }}>
             <InputLabel>Select Box</InputLabel>
             <Select value={selectedBox?.id || ''} onChange={handleBoxSelect}
                     data-testid='select-box' label="Select Box"
             >
                 {boxes?.map((box) => (
                    box &&
                    <MenuItem key={box.id} value={box.id}>
                      {printBox(box)}
                    </MenuItem>
                 ))}
             </Select>
           </FormControl>

           {selectedBox && (
             <>
               <FormControl sx={{ minWidth: '8rem' }}>
                 <InputLabel>Sort By</InputLabel>
                 <Select value={sort.field} onChange={handleSortFieldChange}
                         data-testid='sort-by' label="Sort By"
                 >
                   {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                   ))}
                 </Select>
               </FormControl>

               <IconButton onClick={handleSortDirectionToggle}
                           title={`Currently Sorting ${sort.direction === SortDirection.ASC ?
                                                                                'Ascending' : 'Descending'}`}>
                 {sort.direction === SortDirection.ASC ? ASCIcon : DESCIcon}
               </IconButton>
             </>
           )}
         </Box>

         <Box className='twoColumn' gridTemplateColumns='minmax(15rem, auto) 1fr'>
            <Box sx={{ display: 'flex', maxWidth: '15rem' }}
                 borderRight={{ borderRight: `2px solid ${theme.palette.secondary.main}` }}>
               <BrowseSidebar
                  visibleFields={visibleFields}
                  onFieldToggle={handleFieldToggle}
                  documents={documents?.filter(nullFilter) || []}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
               />
            </Box>

            <div>
              {selectedBox && (
                   <h3>
                     "{printBox(selectedBox)}"
                     ({filteredAndSortedDocuments?.length || 0} of {documents.length} items)
                   </h3>
               )}
              {/*with items*/}
              { selectedBox && !isProcessing && filteredAndSortedDocuments
             && 0 < filteredAndSortedDocuments.length && (
                 <ContentGrid 
                    items={filteredAndSortedDocuments}
                    fields={visibleFields.map(field => {
                       // Map old flat field keys to new nested structure
                       const fieldKey = field.replace(/_/g, '.');
                       return {
                          key: fieldKey,
                          label: DocumentFieldDefinition[
                                   field as keyof typeof DocumentFieldDefinition
                                 ]?.label || field
                       };
                    })}
                    onItemClick={(document: Document) => navigate(`/item/${document.id}`)}
                 />
              )}
              {/*empty*/}
              { selectedBox
             && !isProcessing && (!documents || 0 === documents.length) && (
                 <ContentGrid 
                    items={emptyBoxMessage}
                    fields={visibleFields.map(field => {
                       // Map old flat field keys to new nested structure
                       const fieldKey = field.replace(/_/g, '.');
                       return {
                          key: fieldKey,
                          label: DocumentFieldDefinition[
                                   field as keyof typeof DocumentFieldDefinition
                                 ]?.label || field
                       };
                    })}
                 />
              )}

               { selectedBox && isProcessing && (
                  <ContentGrid 
                     items={LoadingBoxMessage}
                     fields={visibleFields.map(field => {
                        // Map old flat field keys to new nested structure
                        const fieldKey = field.replace(/_/g, '.');
                        return {
                           key: fieldKey,
                           label: DocumentFieldDefinition[
                                    field as keyof typeof DocumentFieldDefinition
                                  ]?.label || field
                        };
                     })}
                  />
               )}

              {!selectedBox && (
                 <Typography variant="body1" color="text.secondary">
                   Select a box to browse its content items.
                 </Typography>
              )}
           </div>
         </Box>
      </Box>
   );
};

export default BrowsePage;