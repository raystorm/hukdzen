import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { DocumentDetails } from '../docs/DocumentTypes';
import { DocumentDetailsFieldDefinition } from '../types/fieldDefitions';
import { printName } from "../types";


interface ContentCardProps {
   document: DocumentDetails;
   visibleFields: string[];
}

export const ContentCard: React.FC<ContentCardProps> = ({ document, visibleFields }) =>
{
   const navigate = useNavigate();

   const getFieldValue = (field: string): string => {
      const value = (document as any)[field] || '';
      if ( typeof value === 'string' ) { return value }
      if ( typeof value === 'number' ) { return value.toString(); }
      //assume `printableNameType`  object
      return printName(value);
   };

   const handleClick = () => {
      navigate(`/item/${document.id}`);
   };

   if ( !document ) { return <></>; }

   return (
      <Card sx={{ minWidth: 275, margin: 1, cursor: 'pointer', textAlign: 'left' }}
            onClick={handleClick}>
         <CardContent>
            {visibleFields.map((field) => {
               const value = getFieldValue(field);
               //if (!value) { return null; }

               const fieldKey = field as keyof typeof DocumentDetailsFieldDefinition;

               return (
                  <Typography key={field} variant="body2" component="div" sx={{ mb: 1 }}>
                     <strong>
                       {DocumentDetailsFieldDefinition[fieldKey]?.label || field}:
                     </strong>
                     {value}
                  </Typography>
               );
            })}
         </CardContent>
      </Card>
   );
};