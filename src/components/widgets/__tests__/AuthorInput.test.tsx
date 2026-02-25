import { vi } from 'vitest';
import React from 'react';
import { fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvnt from "@testing-library/user-event";

import { generateClient } from '@aws-amplify/api';

import {renderWithState, startsWith} from '../../../__utils__/testUtilities';

import * as queries from "../../../graphql/queries";

import authorList from '../../../__utils__/__fixtures__/authorList.json';
import { Author } from "../../../Author/AuthorType";
import AuthorInput, { AuthorInputProps } from "../AuthorInput";
import {
   defaultCreatedAuthor,
   setupAuthorListMocking,
   setupAuthorMocking
} from "../../../__utils__/__setup__/AuthorAPI.helper";
import {emptyAuthorList} from "../../../Author/AuthorList/authorListType";

import {printGyet} from "../../../Gyet/GyetType";

import { AuthorFormTitle } from "../../forms/AuthorForm";
import { authorActions } from "../../../Author/authorSlice";

const client = generateClient();

const author = authorList.items[0] as Author;

let savedAuthor = author;
const setAuthor = (auth: Author) => { savedAuthor = auth; }

const PROPS: AuthorInputProps = {
   author: savedAuthor,
   setAuthor: setAuthor,
   name: savedAuthor.name,
   label: 'LABEL',
   tooltip:  'THIS TESTS THE Author Input',
   preserveState: () => {}
}

const STATE = {
   //authorList: emptyAuthorList,
   authorList: authorList,
}

const userEvent = userEvnt.setup();


describe('AuthorInput tests', () => {

   beforeEach(() => {
      setupAuthorListMocking();
      setupAuthorMocking();
   })

   test('Renders correctly', () =>{
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByLabelText(PROPS.tooltip)).toBeInTheDocument();
      expect(screen.getByLabelText(startsWith(PROPS.label))).toBeInTheDocument();
      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();
   });

   test('Close Icon removes input', async() => {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      const printedAuthor = printGyet(PROPS.author);
      expect(screen.getByRole('combobox')).toHaveDisplayValue(printedAuthor);

      await userEvent.click(screen.getByTestId('CloseIcon'));

      await waitFor(() => {
         expect(screen.getByRole('combobox')).not.toHaveDisplayValue(printedAuthor);
      });
   });

   test('Can list pulls properly from backend, when not part of state',
        async () =>
   {
      const emptyState = { };
      //const { store } =
      renderWithState(emptyState, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      await waitFor(() => {
         const ql = expect.objectContaining({query: queries.listAuthors});
         expect(client.graphql).toHaveBeenCalledWith(ql);
      },{timeout: 2000});

      const auth2 = authorList.items[2] as Author;

      const printedAuth2 = printGyet(auth2);
      expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

      const textbox = screen.getByLabelText(startsWith(PROPS.label));

      await userEvent.type(textbox, '[ArrowDown]');

      await waitFor(() => {
        expect(within(screen.getByRole('presentation')).getByText(printedAuth2))
          .toBeVisible();
      });
   },3000);

   test('Can select author via keyboard arrows',
        async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      const printedAuth2 = printGyet(auth2);
      expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

      const textbox = screen.getByLabelText(startsWith(PROPS.label));

      // Click to focus and open dropdown
      await userEvent.click(textbox);

      // Wait for dropdown to appear
      await waitFor(() => {
         expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await userEvent.type(textbox, //'[ArrowDown][ArrowDown][Enter]');
                           '[arrowdown][arrowdown][enter]');

      await waitFor(() => {
         expect(screen.getByRole('combobox')).toHaveDisplayValue(printedAuth2)
      });
   });

   test('Can select author with typing', async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      const printedAuth2 = printGyet(auth2);
      expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      await userEvent.clear(textbox);
      await userEvent.type(textbox, printedAuth2);

      await userEvent.type(textbox, '[ArrowDown][Enter]');

      await waitFor(() => {
         expect(screen.getByRole('combobox')).toHaveDisplayValue(printedAuth2)
      });
   }, 20000);

   test('Can Open New Author Dialog with Enter', async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');

      await userEvent.clear(textbox);
      await userEvent.type(textbox, `${auth2.name}[Enter]`);

      await waitFor(() => {
         expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
      });
   }, 10000);

   test('Can Open New Author Dialog with Add', async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      await userEvent.clear(textbox);
      await userEvent.type(textbox, auth2.name);
      //screen.debug(screen.getByRole('presentation'));
      await waitFor(() => {
         expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
      });
      //screen.debug();
      await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

      //screen.debug();

      await waitFor(() => {
         expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
      });
   }, 10000);

   test('Cancel Button Closes the new Author Dialog', async () =>
   {
      const {store} = renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      await userEvent.clear(textbox);
      await userEvent.type(textbox, `${auth2.name}[Enter]`);

      //screen.debug();
      // @ts-ignore //verify current dispatch count
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      await waitFor(() => {
         expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
      });

      //close the dialog
      await userEvent.click(screen.getByText('Cancel'));

      //verify closed
      await waitFor(() => {
         expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();
      });

      //verify no new dispatches
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

   }, 10000);

   test('Dialog Add Button Creates a new Author', async () =>
   {
      const {store} = renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      const createMe = defaultCreatedAuthor.name;

      await userEvent.clear(textbox);
      await userEvent.type(textbox, `${createMe}[Enter]`);

      //screen.debug();
      // @ts-ignore //verify current dispatch count
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      await waitFor(() => {
         expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
      });

      //close the dialog
      await userEvent.click(screen.getByText('Add'));

      //verify closed
      await waitFor(() => {
         expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();
      });

      //verify no new dispatches
      await waitFor(() => {
         const expName = expect.objectContaining({name: createMe});
         const action = authorActions.createAuthor(expName);
         expect(store.dispatch).toHaveBeenCalledWith(action);
      });

      await waitFor(() => {
        expect(store?.getState().author).toHaveProperty('name', createMe);
      });
   }, 15000);
});
