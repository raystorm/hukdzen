import { screen, waitFor, within } from '@testing-library/react'
import userEvnt from '@testing-library/user-event';

import { arrowDown, contains, enterKey, renderWithState, startsWith, } from '../../../__utils__/testUtilities';
import type { User } from '../../../User/userType';
import { printGyet } from "../../../Gyet/GyetType";
import type { Xbiis } from '../../../Box/boxTypes';
import { BoxPurpose, AccessLevel, emptyXbiis, DefaultBox } from '../../../Box/boxTypes';
import BoxForm from '../BoxForm';
import { DefaultRole, printRole, Role } from '../../../Role/roleTypes';
import { setUpdatedBox } from "../../../__utils__/__fixtures__/BoxAPI.helper";
import { boxActions } from "../../../Box/boxSlice";


const TEST_USER: User = {
  __typename: "User",

  id: 'GUID-HERE',
  name: 'Test-User',
  email: 'nope@example.com',
  isAdmin: false,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const TEST_USER_2: User = {
  __typename: "User",

  id: 'GUID2-HERE',
  name: 'Different Test User',
  email: 'akadi-gohl@example.com',
  isAdmin: false,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const TEST_STATE = { userList: { items: [TEST_USER, TEST_USER_2] as User[] } }

const TEST_BOX = {
  ...emptyXbiis,
  id: 'Box-GUID-HERE',
  name: 'TEST BOXY',
  waa:  'nabiibuut',
  owner: TEST_USER,
  purpose: BoxPurpose.GROUP,
  xbiisOwnerId: TEST_USER.id,
  defaultRole: DefaultRole,
} as Xbiis

const userEvent = userEvnt.setup();

describe('BoxForm', () =>
{
  describe('Rendering', () =>
  {
    test('renders correctly with all fields and buttons', () =>
    {
      const box = TEST_BOX;
      renderWithState(TEST_STATE, <BoxForm box={box}/>);

      const idField = screen.getByTestId('id');
      expect(idField).toBeInTheDocument();
      expect(idField).not.toBeVisible();
      expect(within(idField).getByDisplayValue(box.id)).toBeInTheDocument();

      const nameField = screen.getByLabelText(startsWith('Name'));
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue(box.name);

      const ownerField = screen.getByLabelText(startsWith('Owner'));
      expect(ownerField).toBeInTheDocument();
      expect(ownerField).toHaveValue(printGyet(box.owner));

      const roleField = screen.getByLabelText(startsWith('Default Role'));

      expect(roleField).toBeInTheDocument();
      expect(roleField).toHaveTextContent(`${printRole(box.defaultRole)}`);

      //buttons
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(screen.getByText('Edit Members')).toBeInTheDocument();
    });
  });

  describe('Field Editing', () =>
  {
    describe('Name field', () =>
    {
      test('is editable when purpose is NOT USER', async () =>
      {
        const box = TEST_BOX;
        renderWithState(TEST_STATE, <BoxForm box={box}/>);

        const change = 'Changed Value';

        const nameField = screen.getByLabelText(startsWith('Name'));
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue(box.name);

        await userEvent.clear(nameField);
        await userEvent.type(nameField, change);

        await waitFor(() => { expect(nameField).toHaveValue(change); });
      });

      test('is NOT editable when purpose IS USER', () =>
      {
        const box = { ...TEST_BOX, purpose: BoxPurpose.USER };
        renderWithState(TEST_STATE, <BoxForm box={box}/>);

        const nameField = screen.getByLabelText(startsWith('Name'));
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue(box.name);
        expect(nameField).toBeDisabled();
      });

      test('is NOT editable for DEFAULT box', () =>
      {
        const defaultBox = { ...TEST_BOX, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
        renderWithState(TEST_STATE, <BoxForm box={defaultBox}/>);

        const nameField = screen.getByLabelText(startsWith('Name'));
        expect(nameField).toBeInTheDocument();
        expect(nameField).toHaveValue(defaultBox.name);
        expect(nameField).toBeDisabled();
      });
    });

    describe('Waa field', () =>
    {
      test('is editable', async () =>
      {
        const box = TEST_BOX;
        renderWithState(TEST_STATE, <BoxForm box={box}/>);

        const change = 'Changed Value';

        const waaField = screen.getByLabelText(startsWith('Waa'));
        expect(waaField).toBeInTheDocument();
        expect(waaField).toHaveValue(box.waa);

        await userEvent.clear(waaField);
        await userEvent.type(waaField, change);

        await waitFor(() => { expect(waaField).toHaveValue(change); });
      });

      test('is NOT editable for DEFAULT box', () =>
      {
        const defaultBox = { ...TEST_BOX, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
        renderWithState(TEST_STATE, <BoxForm box={defaultBox}/>);

        expect(screen.getByLabelText(startsWith('Waa'))).toBeDisabled();
      });
    });

    describe('Owner field', () =>
    {
      test('can select from autocomplete', async () =>
      {
        const box = TEST_BOX;
        renderWithState(TEST_STATE, <BoxForm box={box}/>);

        const ownerField = screen.getByLabelText(startsWith('Owner'));
        expect(ownerField).toBeInTheDocument();
        expect(ownerField).toHaveValue(printGyet(box.owner));

        // eslint-disable-next-line testing-library/prefer-presence-queries
        expect(within(screen.getByTestId('owner-autocomplete'))
                  .queryByDisplayValue(TEST_USER_2.name))
           .not.toBeInTheDocument();

        const textbox = within(screen.getByTestId('owner-autocomplete'))
           .getByRole('combobox');
        //screen.debug(textbox);

        await arrowDown(textbox); //open the menu
        await arrowDown(textbox); //into the menu
        await arrowDown(textbox); //skip to expected entry
        await arrowDown(textbox);
        await enterKey(textbox);

        //screen.debug(screen.getByTestId('owner-autocomplete'));

        await waitFor(() => {
          expect(within(screen.getByTestId('owner-autocomplete'))
                    .getByDisplayValue(TEST_USER_2.name)).toBeInTheDocument();
        });
      });

      test('is NOT editable for DEFAULT box', () =>
      {
        const defaultBox = { ...TEST_BOX, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
        renderWithState(TEST_STATE, <BoxForm box={defaultBox}/>);

        expect(screen.getByTestId('owner-autocomplete').querySelector('input')).toBeDisabled();
      });
    });

    describe('Default Role field', () =>
    {
      test('can select role', async () =>
      {
        const box = TEST_BOX;
        renderWithState(TEST_STATE, <BoxForm box={box}/>);

        const roleField = screen.getByLabelText(startsWith('Default Role'));

        expect(roleField).toBeInTheDocument();
        expect(roleField).toHaveTextContent(`${printRole(box.defaultRole)}`);

        /**
         * Helper function to select and verify Role selection
         * @param role Role to verify
         */
        const validateRole = async (role: AccessLevel) =>
        {
          const changeRole = `${printRole(role)}`;
          const roleField = screen.getByTestId('defaultRole');
          const roleButton = within(roleField).getByRole('combobox');
          await userEvent.click(roleButton);

          await waitFor(() =>
                        { expect(screen.getByText(contains(role))).toBeInTheDocument(); });

          await userEvent.click(screen.getByText(contains(role)));

          await waitFor(() =>
                        {
                          expect(screen.getByLabelText('Default Role'))
                             .toHaveTextContent(changeRole);
                        });
        };

        await validateRole(Role.None);
        await validateRole(Role.Read);
        await validateRole(Role.Write);
      });

      test('is NOT editable for DEFAULT box', () =>
      {
        const defaultBox = { ...TEST_BOX, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
        renderWithState(TEST_STATE, <BoxForm box={defaultBox}/>);

        //expect(screen.getByLabelText(startsWith('Default Role'))).toBeDisabled();
        const roleField = screen.getByLabelText(startsWith('Default Role'));
        expect(roleField).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('Button Actions', () =>
  {
    test('Save button dispatches updateBox action', async () =>
    {
      const box = TEST_BOX;
      const { store } = renderWithState(TEST_STATE, <BoxForm box={box}/>);

      const save = screen.getByText('Save');
      expect(save).toBeInTheDocument();

      //change something for the action
      const change = 'Changed Value';

      const nameField = screen.getByLabelText(startsWith('Name'));
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue(box.name);

      await userEvent.clear(nameField);
      await userEvent.type(nameField, change);

      await waitFor(() => { expect(nameField).toHaveValue(change); });

      const updated = { ...box, name: change };
      setUpdatedBox(updated);

      // @ts-ignore //verify current dispatch count
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //click the button and dispatch the action
      await userEvent.click(save);

      //verify action was dispatched once
      await waitFor(() => {
        expect(store?.dispatch)
           .toHaveBeenCalledWith(boxActions.updateBox(expect.objectContaining({ name: change })));
      }); //, { timeout: 2000 });

      // verify arguments
      await waitFor(() => {
        expect(screen.getByLabelText(startsWith('Name')))
           .toHaveValue(change);
      });
    });

    test('Create button dispatches createBox action', async () =>
    {
      const box = TEST_BOX;
      const { store } = renderWithState(TEST_STATE, <BoxForm box={box}/>);

      const create = screen.getByText('Create');
      expect(create).toBeInTheDocument();

      //change something for the action
      const change = 'Changed Value';

      const nameField = screen.getByLabelText(startsWith('Name'));
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue(box.name);

      await userEvent.clear(nameField);
      await userEvent.type(nameField, change);

      await waitFor(() => { expect(nameField).toHaveValue(change); });

      // @ts-ignore //verify current dispatch count
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //click the button and dispatch the action
      await userEvent.click(create);

      //verify action was dispatched once
      await waitFor(() => {
        expect(store?.dispatch)
           .toHaveBeenCalledWith(boxActions.createBox(expect.objectContaining({ name: change })));
      });

      // verify arguments
      await waitFor(() => {
        expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(change);
      });
    });

    describe('Delete button', () =>
    {
      test('dispatches removeBox action', async () =>
      {
        const box = TEST_BOX;
        const { store } = renderWithState(TEST_STATE,
           <BoxForm box={box} isAdminForm/>);

        const del = screen.getByText('Delete');
        expect(del).toBeInTheDocument();

        //click the button and dispatch the action
        await userEvent.click(del);

        //verify action was dispatched
        await waitFor(() => {
          expect(store?.dispatch).toHaveBeenCalledWith(boxActions.removeBox(box));
        });
      });

      test('is disabled for USER box', () =>
      {
        const userBox = { ...TEST_BOX, purpose: BoxPurpose.USER };
        renderWithState(TEST_STATE, <BoxForm box={userBox} isAdminForm/>);

        expect(screen.getByText('Delete')).toBeDisabled();
      });

      test('is disabled for DEFAULT box', () =>
      {
        const defaultBox = { ...TEST_BOX, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
        renderWithState(TEST_STATE, <BoxForm box={defaultBox} isAdminForm/>);

        expect(screen.getByText('Delete')).toBeDisabled();
      });
    });

    //this is a link as a button, how should this be tested?
    test.skip('Edit Members button loads members page', async () =>
    {
      const box = TEST_BOX;
      const { store } = renderWithState(TEST_STATE, <BoxForm box={box}/>);


      const edit = screen.getByText('Edit Members');
      expect(edit).toBeInTheDocument();

      //change something for the action
      const change = 'Changed Value';

      const nameField = screen.getByLabelText(startsWith('Name'));
      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue(box.name);

      await userEvent.clear(nameField);
      await userEvent.type(nameField, change);

      await waitFor(() => { expect(nameField).toHaveValue(change); });

      // @ts-ignore //verify current dispatch count
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //click the button and dispatch the action
      await userEvent.click(edit);

      //verify action was dispatched once
      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount + 1);
      });

      //TODO: verify arguments
    });
  });
});