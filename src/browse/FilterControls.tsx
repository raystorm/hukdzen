import React, { useCallback, useMemo } from 'react';
import {
   Autocomplete, Chip, Divider, TextField, Button,
   Typography,
   Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DocumentDetails } from '../docs/DocumentTypes';
import { BrowseFilters, DateRangeFilter } from './browseSlice';
import { printName } from '../types';
import { DocumentDetailsFieldDefinition } from '../types/fieldDefitions';

/** internal value, to treat as null/empty placeholder */
const EMPTY_FILTER_VALUE = '<empty>';
/** Display/Label to Show users when Selecting a null/empty value for filter */
const EMPTY_FILTER_LABEL = 'empty (lug̱awdi)';

interface FilterControlsProps {
   documents: DocumentDetails[];
   filters: BrowseFilters;
   onFiltersChange: (filters: Partial<BrowseFilters>) => void;
   onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({documents, filters,
                                                               onFiltersChange, onClearFilters, }) =>
{
   const filterableFields = useMemo(() => {
      return Object.entries(DocumentDetailsFieldDefinition)
                   .filter(([key]) => key !== 'box') // Exclude box field as requested
                   .map(([key, def]) => ({ key, ...def }));
   }, []);

   const getUniqueValues = useCallback((field: string) =>
   {
      const values = documents.map(doc => {
         const value = doc[field as keyof DocumentDetails];
         if (field === 'author' || field === 'docOwner')
         {
            return value ? { id: (value as any).id, name: printName(value as any) }
                         : null;
         }
         return value;
      }).filter(Boolean);

      if (field === 'author' || field === 'docOwner')
      {
         const uniquePpl = Array.from(new Set(values.map((v: any) => v.id)))
                             .map(id => values.find((v: any) => v.id === id));
         return [{ id: EMPTY_FILTER_VALUE, name: EMPTY_FILTER_LABEL }, ...uniquePpl];
      }
      const uniqueVals = Array.from(new Set(values))
      return [EMPTY_FILTER_VALUE, ...uniqueVals];
   }, [documents]);

   const handleDateRangeChange = useCallback((field: 'created' | 'updated',
                                              range: DateRangeFilter) =>
   { onFiltersChange({ [field]: range }); }, [onFiltersChange]);

   return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,
                   marginTop: '-2.2em' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between',
                     alignItems: 'center'}}>
            <h4 style={{marginBottom: '0', fontSize: 'medium'}}>ksi niits</h4>
            <Button style={{marginTop: '0'}} onClick={onClearFilters}>
              Clear All
            </Button>
          </Box>

          {filterableFields.map(field =>
          {
             const fieldType = typeof documents[0]?.[field.key as keyof DocumentDetails];
             const isDateField = field.key === 'created' || field.key === 'updated';
             const isObjectField = field.key === 'author' || field.key === 'docOwner';

             const renderDateField = (params) => <TextField {...params} />

             if (isDateField)
             {
                return (
                   <Box key={field.key}>
                      <Typography variant="subtitle2" gutterBottom>{field.label} Range</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                        <DatePicker label="From"
                           value={filters[field.key as keyof BrowseFilters]?.from ?
                                  new Date(filters[field.key as keyof BrowseFilters].from) : null}
                           onChange={(date) => handleDateRangeChange(field.key as 'created' | 'updated',
                           {
                              ...filters[field.key as keyof BrowseFilters],
                              from: date?.toISOString()
                           })}
                           renderInput={renderDateField}
                        />
                        <DatePicker label="To"
                           value={filters[field.key as keyof BrowseFilters]?.to ?
                                  new Date(filters[field.key as keyof BrowseFilters].to) : null}
                           onChange={(date) => handleDateRangeChange(field.key as 'created' | 'updated',
                           {
                              ...filters[field.key as keyof BrowseFilters],
                              to: date?.toISOString()
                           })}
                           renderInput={renderDateField}
                        />
                      </Box>
                   </Box>
                );
             }

             const options = getUniqueValues(field.key);
             const filterKey = isObjectField ?
           (field.key === 'author' ? 'authors' : 'docOwners') :
           (field.key + 's') as keyof BrowseFilters;

             return (
                <Autocomplete
                   key={field.key}
                   multiple
                   freeSolo={!isObjectField}
                   options={options}
                   getOptionLabel={(option) => {
                      if (isObjectField) { return (option as any).name; }
                      return option === EMPTY_FILTER_VALUE ? EMPTY_FILTER_LABEL : String(option);
                   }}
                   // @ts-ignore
                   value={isObjectField ?
                                                        // @ts-ignore
                      options.filter((opt: any) => filters[filterKey]?.includes(opt.id)) :
                      filters[filterKey] || []}
                   onChange={(_, newValue) => {
                      const value = isObjectField ?
                         newValue.map((v: any) => v.id) :
                         newValue;
                      onFiltersChange({ [filterKey]: value });
                   }}
                   renderInput={(params) => <TextField {...params} label={field.label} size="small" />}
                   renderOption={(props, option, { index }) =>
                   {
                      const isEmptyOption = isObjectField ? 
                         (option as any).id === EMPTY_FILTER_VALUE : option === EMPTY_FILTER_VALUE;
                      
                      return (
                         <Box key={isObjectField ? (option as any).id : option}>
                            <Box component="li" {...props}
                                 sx={{
                                    fontWeight: isEmptyOption ? 'bold' : 'normal',
                                    fontStyle: isEmptyOption ? 'italic' : 'normal',
                                 }}
                            >
                               {isObjectField ? (option as any).name
                                : (option === EMPTY_FILTER_VALUE ? EMPTY_FILTER_LABEL : String(option))}
                            </Box>
                            {isEmptyOption && <Divider sx={{ my: 0.5, mx: 2, backgroundColor: '#e0e0e0' }} />}
                         </Box>
                      );
                   }}
                   renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                         <Chip {...getTagProps({ index })}
                            key={isObjectField ? (option as any).id : index}
                            label={isObjectField ? 
                               ((option as any).id === EMPTY_FILTER_VALUE ? EMPTY_FILTER_LABEL : (option as any).name) :
                               (option === EMPTY_FILTER_VALUE ? EMPTY_FILTER_LABEL : String(option))}
                            size="small" />
                      ))
                   }
                />
             );
          })}
        </Box>
      </LocalizationProvider>
   );
};