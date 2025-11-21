import React from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { DocumentDetailsFieldDefinition } from '../types/fieldDefitions';

interface CardFieldConfigProps {
   visibleFields: string[];
   onFieldToggle: (field: string) => void;
}

const availableFields = Object.entries(DocumentDetailsFieldDefinition).map(([key, def]) => ({
   key,
   label: def.label
}));

export const CardFieldConfig: React.FC<CardFieldConfigProps> = ({ visibleFields, onFieldToggle }) => {
   return (
      <FormControl component="fieldset">
         {/*<Typography variant="h6" gutterBottom>Card Fields</Typography>*/}
         <h4 style={{marginTop: '-2.5em', fontSize: 'medium'}}>Gwiniits'n</h4>
         <FormGroup>
            {availableFields.map((field) => (
               <FormControlLabel
                  key={field.key}
                  control={
                     <Checkbox
                        checked={visibleFields.includes(field.key)}
                        onChange={() => onFieldToggle(field.key)}
                     />
                  }
                  label={field.label}
               />
            ))}
         </FormGroup>
      </FormControl>
   );
};