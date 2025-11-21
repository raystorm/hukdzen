import React, { useCallback, useMemo } from 'react';
import {
   Autocomplete,
   TextField,
   Chip,
   Box,
   Typography,
   Button,
} from '@mui/material';
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DocumentDetails } from '../docs/DocumentTypes';
import { BrowseFilters, DateRangeFilter } from './browseSlice';
import { printName } from '../types';

interface FilterControlsProps {
   documents: DocumentDetails[];
   filters: BrowseFilters;
   onFiltersChange: (filters: Partial<BrowseFilters>) => void;
   onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({documents, filters,
                                                               onFiltersChange, onClearFilters, }) =>
{
   const uniqueAuthors = useMemo(() =>
   {
      const authors = documents.map(doc => doc.author).filter(Boolean);
      return Array.from(new Set(authors.map(author => author.id)))
                  .map(id => authors.find(author => author.id === id)!)
                  .map(author => ({ id: author.id, name: printName(author) }));
   }, [documents]);

   const uniqueOwners = useMemo(() =>
   {
      const owners = documents.map(doc => doc.docOwner).filter(Boolean);
      return Array.from(new Set(owners.map(owner => owner.id)))
                  .map(id => owners.find(owner => owner.id === id)!)
                  .map(owner => ({ id: owner.id, name: printName(owner) }));
   }, [documents]);

   const uniqueTypes = useMemo(() =>
   {
      return Array.from(new Set(documents.map(doc => doc.type).filter(Boolean)));
   }, [documents]);

   const handleDateRangeChange = useCallback((field: 'created' | 'updated',
                                              range: DateRangeFilter) =>
   { onFiltersChange({ [field]: range }); }, [onFiltersChange]);

   return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,
                    marginTop: '-2em'  }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between',
                       alignItems: 'center'}}>
               {/*<Typography variant="h6">Filters</Typography>*/}
               <h4 style={{fontSize: 'medium'}}>ksi niits</h4>
               <Button style={{marginTop: '0'}} onClick={onClearFilters}>
                 Clear All
               </Button>
            </Box>

            <Autocomplete
               multiple
               options={uniqueAuthors}
               getOptionLabel={(option) => option.name}
               value={uniqueAuthors.filter(author => filters.authors.includes(author.id))}
               onChange={(_, newValue) => onFiltersChange({ authors: newValue.map(v => v.id) })}
               renderInput={(params) => <TextField {...params} label="Authors" size="small" />}
               renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                     <Chip {...getTagProps({ index })} key={option.id} label={option.name} size="small" />
                  ))
               }
            />

            <Autocomplete
               multiple
               options={uniqueOwners}
               getOptionLabel={(option) => option.name}
               value={uniqueOwners.filter(owner => filters.docOwners.includes(owner.id))}
               onChange={(_, newValue) => onFiltersChange({ docOwners: newValue.map(v => v.id) })}
               renderInput={(params) => <TextField {...params} label="Document Owners" size="small" />}
               renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                     <Chip {...getTagProps({ index })} key={option.id} label={option.name} size="small" />
                  ))
               }
            />

            <Autocomplete
               multiple
               freeSolo
               options={uniqueTypes}
               value={filters.types}
               onChange={(_, newValue) => onFiltersChange({ types: newValue })}
               renderInput={(params) => <TextField {...params} label="File Types" size="small" />}
               renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                     <Chip {...getTagProps({ index })} key={index} label={option} size="small" />
                  ))
               }
            />

            <Box>
               <Typography variant="subtitle2" gutterBottom>Created Date Range</Typography>
               <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <DatePicker label="From"
                              value={filters.created.from ? new Date(filters.created.from) : null}
                              onChange={(date) => handleDateRangeChange('created', {
                                 ...filters.created,
                                 from: date?.toISOString()
                              })}
                              renderInput={(params) => <TextField {...params} />}
                              slotProps={{ textField: { size: 'small' } }}
                  />
                  <DatePicker
                     label="To"
                     value={filters.created.to ? new Date(filters.created.to) : null}
                     onChange={(date) => handleDateRangeChange('created', { 
                        ...filters.created, 
                        to: date?.toISOString() 
                     })}
                     renderInput={(params) => <TextField {...params} />}
                     slotProps={{ textField: { size: 'small' } }}
                  />
               </Box>
            </Box>

            <Box>
               <Typography variant="subtitle2" gutterBottom>Updated Date Range</Typography>
               <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <DatePicker
                     label="From"
                     value={filters.updated.from ? new Date(filters.updated.from) : null}
                     onChange={(date) => handleDateRangeChange('updated', { 
                        ...filters.updated, 
                        from: date?.toISOString() 
                     })}
                     renderInput={(params) => <TextField {...params} />}
                     slotProps={{ textField: { size: 'small' } }}
                  />
                  <DatePicker
                     label="To"
                     value={filters.updated.to ? new Date(filters.updated.to) : null}
                     onChange={(date) => handleDateRangeChange('updated', { 
                        ...filters.updated, 
                        to: date?.toISOString() 
                     })}
                     renderInput={(params) => <TextField {...params} />}
                     slotProps={{ textField: { size: 'small' } }}
                  />
               </Box>
            </Box>
         </Box>
      </LocalizationProvider>
   );
};