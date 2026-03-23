import React from 'react';
import { Grid } from '@mui/material';
import { ContentCard } from './ContentCard';

interface FieldDefinition {
   key: string;
   label: string;
}

interface ContentGridProps<T> {
   items: T[];
   fields: FieldDefinition[];
   onItemClick?: (item: T) => void;
   gridSize?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
   };
}

export const ContentGrid = <T extends Record<string, any>>({
   items,
   fields,
   onItemClick,
   gridSize
}: ContentGridProps<T>) => {
   return (
      <Grid container spacing={2} data-testid='card-grid'>
         {items?.map((item, index) => {
            const cardFields = fields.map(field => ({
               label: field.label,
               value: field.key.includes('.') ?
                      field.key.split('.').reduce((obj, key) => obj?.[key], item) ?? '' :
                      item[field.key]
            }));

            return (
               <ContentCard
                  key={item.id || index}
                  fields={cardFields}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                  gridSize={gridSize}
               />
            );
         })}
      </Grid>
   );
};