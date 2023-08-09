import React from 'react';
import {fireEvent, screen, waitFor, within} from '@testing-library/react';

import authorList from '../../../data/authorList.json';
import {renderWithState, startsWith} from '../../../__utils__/testUtilities';
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import AuthorInput, { AuthorInputProps } from "../AuthorInput";
import {setupAuthorListMocking, setupAuthorMocking} from "../../../__utils__/__fixtures__/AuthorAPI.helper";
import {emptyAuthorList} from "../../../Author/AuthorList/authorListType";
import {printGyet} from "../../../Gyet/GyetType";
import BoxForm from "../../forms/BoxForm";
import userEvent from "@testing-library/user-event";
import {AuthorFormTitle} from "../../forms/AuthorForm";

const author = authorList.items[0] as Author;

let savedAuthor = author;
const setAuthor = (auth: Author) => { savedAuthor = auth; }

const PROPS: AuthorInputProps = {
   author: author,
   setAuthor: setAuthor,
   name: author.name,
   label: 'LABEL',
   tooltip:  'THIS TESTS THE Author Input',
}

const STATE = {
   authorList: emptyAuthorList,

}

userEvent.setup();

describe('AuthorInput tests ', () => {

   beforeEach(() =>{
      setupAuthorListMocking();
      setupAuthorMocking();
   })

   test('Renders correctly', () =>{
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByLabelText(PROPS.tooltip)).toBeInTheDocument();
      expect(screen.getByLabelText(startsWith(PROPS.label))).toBeInTheDocument();
      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();
   });

   test('Can select author via keyboard arrows', async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      //TODO: figure out how to do this buy mouse click and text selection

      fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //open the menu
      fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the menu
      fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
      fireEvent.keyDown(textbox, { key: 'ArrowDown' });

      //screen.debug();

      fireEvent.keyDown(textbox, { key: 'Enter' });

      //screen.debug();

      await waitFor(() => {
         expect(screen.getByText(printGyet(auth2))).toBeInTheDocument();
      });
   });

   test('Can select author with typing', async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      userEvent.clear(textbox);
      userEvent.type(textbox, auth2.name);

      //TODO: figure out how to do this buy mouse click and text selection

      //fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //open the menu
      fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the menu
      //fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
      //fireEvent.keyDown(textbox, { key: 'ArrowDown' });

      screen.debug();

      fireEvent.keyDown(textbox, { key: 'Enter' });

      //screen.debug();

      await waitFor(() => {
         expect(screen.getByText(printGyet(auth2))).toBeInTheDocument();
      });
   });

   test('Can Open New Author Dialog with Enter', async () =>
   {
      renderWithState(STATE, <AuthorInput {...PROPS}/>);

      expect(screen.getByDisplayValue(printGyet(PROPS.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getByRole('combobox');
      //screen.debug(textbox);

      await userEvent.clear(textbox);
      await userEvent.type(textbox, `${auth2.name}[Enter]`);

      //screen.debug();

      await waitFor(() => {
         expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
      });
   });

   test('Can Open New Author Dialog with Add ', async () =>
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
   });

   /*
      TODO: flesh out with tests
          * Clear Selected Author
          * Add New Dialog
            * cancel
            * submit
   */
});
