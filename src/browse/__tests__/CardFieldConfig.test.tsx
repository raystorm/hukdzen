import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CardFieldConfig } from '../CardFieldConfig';
import { DocumentFieldDefinition as fd } from '../../types/fieldDefitions';

const languageFields = [
   { key: 'eng_title',       label: fd.eng.title.label },
   { key: 'eng_description', label: fd.eng.description.label },
   { key: 'bc_title',        label: fd.bc.title.label },
   { key: 'bc_description',  label: fd.bc.description.label },
   { key: 'ak_title',        label: fd.ak.title.label },
   { key: 'ak_description',  label: fd.ak.description.label },
];

const renderConfig = (visibleFields: string[] = []) =>
{
   const onFieldToggle = vi.fn();
   render(<CardFieldConfig visibleFields={visibleFields}
                           onFieldToggle={onFieldToggle} />);
   return onFieldToggle;
};

describe('CardFieldConfig', () =>
{
   test('renders a checkbox for each language field', () =>
   {
      renderConfig();

      languageFields.forEach(({ label }) =>
      { expect(screen.getByRole('checkbox', { name: label })).toBeInTheDocument(); });
   });

   test('checks only the language fields in visibleFields', () =>
   {
      renderConfig(['eng_title', 'bc_title', 'ak_title']);

      [fd.eng.title, fd.bc.title, fd.ak.title].forEach(({ label }) =>
      { expect(screen.getByRole('checkbox', { name: label })).toBeChecked(); });

      [fd.eng.description, fd.bc.description, fd.ak.description]
         .forEach(({ label }) =>
         { expect(screen.getByRole('checkbox', { name: label })).not.toBeChecked(); });
   });

   test.each(languageFields)('toggling $label calls onFieldToggle with $key',
      async ({ key, label }) =>
   {
      const onFieldToggle = renderConfig();

      await userEvent.click(screen.getByRole('checkbox', { name: label }));

      //exactly one call with the parent_child key, so never 'eng', 'bc' or 'ak'
      expect(onFieldToggle).toHaveBeenCalledTimes(1);
      expect(onFieldToggle).toHaveBeenCalledWith(key);
   });

   test.each([
      { key: 'type',    label: fd.type.label },
      { key: 'created', label: fd.created.label },
   ])('non-nested $label keeps its own key $key', async ({ key, label }) =>
   {
      const onFieldToggle = renderConfig();

      await userEvent.click(screen.getByRole('checkbox', { name: label }));

      expect(onFieldToggle).toHaveBeenCalledTimes(1);
      expect(onFieldToggle).toHaveBeenCalledWith(key);
   });
});
