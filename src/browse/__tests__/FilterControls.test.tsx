import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import docList from '../../__utils__/__fixtures__/docList.json';

import { FilterControls } from '../FilterControls';
import { emptyBrowseState } from '../browseTypes';
import { Document } from '../../docs/DocumentTypes';
import { DocumentFieldDefinition as fd } from '../../types/fieldDefitions';

const documents = docList.items as Document[];

const distinct = (values: (string | undefined)[]) =>
                                   Array.from(new Set(values.filter(Boolean)));

const languageFields = [
   { filterKey: 'eng_titles',       label: fd.eng.title.label,
     getValue: (d: Document) => d.eng?.title },
   { filterKey: 'eng_descriptions', label: fd.eng.description.label,
     getValue: (d: Document) => d.eng?.description },
   { filterKey: 'bc_titles',        label: fd.bc.title.label,
     getValue: (d: Document) => d.bc?.title },
   { filterKey: 'bc_descriptions',  label: fd.bc.description.label,
     getValue: (d: Document) => d.bc?.description },
   { filterKey: 'ak_titles',        label: fd.ak.title.label,
     getValue: (d: Document) => d.ak?.title },
   { filterKey: 'ak_descriptions',  label: fd.ak.description.label,
     getValue: (d: Document) => d.ak?.description },
];

const renderFilters = (filters = emptyBrowseState.filters) =>
{
   const onFiltersChange = vi.fn();
   render(<FilterControls documents={documents} filters={filters}
                          onFiltersChange={onFiltersChange}
                          onClearFilters={vi.fn()} />);
   return onFiltersChange;
};

const openFilter = async (label: string) =>
   await userEvent.click(screen.getByRole('combobox', { name: label }));

describe('FilterControls', () =>
{
   test.each(languageFields)('renders one labeled $label filter',
      ({ label }) =>
   {
      renderFilters();

      expect(screen.getAllByRole('combobox', { name: label })).toHaveLength(1);
   });

   test('has no unlabeled filter inputs', () =>
   {
      renderFilters();

      expect(screen.queryAllByRole('combobox', { name: '' })).toHaveLength(0);
   });

   test.each(languageFields)('$label options are the distinct document values',
      async ({ label, getValue }) =>
   {
      renderFilters();

      await openFilter(label);

      //first option is the existing empty-value option
      const [, ...options] = screen.getAllByRole('option')
                                   .map(option => option.textContent);
      expect(options).toEqual(distinct(documents.map(getValue)));
      expect(options).not.toContain('[object Object]');
   });

   test.each(languageFields)('selecting from $label sets $filterKey',
      async ({ filterKey, label, getValue }) =>
   {
      const onFiltersChange = renderFilters();
      const [value] = distinct(documents.map(getValue));

      await openFilter(label);
      await userEvent.click(screen.getByRole('option', { name: value }));

      //one call, with only the parent_child filter key (never engs, bcs, aks)
      expect(onFiltersChange).toHaveBeenCalledTimes(1);
      expect(onFiltersChange).toHaveBeenCalledWith({ [filterKey]: [value] });
   });

   test('shows a selected eng_titles value as a chip', () =>
   {
      const title = documents[0].eng.title;

      renderFilters({ ...emptyBrowseState.filters, eng_titles: [title] });

      expect(screen.getByText(title)).toBeInTheDocument();
   });

   test('selecting a File Type still sets types', async () =>
   {
      const onFiltersChange = renderFilters();
      const type = documents[0].type;

      await openFilter(fd.type.label);
      await userEvent.click(screen.getByRole('option', { name: type }));

      expect(onFiltersChange).toHaveBeenCalledTimes(1);
      expect(onFiltersChange).toHaveBeenCalledWith({ types: [type] });
   });
});
