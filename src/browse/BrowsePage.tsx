import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
   Box, 
   FormControl, 
   InputLabel, 
   Select, 
   MenuItem, 
   Typography, 
   SelectChangeEvent 
} from '@mui/material';

import { useAppSelector } from '../app/hooks';
import { theme } from '../components/shared/theme';
import { browseActions } from './browseSlice';
import { boxListActions } from '../Box/BoxList/BoxListSlice';

import { documentListActions } from '../docs/docList/documentListSlice';
import { ContentGrid } from './ContentGrid';
import { CardFieldConfig } from './CardFieldConfig';
import {emptyDocumentDetails} from "../docs/initialDocumentDetails";
import {DocumentDetails} from "../docs/DocumentTypes";

export const BrowsePage: React.FC = () => {
   const dispatch = useDispatch();
   const { selectedBox, visibleFields } = useAppSelector(state => state.browse);
   const { items: boxes } = useAppSelector(state => state.boxList);
   const { items: documents } = useAppSelector(state => state.documentList);

   useEffect(() => {
      if (!boxes || boxes.length === 0) { dispatch(boxListActions.getAllBoxes()); }
   }, [dispatch, boxes]);

   const handleBoxSelect = useCallback((event: SelectChangeEvent<string>) =>
   {
      const boxId = event.target.value;
      const box = boxes?.find(b => b?.id === boxId);
      if (box) {
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

   const emptyBoxMessage: DocumentDetails[] = [{
      ...emptyDocumentDetails,
      eng_title: 'Box is empty',
      bc_title:  'lug̱a̱la̱m xbiis',
      ak_title:  'lug̱galam ckbeesh',
   }]

   return (
      <Box sx={{ p: 3 }}>
         <h2>Browse Content Items</h2>
         <FormControl sx={{ minWidth: '10rem' }} >
            <InputLabel>Select Box</InputLabel>
            <Select
               value={selectedBox?.id || ''}
               onChange={handleBoxSelect}
               label="Select Box"
            >
               {boxes?.map((box) => (
                  <MenuItem key={box?.id} value={box?.id}>
                     {box?.name}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>
         <div className='twoColumn'>
            <Box sx={{ display: 'flex', maxWidth: '15rem' }}
                 borderRight={{ borderRight: `2px solid ${theme.palette.secondary.main}` }}>
               <FormControl /*sx={{ minWidth: 200 }}*/ >
                  <CardFieldConfig
                     visibleFields={visibleFields}
                     onFieldToggle={handleFieldToggle}
                  />
               </FormControl>
            </Box>
             <div>
               {selectedBox && documents && 0 < documents.length && (
                  <>
                     <Typography variant="h6" gutterBottom>
                        "{selectedBox.name}" ({documents.length} items)
                     </Typography>
                     <ContentGrid documents={documents} visibleFields={visibleFields} />
                  </>
               )}
               {selectedBox && (!documents || 0 === documents.length) && (
                  <>
                     <Typography variant="h6" gutterBottom>
                        "{selectedBox.name}" ({documents.length} items)
                     </Typography>
                     <ContentGrid documents={emptyBoxMessage}
                                  visibleFields={visibleFields} />
                  </>
               )}

               {!selectedBox && (
                  <Typography variant="body1" color="text.secondary">
                     Select a box to browse its content items.
                  </Typography>
               )}
            </div>
         </div>
      </Box>
   );
};

export default BrowsePage;