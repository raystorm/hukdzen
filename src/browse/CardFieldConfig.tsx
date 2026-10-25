import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import { DocumentFieldDefinition, SummaryFieldsDefinition } from '../types/fieldDefitions';

interface CardFieldConfigProps {
   visibleFields: string[];
   onFieldToggle: (field: string) => void;
}

/**
 * Flattens `DocumentFieldDefinition` into selectable fields.
 * Nested (Summary) entries become `parent_child` keys (eg `eng_title`),
 * matching the keys stored in `visibleFields`.
 */
const availableFields = Object.entries(DocumentFieldDefinition).flatMap(
   ([key, def]) =>
      'label' in def ?
         [{ key, label: def.label }] :
         Object.entries(def as SummaryFieldsDefinition)
               .map(([childKey, child]) => ({ key:   `${key}_${childKey}`,
                                              label: child.label }))
);

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