import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, } from 'react-redux'
import { Link, useNavigate } from "react-router";
import { Box, Card, CardContent, TextField, Typography, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Inventory2 as BoxIcon } from '@mui/icons-material';

import {BOX_LIST_PATH, BOX_DETAIL_PATH} from "../../components/shared/constants";
import { theme } from '../../components/shared/theme';
import { useAppSelector } from '../../app/hooks';
import { useSkipRender } from "../../components/hooks/useSkipRender";

import { boxListActions } from './BoxListSlice';
import { printRole } from '../../Role/roleTypes';
import BoxForm from '../../components/forms/BoxForm';
import { boxActions } from '../boxSlice';
import { printName } from '../../types';
import {emptyBox, printBox} from "../boxTypes";


type BoxListPageProps = {}

const BoxListPage = (props: BoxListPageProps) => 
{
   const dispatch   = useDispatch();
   const navigate   = useNavigate();
   const skipRender = useSkipRender(BOX_LIST_PATH);

   const boxList  = useAppSelector(state => state.boxList);
   const box      = useAppSelector(state => state.box);
   const user     = useAppSelector(state => state.currentUser);
   const isAdmin  = Boolean(user.isAdmin);

   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() =>
   {
      if ( skipRender() ) { return; }
      if ( !boxList || !boxList.items || 0 === boxList.items.length )
      { dispatch(boxListActions.getAllWritableBoxes(user)); }
   }, [boxList, user, skipRender, dispatch]);

   const filteredBoxes = boxList.items.filter(b =>
   {
      if (!b)           { return false; }
      if (!searchTerm)  { return true;  }
      const search = searchTerm.toLowerCase();
      return (
         b.name?.toLowerCase().includes(search) ||
         b.waa?.toLowerCase().includes(search) ||
         printName(b.owner)?.toLowerCase().includes(search)
      );
   });

   const handleBoxClick = (boxId: string) =>
   { dispatch(boxActions.getBoxById(boxId)); };

   const handleBoxDoubleClick = (boxId: string) => { navigate(`/box/${boxId}`); };

   return ( 
      <Box sx={{ p: 3 }}>
         <h2>{isAdmin ? 'All Boxes (Admin)' : 'My Boxes'}</h2>
         <Typography variant="caption" color="text.secondary">
            Showing {filteredBoxes.length} of {boxList.items.length} boxes
         </Typography>
         
         <Box className='twoColumn' gridTemplateColumns='minmax(auto, 35em) 1fr'>
            <Box sx={{ pr: 3 }}>
               <TextField
                  fullWidth
                  placeholder="Filter boxes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <SearchIcon />
                        </InputAdornment>
                     ),
                  }}
               />
               
               <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  height: '70vh',
                  overflowY: 'scroll',
                  alignItems: 'stretch',
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
                  '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
               }}>
                  {filteredBoxes.length === 0 ? (
                     <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        No boxes found
                     </Typography>
                  ) : (
                     filteredBoxes.map(b => b && (
                        <Card
                           key={b.id}
                           onClick={() => handleBoxClick(b.id)}
                           onDoubleClick={() => handleBoxDoubleClick(b.id)}
                           sx={{
                              cursor: 'pointer',
                              border: box?.id === b.id ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                              '&:hover': { backgroundColor: '#f5f5f5' },
                              flexShrink: 0
                           }}
                        >
                           <CardContent sx={{ pt: 1, pb: 2 }}>
                              <Box display="flex" alignItems="center" mb={1}>
                                 <BoxIcon color="action" sx={{ mr: 1 }} />
                                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {printBox(b)}
                                 </Typography>
                              </Box>
                              <Box sx={{ display: 'grid', gridTemplateColumns: '6em 1fr', gap: '0.5em .2em' }}>
                                 <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'left' }}>Owner:</Typography>
                                 <Typography variant="body2" sx={{ textAlign: 'left' }}>{printName(b.owner)}</Typography>
                                 
                                 <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'left' }}>Purpose:</Typography>
                                 <Typography variant="body2" sx={{ textAlign: 'left' }}>{b.purpose}</Typography>
                                 
                                 <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'left' }}>Default Role:</Typography>
                                 <Typography variant="body2" sx={{ textAlign: 'left' }}>{printRole(b.defaultRole)}</Typography>
                              </Box>
                           </CardContent>
                        </Card>
                     ))
                  )}
               </Box>
            </Box>
            
            <Box sx={{ borderLeft: `3px solid ${theme.palette.secondary.main}`, pl: 4 }}>
               <BoxForm box={box} isAdminForm={isAdmin} />
               {box?.id && box.id !== emptyBox.id && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                     <Link to={`/box/${box.id}`} style={{ fontSize: '1.1em' }}>
                        View Box Details
                     </Link>
                  </Box>
               )}
            </Box>
         </Box>
      </Box>
   );
};

export default BoxListPage;