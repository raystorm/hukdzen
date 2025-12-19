import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { matchPath, useLocation, useNavigate } from "react-router";
import { 
   Box, MenuItem,
   FormControl, InputLabel, Select, SelectChangeEvent, IconButton,
   Typography,
} from '@mui/material'
//import SortIcon from '@mui/icons-material/Sort';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

import { useAppSelector } from '../app/hooks';
import { theme } from '../components/shared/theme';
import { browseActions } from './browseSlice';
import { boxListActions } from '../Box/BoxList/BoxListSlice';

import { documentListActions } from '../docs/docList/documentListSlice';
import { BrowseSidebar } from './BrowseSidebar';
import { ContentGrid } from '../components/shared/ContentGrid';
import { ContentCard } from '../components/shared/ContentCard';
import { emptyDocumentDetails } from "../docs/initialDocumentDetails";
import {DocumentDetails} from "../docs/DocumentTypes";
import {DefaultBox, emptyXbiis, printBox} from "../Box/boxTypes";
import { printName, printableName } from '../types';
import { sortDirection } from '../docs/docList/documentListTypes';
import { DocumentDetailsFieldDefinition } from '../types/fieldDefitions';
import { BROWSE_PATH } from "../components/shared/constants";

const sortOptions = Object.entries(DocumentDetailsFieldDefinition).map(([key, def]) =>
({ value: key, label: def.label }));

export const BrowsePage: React.FC = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();

   const skipRender = useCallback(
      (): boolean => !matchPath(BROWSE_PATH, location.pathname),
      [location]
   );

   const { selectedBox, visibleFields, sort, filters } = useAppSelector(state => state.browse);
   const { items: boxes } = useAppSelector(state => state.boxList);
   const { items: documents } = useAppSelector(state => state.documentList);
   const { isProcessing } = useAppSelector(state => state.ui);

   useEffect(() => {
      if (skipRender()) { return; }

      // Set default box if none selected
      if (!selectedBox || emptyXbiis.id === selectedBox.id)
      {
         dispatch(browseActions.setSelectedBox(DefaultBox));
         dispatch(documentListActions.getDocumentsByBoxId(DefaultBox.id));
      }
   }, [dispatch, selectedBox, skipRender]);

   useEffect(() => {
      if ( skipRender() ) { return; }
      if (!boxes || boxes.length === 0) { dispatch(boxListActions.getAllBoxes()); }
   }, [dispatch, boxes]);

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
         .filter((doc): doc is DocumentDetails => null !== doc)
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
                     case 'docOwners':
                        docValue = doc.docOwner?.id;
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
                        docValue = doc.eng_title;
                        break;
                     case 'bc_titles':
                        docValue = doc.bc_title;
                        break;
                     case 'ak_titles':
                        docValue = doc.ak_title;
                        break;
                     case 'eng_descriptions':
                        docValue = doc.eng_description;
                        break;
                     case 'bc_descriptions':
                        docValue = doc.bc_description;
                        break;
                     case 'ak_descriptions':
                        docValue = doc.ak_description;
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
            const aVal = a[sort.field as keyof DocumentDetails] || '';
            const bVal = b[sort.field as keyof DocumentDetails] || '';
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
            return sort.direction === sortDirection.ASC ? compare : -compare;
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
      dispatch(browseActions.setSort({ field: sort.field,
                                       direction: sort.direction === sortDirection.ASC ?
                                                                    sortDirection.DESC : sortDirection.ASC }));
   }, [dispatch, sort]);

   const LoadingBoxMessage: DocumentDetails[] = [{
      ...emptyDocumentDetails,
      eng_title: 'Getting the Box Contents',
      bc_title:  'yagwa lusa\'wn xbiis',
      ak_title:  'yagwa lusa\'wn ckbeesh',
   }]

   const emptyBoxMessage: DocumentDetails[] = [{
      ...emptyDocumentDetails,
      eng_title: 'Box is empty',
      bc_title:  'lug̱a̱la̱m xbiis',
      ak_title:  'lug̱galam ckbeesh',
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
                           title={`Currently Sorting ${sort.direction === sortDirection.ASC ?
                                                                                'Ascending' : 'Descending'}`}>
                 {sort.direction === sortDirection.ASC ? ASCIcon : DESCIcon}
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
                  documents={documents?.filter((doc): doc is DocumentDetails => doc !== null) || []}
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
              {selectedBox && !isProcessing && filteredAndSortedDocuments && 0 < filteredAndSortedDocuments.length && (
                 <ContentGrid 
                    items={filteredAndSortedDocuments}
                    fields={visibleFields.map(field => ({ key: field, label: DocumentDetailsFieldDefinition[field as keyof typeof DocumentDetailsFieldDefinition]?.label || field }))}
                    onItemClick={(document: DocumentDetails) => navigate(`/item/${document.id}`)}
                 />
              )}
              {/*empty*/}
              {selectedBox && !isProcessing && (!documents || 0 === documents.length) && (
                 <ContentGrid 
                    items={emptyBoxMessage}
                    fields={visibleFields.map(field => ({ key: field, label: DocumentDetailsFieldDefinition[field as keyof typeof DocumentDetailsFieldDefinition]?.label || field }))}
                 />
              )}

               {selectedBox && isProcessing && (
                  <ContentGrid 
                     items={LoadingBoxMessage}
                     fields={visibleFields.map(field => ({ key: field, label: DocumentDetailsFieldDefinition[field as keyof typeof DocumentDetailsFieldDefinition]?.label || field }))}
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