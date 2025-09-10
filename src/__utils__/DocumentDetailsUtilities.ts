import userEvnt from '@testing-library/user-event';
import {FieldDefinition} from "../types/fieldDefitions";
import {screen, waitFor, within} from "@testing-library/react";
import {startsWith} from "./testUtilities";
import {format} from "date-fns";

const userEvent = userEvnt.setup();

export const verifyField = (field: FieldDefinition, value: string | number) =>
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

export const verifyDateField = (field: FieldDefinition, value: Date | string | null | undefined) =>
{
   //search by Tooltip first as it is the containing element
   const dateField = screen.getByLabelText(`${field.label}`);
   expect(dateField).toBeInTheDocument();

   //hard-coded Format String

   if (value && typeof value == "string") { value = new Date(value); }

   //because placeholder isn't a valid format string
   const formatStr = 'MM/dd/yyyy hh:mm aaa';
   // @ts-ignore
   const expDate = value ? format(value, formatStr) : '';

   expect(dateField).toHaveValue(expDate);
}
