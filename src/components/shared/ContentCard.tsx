import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { printName, printableNameType } from '../../types';

interface Field {
   label: string;
   value: any;
}

interface ContentCardProps {
   onClick?: () => void;
   fields: Field[];
   gridSize?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
   };
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
   onClick, 
   fields,
   gridSize = { xs: 12, sm: 6, md: 4 } 
}) =>
{
   const printFieldValue = (
      value: (string | number | printableNameType | React.ReactElement)
   ): React.ReactNode =>
   {
      if ( React.isValidElement(value) ) { return value; }
      if ( typeof value === 'string' )   { return value }
      if ( typeof value === 'number' )   { return value.toString(); }
      //assume `printableNameType`  object
      return printName(value as printableNameType);
   };

   return (
      <Grid item {...gridSize}>
         <Card 
            sx={{ minWidth: '250px', margin: 1,
                  cursor: onClick ? 'pointer' : 'default',
                  textAlign: 'left',
                  '&:hover': onClick ? { elevation: 4 } : {}
            }} 
            onClick={onClick}
         >
            <CardContent>
               <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
                  {fields?.map((field, index) => (
                     <React.Fragment key={index}>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
                           {field.label}:
                        </Typography>
                        <Typography variant="body2" component="div">
                           {printFieldValue(field.value)}
                        </Typography>
                     </React.Fragment>
                  ))}
               </div>
            </CardContent>
         </Card>
      </Grid>
   );
};