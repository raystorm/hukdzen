import React from 'react';
import { Grid } from '@mui/material';
import { DocumentDetails } from '../docs/DocumentTypes';
import { ContentCard } from './ContentCard';

interface ContentGridProps {
   documents: DocumentDetails[];
   visibleFields: string[];
}

export const ContentGrid: React.FC<ContentGridProps> = ({ documents, visibleFields }) => {
   return (
      <Grid container spacing={2}>
         {documents.map((document) => {
            if (!document) { return null; }
            return (
               <Grid item xs={12} sm={6} md={4} key={document.id}>
                  <ContentCard document={document} visibleFields={visibleFields} />
               </Grid>
            );
         })}
      </Grid>
   );
};