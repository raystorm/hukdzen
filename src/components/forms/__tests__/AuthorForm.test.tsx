import react from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvnt from '@testing-library/user-event'

import authorList from '../../../data/authorList.json';
import userList from '../../../data/userList.json';

import {Clans, printClanType, ClanType} from "../../../Gyet/ClanType";
import AuthorForm from '../AuthorForm'
import { 
  contains, startsWith, renderWithState,
} from '../../../__utils__/testUtilities';

import {Author} from "../../../Author/AuthorType";
import {authorActions} from "../../../Author/authorSlice";
import {
  AuthorPrinter,
  setupAuthorListMocking,
  setupAuthorMocking, setUpdatedAuthor
} from "../../../__utils__/__fixtures__/AuthorAPI.helper";
import {emptyAuthorList} from "../../../Author/AuthorList/authorListType";
import {User} from "../../../User/userType";


//test constants
const TEST_AUTHOR: Author = authorList.items[1] as Author;
const USER = userList.items[0] as User;

let TEST_STATE = {
  author: { ...TEST_AUTHOR },
};

const userEvent = userEvnt.setup();

describe('AuthorForm', () => {

  beforeEach(() => {
    setupAuthorMocking();
    setupAuthorListMocking();
  });
  
  test('Renders correctly', async () =>
  { 
    renderWithState(TEST_STATE, <AuthorForm author={TEST_AUTHOR}/>);

    const idField = screen.getByTestId('id');
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(TEST_AUTHOR.id)).toBeInTheDocument();
    
    //regex for startsWith
    expect(screen.getByLabelText(startsWith('Name'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(TEST_AUTHOR.name);
    
    expect(screen.getByLabelText(startsWith('E-Mail'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('E-Mail'))).toHaveValue(TEST_AUTHOR.email);
    
    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(TEST_AUTHOR.clan)}`))
       .toBeInTheDocument()

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(TEST_AUTHOR.waa);
  });

  test('Renders correctly when new', async () =>
  {
    renderWithState(TEST_STATE, <AuthorForm author={TEST_AUTHOR} isNew={true}/>);

    const idField = screen.getByTestId('id');
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(TEST_AUTHOR.id)).toBeInTheDocument();

    //regex for startsWith
    expect(screen.getByLabelText(startsWith('Name'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(TEST_AUTHOR.name);

    expect(screen.getByLabelText(startsWith('E-Mail'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('E-Mail'))).toHaveValue(TEST_AUTHOR.email);

    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(TEST_AUTHOR.clan)}`))
       .toBeInTheDocument()

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(TEST_AUTHOR.waa);

    expect(screen.getByRole('button')).toHaveTextContent('Create');
  });

  test('E-mail validation works', async () =>
  {
    const STATE = { ...TEST_STATE };
    renderWithState(STATE, <AuthorForm author={TEST_AUTHOR}/>);

    const getEmailField = () => 
    { return screen.getByLabelText(startsWith('E-Mail')); };

    const emailField = getEmailField();
    await userEvent.clear(emailField);
    await userEvent.type(emailField, 'not_a_valid_email');

    await waitFor(() => 
    { expect(screen.getByText(contains('Invalid'))).toBeInTheDocument(); });

    //test that, fixing it clears the error state
    const validEmail = 'new-valid-email@example.com';
    const emailFld = getEmailField();
    await userEvent.clear(emailFld);
    await userEvent.type(emailFld, validEmail);

    await waitFor(() => { expect(getEmailField()).toHaveValue(validEmail); });
    await waitFor(() => {
       expect(screen.queryByText(contains('Invalid'))).not.toBeInTheDocument();
    });
  }, 10000);

  test('able to set Name', async () =>
  {
    const STATE = { ...TEST_STATE };
    renderWithState(STATE, <AuthorForm author={TEST_AUTHOR}/>);

    const changedValue = 'A Different Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(changedValue);
    });
  });

  test('able to set Waa', async () =>
  {
    //const USER  = { ...TEST_AUTHOR,  isAdmin: true, };
    const STATE = { ...TEST_STATE,   currentUser: { ...USER } };
    renderWithState(STATE, <AuthorForm author={TEST_AUTHOR}/>);

    const changedValue = 'A Different Value';

    const waaField = screen.getByLabelText(startsWith('Waa'));
    await userEvent.clear(waaField);    
    await userEvent.type(waaField, changedValue);

    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Waa'))).toHaveValue(changedValue);
    });
  });

  test('able to change selected Clan', async () =>
  {
    //const USER  = { ...TEST_AUTHOR,  isAdmin: true, };
    //const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    renderWithState(TEST_STATE, <AuthorForm author={TEST_AUTHOR}
                                            setAuthor={(author) => {}}/>);

    const uClan = screen.getByTestId('clan');
    expect(uClan).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(TEST_AUTHOR.clan)}`))
       .toBeInTheDocument()

    /**
     * Helper function to select and verify clan selection
     * @param clan 
     */
    const validateClan = async (clan: ClanType) =>
    {
      const changeClan = `${printClanType(clan)}`;
      const clanField = screen.getByTestId('clan');
      const clanButton = within(clanField).getByRole('combobox');
      await userEvent.click(clanButton);

      await waitFor(() => 
      { expect(screen.getByText(contains(clan.name))).toBeInTheDocument(); });

      await userEvent.click(screen.getByText(contains(clan.name)));

      await waitFor(() =>
      { // eslint-disable-next-line testing-library/no-node-access
        expect(within(screen.getByTestId('clan').parentElement!)
           .getByText(changeClan)).toBeInTheDocument();
      });
    }

    //verify selectability of all 4 clans
    await validateClan(Clans.Orca);
    await validateClan(Clans.Wolf);
    await validateClan(Clans.Raven);
    await validateClan(Clans.Eagle);
  });
 
  test('Update Button only processes on Valid form', async () =>
  {
    const author: Author = {...TEST_AUTHOR};
    const STATE = {
      ...TEST_STATE,
      authorList: {
        ...emptyAuthorList,
        items: [author],
      }
    };
    const {store} =
      renderWithState(STATE, <><AuthorForm author={author}/><AuthorPrinter/></>);

    expect(screen.getByText('Update')).toBeInTheDocument();

    //change a value, so we have something to look for.
    const changedValue = 'A Different Value';
    const updateAuthor: Author = {...author, name: changedValue};
    setUpdatedAuthor(updateAuthor);
    setupAuthorMocking();

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    //verify changed value
    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name')))
         .toHaveValue(changedValue);
    });

    //trigger save action
    await userEvent.click(screen.getByText('Update'));

    //verify last dispatch was to update the name
    await waitFor(() => {
      expect(store.dispatch)
        .toHaveBeenCalledWith(authorActions.updateAuthor(expect.objectContaining({name: changedValue})));
    });

    //screen.debug(screen.getByTestId('user-info-dumps'));
    const authors = screen.getAllByText(/"__typename": "Author",/);

    /* field level validation * /
    const updatedUser = JSON.parse(`${authors[0].textContent}`);
    const currentUser = JSON.parse(`${authors[1].textContent}`);
    expect(updatedUser.name).toBe(changedValue);
    expect(updatedUser.id).toBe(currentUser.id);
    expect(currentUser.name).toBe(changedValue);
    // */

    await  waitFor(() => {
      expect(authors[0].textContent).toContain(changedValue);
    });

    /* validate the state changes propagate as expected * /
    expect(store.getState().user.name).toEqual(changedValue);
    expect(store.getState().user.id).toEqual(store.getState().currentUser.id);
    expect(store.getState().user.name).toEqual(store.getState().currentUser.name);
    expect(store.getState().currentUser.name).toEqual(changedValue);
    // */
  });

  test("Update Button doesnt dispatch any actions when the form is inValid", async () =>
  {
    const STATE = { ...TEST_STATE };

    const { store } = renderWithState(STATE, <AuthorForm author={TEST_AUTHOR} />);

    expect(screen.getByText("Update")).toBeInTheDocument();

    const getEmailField = () => 
    { return screen.getByLabelText(startsWith("E-Mail")); };

    const emailField = getEmailField();
    await userEvent.clear(emailField);
    await userEvent.type(emailField, "not_a_valid_email");

    await waitFor(() => 
    { expect(screen.getByText(contains("Invalid"))).toBeInTheDocument(); });
    expect(getEmailField()).toHaveValue("not_a_valid_email");

    //verify how many actions were dispatched before clicking "Save"
    // @ts-ignore
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText("Update"));

    //verify action was never fired
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  //TODO: test that new dispatches create
  test('Button dispatches create on isNew', async () =>
  {
    const author: Author = {...TEST_AUTHOR};
    const STATE = {...TEST_STATE};
    const {store} =
       renderWithState(STATE, <AuthorForm author={author} isNew/>);

    expect(screen.getByText('Create')).toBeInTheDocument();

    //change a value, so we have something to look for.
    const changedValue = 'A Different Value';
    const updateAuthor: Author = {...author, name: changedValue};
    setUpdatedAuthor(updateAuthor);
    setupAuthorMocking();

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    //verify changed value
    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name')))
         .toHaveValue(changedValue);
    });

    //trigger save action
    await userEvent.click(screen.getByText('Create'));

    //verify last dispatch was to create the author
    await waitFor(() =>
    {
      const expectedChange = expect.objectContaining({name: changedValue});
      const create = authorActions.createAuthor(expectedChange);
      expect(store.dispatch).toHaveBeenCalledWith(create);
    });
    //screen.debug(screen.getByTestId('user-info-dumps'));
  });

});