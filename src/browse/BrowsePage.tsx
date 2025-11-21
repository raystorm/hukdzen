import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
   Box,
   FormControl, InputLabel, Select, SelectChangeEvent,
   MenuItem,
   Typography,
   IconButton,
} from '@mui/material'
import SortIcon from '@mui/icons-material/Sort';

import { useAppSelector } from '../app/hooks';
import { theme } from '../components/shared/theme';
import { browseActions } from './browseSlice';
import { boxListActions } from '../Box/BoxList/BoxListSlice';

import { documentListActions } from '../docs/docList/documentListSlice';
import { ContentGrid } from './ContentGrid';
import { BrowseSidebar } from './BrowseSidebar';
import { emptyDocumentDetails } from "../docs/initialDocumentDetails";
import {DocumentDetails} from "../docs/DocumentTypes";
import { printBox } from "../Box/boxTypes";
import { printName, printableName } from '../types';
import { sortDirection } from '../docs/docList/documentListTypes';
import { DocumentDetailsFieldDefinition } from '../types/fieldDefitions';

const sortOptions = Object.entries(DocumentDetailsFieldDefinition).map(([key, def]) =>
({ value: key, label: def.label }));

export const BrowsePage: React.FC = () => {
   const dispatch = useDispatch();

   const { selectedBox, visibleFields, sort, filters } = useAppSelector(state => state.browse);
   const { items: boxes } = useAppSelector(state => state.boxList);
   const { items: documents } = useAppSelector(state => state.documentList);

   useEffect(() => {
      if (!boxes || boxes.length === 0) { dispatch(boxListActions.getAllBoxes()); }
   }, [dispatch, boxes]);

   const filteredAndSortedDocuments = React.useMemo(() =>
   {
      if (!documents || 0 === documents.length) { return documents; }

      return [...documents]
         .filter((doc): doc is DocumentDetails => null !== doc)
         .filter(doc => {
            // Author filter
            if ( 0 < filters.authors.length
              && !filters.authors.includes(doc.author.id))
            { return false; }
            // Doc owner filter
            if ( 0 < filters.docOwners.length
              && !filters.docOwners.includes(doc.docOwner.id))
            { return false; }
            // Type filter
            if ( 0 < filters.types.length && doc.type
              && !filters.types.includes(doc.type))
            { return false; }
            // Created date range filter
            if (filters.created.from || filters.created.to)
            {
               const docDate = new Date(doc.created);
               if (filters.created.from && docDate < new Date(filters.created.from))
               { return false; }
               if (filters.created.to && docDate > new Date(filters.created.to))
               { return false; }
            }
            // Updated date range filter
            if (filters.updated.from || filters.updated.to)
            {
               if (!doc.updated) { return false; }
               const docDate = new Date(doc.updated);
               if (filters.updated.from && docDate < new Date(filters.updated.from))
               { return false; }
               if (filters.updated.to && docDate > new Date(filters.updated.to))
               { return false; }
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
         dispatch(documentListActions.getDocumentsByBox(boxId));
      }
   }, [dispatch, boxes]);

   const handleFieldToggle = useCallback((field: string) =>
   {
      const newFields = visibleFields.includes(field) ?
                visibleFields.filter(f => f !== field) : [...visibleFields, field];
      dispatch(browseActions.setVisibleFields(newFields));
   }, [dispatch, visibleFields]);

   const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) => {
      dispatch(browseActions.setFilters(newFilters));
   }, [dispatch]);

   const handleClearFilters = useCallback(() => {
      dispatch(browseActions.clearFilters());
   }, [dispatch]);

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

   const emptyBoxMessage: DocumentDetails[] = [{
      ...emptyDocumentDetails,
      eng_title: 'Box is empty',
      bc_title:  'lug̱a̱la̱m xbiis',
      ak_title:  'lug̱galam ckbeesh',
   }]

   //normal
   const ASCIcon = <SortIcon fontSize='large'
                                     sx={{ bgcolor: theme.palette.primary.main,
                                           color: theme.palette.primary.contrastText,
                                           borderRadius: '10%',
                           }}/>
   //upside down
   const DESCIcon = <SortIcon style={{ transform: 'scale(1, -1)'}}
                                      fontSize='large'
                                      sx={{ bgcolor: theme.palette.secondary.main,
                                             color: theme.palette.secondary.contrastText,
                                             borderRadius: '10%',
                            }}/>

   return (
      <Box sx={{ p: 3 }}>
         <h2>Browse Content Items</h2>

         <Box sx={{ gap: 2, mb: 2, alignItems: 'center' }}>
           <FormControl sx={{ minWidth: '10rem' }}>
             <InputLabel>Select Box</InputLabel>
             <Select value={selectedBox?.id || ''} onChange={handleBoxSelect}
                     label="Select Box"
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
                         label="Sort By"
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
              {selectedBox && filteredAndSortedDocuments && 0 < filteredAndSortedDocuments.length && (
                 <ContentGrid documents={filteredAndSortedDocuments} visibleFields={visibleFields} />
              )}
              {/*empty*/}
              {selectedBox && (!documents || 0 === documents.length) && (
                 <ContentGrid documents={emptyBoxMessage}
                              visibleFields={visibleFields} />
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