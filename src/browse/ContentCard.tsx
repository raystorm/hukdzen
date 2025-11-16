import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { DocumentDetails } from '../docs/DocumentTypes';
import { DocumentDetailsFieldDefinition } from '../types/fieldDefitions';

interface ContentCardProps {
   document: DocumentDetails;
   visibleFields: string[];
}

export const ContentCard: React.FC<ContentCardProps> = ({ document, visibleFields }) =>
{
   const navigate = useNavigate();

   const getFieldValue = (field: string): string => {
      return (document as any)[field] || '';
   };

   const handleClick = () => {
      navigate(`/item/${document.id}`);
   };

   return (
      <Card sx={{ minWidth: 275, margin: 1, cursor: 'pointer' }} onClick={handleClick}>
         <CardContent>
            {visibleFields.map((field) => {
               const value = getFieldValue(field);
               if (!value) return null;
               
               return (
                  <Typography key={field} variant="body2" component="div" sx={{ mb: 1 }}>
                     <strong>{DocumentDetailsFieldDefinition[field as keyof typeof DocumentDetailsFieldDefinition]?.label || field}:</strong> {value}
                  </Typography>
               );
            })}
         </CardContent>
      </Card>
   );
};