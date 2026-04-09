import userEvnt from '@testing-library/user-event';
import { FieldDefinition } from "../../types/fieldDefitions";
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { format } from "date-fns";
import { dropFilesText } from "../../components/widgets/AWSFileUploader";

import { DocumentFieldDefinition as fd } from '../../types/fieldDefitions';
import { startsWith } from "../../__utils__/testUtilities";

import type { Box } from "../../Box/boxTypes";
import { printBox } from "../../Box/boxTypes";

import { loadLocalFile } from "../../__utils__/fileUtilities";


const userEvent = userEvnt.setup();

export const verifyField = (field: FieldDefinition, value: string | number | null) =>
{
   //search by Tooltip first as it is the containing element
   const tooltipField = screen.getByLabelText(`${field.description}`);
   expect(tooltipField).toBeInTheDocument();
   const title = within(tooltipField).getByLabelText(startsWith(field.label));
   expect(title).toBeInTheDocument();
   expect(title).toHaveValue(value);
}

export const verifyCanChangeField = async (field: FieldDefinition, value: string) =>
{
   verifyField(field, value);

   const changedValue = 'I have been changed';
   await userEvent.clear(screen.getByLabelText(field.label));
   await userEvent.type(screen.getByLabelText(field.label), changedValue);

   await waitFor(() =>
                 { expect(screen.getByLabelText(field.label)).toHaveValue(changedValue); });

   verifyField(field, changedValue);
}

export const verifyDateField = (field: FieldDefinition,
                                value: Date | string | null | undefined) =>
{
   //search by Tooltip first as it is the containing element
   const dateField = screen.getByLabelText(field.label);
   expect(dateField).toBeInTheDocument();

   if ( !value )
   {
      expect(dateField).toHaveValue('');
      return
   }

   //ensure we have a date typed object to format
   let dt: Date;
   if (typeof value == "string") { dt = new Date(value); }
   else { dt = value; }

   //because placeholder isn't a valid format string
   const formatStr = 'MM/dd/yyyy hh:mm aaa';
   const expDate = format(dt, formatStr);

   expect(dateField).toHaveValue(expDate);
}

export const openBoxDropdown = async () =>
{
   const boxField = screen.getByTestId('box');
   const boxButton = within(boxField).getByRole('combobox');

   await userEvent.click(boxButton);
};


export const selectBox = async (box: Box) =>
{
   await openBoxDropdown();

   const optionText = printBox(box);
   await waitFor(() => {
      expect(screen.getByText(optionText)).toBeInTheDocument();
   });

   //Select an option and close it.
   await userEvent.click(screen.getByText(optionText));
};

export const startFileUpload = async (filePath: string) =>
{
   const dropZone = screen.getByText(dropFilesText);
   expect(dropZone).toBeInTheDocument();

   const file = loadLocalFile(filePath);

   act(() => { fireEvent.drop(dropZone, { dataTransfer: { files: [file] } }); });

   return file;
};

export const verifyInitialUpload = async (fileName: string, fileType: string) =>
{
   // File type field updated
   await waitFor(() =>
   { expect(screen.getByLabelText(fd.type.label)).toHaveValue(fileType); },
   { timeout: 2000 }); //wait 2 seconds for the upload

   // Preview filename appears
   await waitFor(() =>
   { expect(screen.getByText(fileName)).toBeInTheDocument(); },
   { timeout: 2000 }); //wait 2 seconds for the upload
};


export const waitForUploadComplete = async () =>
{
   await waitFor(() => {
      expect(screen.getByText('Uploaded')).toBeInTheDocument();
   });
};

