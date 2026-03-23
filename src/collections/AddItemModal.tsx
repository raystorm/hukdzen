import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions,
         Tabs, Tab,
         Box, Grid, Card, CardContent,
         Button, Checkbox, Typography
       } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { collectionActions } from './collectionSlice';
import { documentListActions } from '../docs/docList/documentListSlice';
import type { Collection } from './CollectionTypes';

interface AddItemModalProps {
   open: boolean;
   onClose: () => void;
   collectionId: string;
   onAddItems: (items: { documentId?: string; childCollectionId?: string }[]) => void;
}

export const addItemTitle = "Sag̱aytliitsx Amwaal ada Too'ma (Add Items to Collection)";

export const AddItemModal: React.FC<AddItemModalProps> = ({
   open,
   onClose,
   collectionId,
   onAddItems
}) => {
   const dispatch = useAppDispatch();
   const [tabValue, setTabValue] = useState(0);
   const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
   const [selectedCollections, setSelectedCollections] = useState<string[]>([]);


   const { items: collections } = useAppSelector(state => state.collections);
   const documents = useAppSelector(state => state.documentList?.items || []);

   const wouldCreateCircularReference = (candidateId: string, targetId: string,
                                         allCollections: Collection[]): boolean =>
   {
      // Check if adding candidateId to targetId would create a circular reference
      const visited = new Set<string>();
      
      const hasPath = (fromId: string, toId: string): boolean => {
         if (fromId === toId) { return true; }
         if (visited.has(fromId)) { return false; }
         visited.add(fromId);
         
         const collection = allCollections.find(c => c.id === fromId);
         if (!collection?.items?.items) { return false; }
         
         return collection.items.items.some(item => 
            item?.childCollectionID && hasPath(item.childCollectionID, toId)
         );
      };
      
      // Would adding candidateId to targetId create a path from candidateId back to targetId?
      return hasPath(candidateId, targetId);
   };

   // Get current collection to check existing items
   const currentCollection = collections.find(c => c.id === collectionId);
   const existingDocumentIds = currentCollection?.items?.items?.map(item => item?.documentID)
                                                               .filter(Boolean) || [];
   const existingCollectionIds = currentCollection?.items?.items?.map(item => item?.childCollectionID)
                                                                 .filter(Boolean) || [];

   // Filter out current collection, circular references, and already added items
   const availableCollections = collections.filter(c => collectionId !== c.id
      && !wouldCreateCircularReference(c.id, collectionId, collections)
      && !existingCollectionIds.includes(c.id)
   );
   
   const availableDocuments = documents.filter(doc => 
      !existingDocumentIds.includes(doc?.id)
   );

   useEffect(() => {
      if (open && 0 === collections.length)
      { dispatch(collectionActions.getCollections()); }
      if (open && 0 === documents.length)
      { dispatch(documentListActions.getAllDocuments()); }
   }, [open, dispatch, collections.length, documents.length]);

   const handleDocumentToggle = (documentId: string) => {
      setSelectedDocuments(prev => 
         prev.includes(documentId) ?
              prev.filter(id => id !== documentId) : [...prev, documentId]
      );
   };

   const handleCollectionToggle = (collectionId: string) => {
      setSelectedCollections(prev => 
         prev.includes(collectionId) ?
              prev.filter(id => id !== collectionId) : [...prev, collectionId]
      );
   };

   const handleAdd = () => {
      const items = [
         ...selectedDocuments.map(id => ({ documentId: id })),
         ...selectedCollections.map(id => ({ childCollectionId: id }))
      ];
      onAddItems(items);
      setSelectedDocuments([]);
      setSelectedCollections([]);
      onClose();
   };

   const handleCancel = () => {
      setSelectedDocuments([]);
      setSelectedCollections([]);
      onClose();
   };

   return (
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
         <DialogTitle>{addItemTitle}</DialogTitle>
         <DialogContent>
            <Typography variant="body2" color="text.secondary"
                        sx={{ mb: 2, textAlign: 'center' }}>
               Click on a card to select documents or collections to add.
            </Typography>
            
            <Tabs 
               value={tabValue} 
               onChange={(_, newValue) => setTabValue(newValue)}
               sx={{
                  '& .MuiTabs-indicator': { backgroundColor: 'secondary.main' }
               }}
            >
               <Tab label="Amwaal (Documents)" />
               <Tab label="Too'ma (Collections)" />
            </Tabs>

            <Box sx={{ mt: 3, minHeight: 300 }}>
               {tabValue === 0 && (
                  <Box>
                     {0 === availableDocuments.length ? (
                        <Typography color="text.secondary" textAlign="center" py={4}>
                           No documents available
                        </Typography>
                     ) : (
                        <Grid container spacing={2}>
                           {availableDocuments.map(doc => {
                              const isSelected = selectedDocuments.includes(doc?.id || '');
                              return (
                                 <Grid item xs={12} sm={6} key={doc?.id}>
                                    <Card 
                                       sx={{ 
                                          cursor: 'pointer',
                                          border: isSelected ? '2px solid' : '1px solid',
                                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                                          backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                                          '&:hover': { elevation: 4 }
                                       }}
                                       onClick={() => handleDocumentToggle(doc?.id || '')}
                                    >
                                       <CardContent>
                                          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>English:</Typography>
                                             <Typography variant="body2">{doc?.eng?.title || 'Untitled'}</Typography>
                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>BC:</Typography>
                                             <Typography variant="body2">{doc?.bc?.title || '-'}</Typography>
                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>AK:</Typography>
                                             <Typography variant="body2">{doc?.ak?.title || '-'}</Typography>
                                          </Box>
                                       </CardContent>
                                    </Card>
                                 </Grid>
                              );
                           })}
                        </Grid>
                     )}
                  </Box>
               )}

               {tabValue === 1 && (
                  <Box>
                     {0 === availableCollections.length ? (
                        <Typography color="text.secondary" textAlign="center" py={4}>
                           No collections available
                        </Typography>
                     ) : (
                        <Grid container spacing={2}>
                           {availableCollections.map(collection => {
                              const isSelected = selectedCollections.includes(collection.id);
                              return (
                                 <Grid item xs={12} sm={6} key={collection.id}>
                                    <Card 
                                       sx={{ 
                                          cursor: 'pointer',
                                          border: isSelected ? '2px solid' : '1px solid',
                                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                                          backgroundColor: isSelected ?
                                           'rgba(25, 118, 210, 0.08)' : 'background.paper',
                                          '&:hover': { elevation: 4 }
                                       }}
                                       onClick={() => handleCollectionToggle(collection.id)}
                                    >
                                       <CardContent>
                                          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr',
                                                     gap: '8px 16px' }}>
                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                English:
                                             </Typography>
                                             <Typography variant="body2">
                                                {collection.eng?.title || 'Untitled'}
                                             </Typography>
                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                BC:
                                             </Typography>
                                             <Typography variant="body2">
                                                {collection.bc?.title || '-'}
                                             </Typography>
                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                AK:
                                             </Typography>
                                             <Typography variant="body2">
                                                {collection.ak?.title || '-'}
                                             </Typography>
                                          </Box>
                                       </CardContent>
                                    </Card>
                                 </Grid>
                              );
                           })}
                        </Grid>
                     )}
                  </Box>
               )}
            </Box>
         </DialogContent>
         <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button 
               onClick={handleAdd} 
               variant="contained"
               disabled={0 === selectedDocuments.length && 0 === selectedCollections.length}
            >
               Sag̱aytliitsx nah ksi guu (Add Selected)
               ({selectedDocuments.length + selectedCollections.length})
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default AddItemModal;