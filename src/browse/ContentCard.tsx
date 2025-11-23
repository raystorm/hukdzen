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
      // make responsive, set minWidth to em or rem
      <Card sx={{ minWidth: '250px', margin: 1, cursor: 'pointer', textAlign: 'left' }}
            onClick={handleClick}>
         <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
               {visibleFields.map((field) => {
                  const value = getFieldValue(field);
                  const fieldKey = field as keyof typeof DocumentDetailsFieldDefinition;
                  const label = DocumentDetailsFieldDefinition[fieldKey]?.label || field;

                  return (
                     <React.Fragment key={field}>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
                           {label}:
                        </Typography>
                        <Typography variant="body2" component="div">
                           {value}
                        </Typography>
                     </React.Fragment>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
};