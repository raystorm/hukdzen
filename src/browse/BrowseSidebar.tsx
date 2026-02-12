import React, {useMemo} from 'react';
import {
   Accordion, AccordionSummary, AccordionDetails,
   Typography, Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { theme } from '../components/shared/theme';
import { CardFieldConfig } from './CardFieldConfig';
import { FilterControls } from './FilterControls';
import { DocumentDetails } from '../docs/DocumentTypes';

import { BrowseFilters } from "./browseTypes";

interface BrowseSidebarProps {
   visibleFields: string[];
   onFieldToggle: (field: string) => void;
   documents: DocumentDetails[];
   filters: BrowseFilters;
   onFiltersChange: (filters: Partial<BrowseFilters>) => void;
   onClearFilters: () => void;
}

export const BrowseSidebar: React.FC<BrowseSidebarProps> = ({
   visibleFields,
   onFieldToggle,
   documents,
   filters,
   onFiltersChange,
   onClearFilters,
}) => {

   const displayFieldsConfig = useMemo(() => {
      return <CardFieldConfig visibleFields={visibleFields}
                              onFieldToggle={onFieldToggle}
             />
   }, [visibleFields, onFieldToggle]);

   return (
      <Box sx={{ width: '100%', marginRight: '1rem' }}>
         <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               {/*TODO: move displayFields to a constant, for il8n*/}
               <h3 style={{textDecoration: `underline ${theme.palette.secondary.main}` }}>
                  Display Fields
               </h3>
            </AccordionSummary>
            <AccordionDetails>
               {displayFieldsConfig}
            </AccordionDetails>
         </Accordion>

         <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3 style={{textDecoration: `underline ${theme.palette.secondary.main}` }}>
                Filters
              </h3>
            </AccordionSummary>
            <AccordionDetails>
              <FilterControls documents={documents} filters={filters}
                              onFiltersChange={onFiltersChange}
                              onClearFilters={onClearFilters}
              />
            </AccordionDetails>
         </Accordion>
      </Box>
   );
};