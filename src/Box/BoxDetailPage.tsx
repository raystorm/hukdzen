import React, { useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { Box, Card, CardContent, Divider, Tooltip, Button } from '@mui/material';
import { Description as DocumentIcon, Search as SearchIcon } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { boxActions } from './boxSlice';
import BoxForm from '../components/forms/BoxForm';
import { theme } from '../components/shared/theme';
import { documentListActions } from '../docs/docList/documentListSlice';
import { Grid, Typography } from '@mui/material';
import { printTitles, printName } from '../types';

const BoxDetailPage = () =>
{
   const { id } = useParams<{ id: string }>();
   const dispatch = useAppDispatch();
   
   const box = useAppSelector(state => state.box);
   const documents = useAppSelector(state => state.documentList.items);

   useEffect(() =>
   { if ( id ) { dispatch(boxActions.getBoxById(id)); } }, [id, dispatch]);

   useEffect(() =>
   { if ( id ) { dispatch(documentListActions.getDocumentsByBoxId(id)); } },
   [id, dispatch]);

   return (
      <Box className='twoColumn' sx={{ p: 4 }} gridTemplateColumns='minmax(auto, 36.5em) 1fr'>
         <Box>
            <BoxForm box={box} />
         </Box>
         
         <Box sx={{ borderLeft: `3px solid ${theme.palette.secondary.main}`, pl: 4 }}>
               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <h2>Documents</h2>
                  <Button
                     component={Link}
                     to={`/browse?boxId=${id}`}
                     variant="contained"
                     startIcon={<SearchIcon />}
                  >
                     Browse All
                  </Button>
               </Box>
               
               {0 === documents.length ? (
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                     No documents in this box yet.
                  </Typography>
               ) : (
                  <Grid container spacing={2}>
                     {documents.map((doc: any) => (
                        <Grid item xs={12} sm={6} key={doc.id}>
                           <Card sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}>
                              <CardContent>
                                 <Box display="flex" alignItems="center" mb={1}>
                                    <DocumentIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                       {printTitles(doc)}
                                    </Typography>
                                 </Box>
                                 <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: 'wrap' }}>
                                    <Tooltip title={printName(doc.contentOwner)} arrow>
                                       <Typography variant="body2" sx={{ 
                                          flex: '1 1 120px',
                                          minWidth: 0,
                                          overflow: 'hidden', 
                                          textOverflow: 'ellipsis', 
                                          whiteSpace: 'nowrap',
                                          textAlign: 'left'
                                       }}>
                                          <strong>Owner:</strong> {printName(doc.contentOwner)}
                                       </Typography>
                                    </Tooltip>
                                    <Divider orientation="vertical" flexItem 
                                             sx={{ borderWidth: 1, borderColor: theme.palette.secondary.main }} />
                                    <Tooltip title={printName(doc.author)} arrow>
                                       <Typography variant="body2" sx={{ 
                                          flex: '1 1 120px',
                                          minWidth: 0,
                                          overflow: 'hidden', 
                                          textOverflow: 'ellipsis', 
                                          whiteSpace: 'nowrap',
                                          textAlign: 'left' 
                                       }}>
                                          <strong>Author:</strong> {printName(doc.author)}
                                       </Typography>
                                    </Tooltip>
                                 </Box>
                              </CardContent>
                           </Card>
                        </Grid>
                     ))}
                  </Grid>
               )}
         </Box>
      </Box>
   );
};

export default BoxDetailPage;
