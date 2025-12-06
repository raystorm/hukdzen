import React from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Button, Typography, Chip } from '@mui/material';
import { 
   Add as AddIcon, 
   Delete as DeleteIcon, 
   ArrowUpward as ArrowUpIcon, 
   ArrowDownward as ArrowDownIcon,
   Description as DocumentIcon,
   Folder as CollectionIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type { CollectionItem } from './CollectionTypes';

interface CollectionItemListProps {
   items: CollectionItem[];
   onAddItem: () => void;
   onRemoveItem: (itemId: string) => void;
   onMoveUp: (itemId: string) => void;
   onMoveDown: (itemId: string) => void;
}

export const CollectionItemList: React.FC<CollectionItemListProps> = ({
   items,
   onAddItem,
   onRemoveItem,
   onMoveUp,
   onMoveDown
}) => {
   const navigate = useNavigate();

   const sortedItems = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

   const handleItemClick = (item: CollectionItem) => {
      if (item.documentID) {
         navigate(`/item/${item.documentID}`);
      } else if (item.childCollectionID) {
         navigate(`/collections/${item.childCollectionID}`);
      }
   };

   const getItemTitle = (item: CollectionItem) => {
      if (item.document) {
         const titles = [
            item.document.eng_title,
            item.document.bc_title,
            item.document.ak_title
         ].filter(Boolean);
         return titles.length > 0 ? titles.join(' / ') : 'Untitled Document';
      } else if (item.childCollection) {
         const titles = [
            item.childCollection.eng_title,
            item.childCollection.bc_title,
            item.childCollection.ak_title
         ].filter(Boolean);
         return titles.length > 0 ? titles.join(' / ') : 'Untitled Collection';
      }
      // Fallback for items without populated relations
      if (item.documentID) {
         return `ID: ${item.documentID.substring(0, 8)}...`;
      } else if (item.childCollectionID) {
         return `ID: ${item.childCollectionID.substring(0, 8)}...`;
      }
      return 'Unknown Item';
   };

   const getItemSubtitle = (item: CollectionItem) => {
      if (item.document) {
         const titles = [
            item.document.eng_title,
            item.document.bc_title,
            item.document.ak_title
         ].filter(Boolean);
         const titleText = titles.length > 0 ? titles.join(' / ') : 'Untitled';
         return `Document: ${titleText}`;
      } else if (item.childCollection) {
         const titles = [
            item.childCollection.eng_title,
            item.childCollection.bc_title,
            item.childCollection.ak_title
         ].filter(Boolean);
         const titleText = titles.length > 0 ? titles.join(' / ') : 'Untitled';
         return `Collection: ${titleText}`;
      }
      // Fallback for items without populated relations
      return item.documentID ? 'Document: (unpopulated)' : 'Collection: (unpopulated)';
   };

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <h3>Collection Items ({sortedItems.length})</h3>
            <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={onAddItem}
            >
               Add Item
            </Button>
         </Box>

         {sortedItems.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
               No items in this collection yet.
               <br />
               Click "Add Item" to get started.
            </Typography>
         ) : (
            <List>
               {sortedItems.map((item, index) => (
                  <ListItem
                     key={item.id}
                     sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                           backgroundColor: '#f5f5f5',
                           cursor: 'pointer'
                        }
                     }}
                     onClick={() => handleItemClick(item)}
                  >
                     <Box display="flex" alignItems="center" mr={1}>
                        {item.documentID ? (
                           <DocumentIcon color="primary" />
                        ) : (
                           <CollectionIcon color="secondary" />
                        )}
                     </Box>

                     <ListItemText
                        primary={getItemTitle(item)}
                        secondary={getItemSubtitle(item)}
                     />

                     <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                           size="small"
                           onClick={() => onMoveUp(item.id)}
                           disabled={index === 0}
                           title="Move up"
                        >
                           <ArrowUpIcon />
                        </IconButton>
                        <IconButton
                           size="small"
                           onClick={() => onMoveDown(item.id)}
                           disabled={index === sortedItems.length - 1}
                           title="Move down"
                        >
                           <ArrowDownIcon />
                        </IconButton>
                        <IconButton
                           size="small"
                           onClick={() => onRemoveItem(item.id)}
                           color="error"
                           title="Remove from collection"
                        >
                           <DeleteIcon />
                        </IconButton>
                     </Box>
                  </ListItem>
               ))}
            </List>
         )}
      </Box>
   );
};

export default CollectionItemList;