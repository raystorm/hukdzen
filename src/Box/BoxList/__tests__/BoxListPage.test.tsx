import React from 'react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Xbiis, DefaultBox } from '../../boxTypes';
import { Gyet, printUser } from '../../../User/userType';
import { Role, DefaultRole, printRole } from '../../../Role/roleTypes';
import { Clan } from '../../../User/ClanType';

import { renderWithState } from '../../../utilities/testUtilities';
import { 
         getColumnHeadersTextContent, getColumnValues, getCell
       } from '../../../components/widgets/__tests__/dataGridHelperFunctions';
import BoxListPage from '../BoxListPage';
import { boxActions } from '../../boxSlice';
import {BoxRoleBuilder} from "../../../User/BoxRoleType";

const initUser: Gyet = {
  id: 'USER GUID HERE',
  name: 'I am a Test User',
  waa: 'not a Kampshewampt name',
  email: 'test@example.com',
  isAdmin: false,
  clan: Clan.Eagle,
  boxRoles: [BoxRoleBuilder(DefaultBox, DefaultRole)]
};

const initialBox: Xbiis = {
  id: 'BOX-GUID-HERE',
  name: 'BoxName',
  owner: initUser,
  defaultRole: Role.Write
};

const STATE = {
  boxList: { boxes: [initialBox] },
  box: initialBox
};

describe('BoxListPage tests', () => { 

  test('Renders Correctly when no data available', async () => 
  { 
     const emptyState = { boxList: { boxes: [] }, box: initialBox };
     renderWithState(emptyState, <BoxListPage />);

     /*
       name:        'ERROR',
       owner:       'Boxes',
       defaultRole: 'Not Loaded',
      */

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Owner', 'Default Role']);
     
    expect(getColumnValues(0)).toEqual(['ERROR']);
    expect(getColumnValues(1)).toEqual(['Boxes']);
    expect(getColumnValues(2)).toEqual(['Not Loaded']);
  });

  test('Renders Correctly when data available', async () => 
  { 
     renderWithState(STATE, <BoxListPage />);

     /*
       name:        'ERROR',
       owner:       'Boxes',
       defaultRole: 'Not Loaded',
     */

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Owner', 'Default Role']);
     
    expect(getColumnValues(0)).toEqual([initialBox.name]);
    expect(getColumnValues(1)).toEqual([printUser(initialBox.owner)]);
    expect(getColumnValues(2)).toEqual([printRole(initialBox.defaultRole)]);
  });

  test('Renders Correctly when data available without owner', async () => 
  { 
     const ownerLess = { ...initialBox, owner: undefined };
     const ownerLessState = { boxList: { boxes: [ownerLess] }, box: ownerLess };
     renderWithState(ownerLessState, <BoxListPage />);

     /*
       name:        'ERROR',
       owner:       'Boxes',
       defaultRole: 'Not Loaded',
     */

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Owner', 'Default Role']);
     
    expect(getColumnValues(0)).toEqual([initialBox.name]);
    expect(getColumnValues(1)).toEqual(['']);
    expect(getColumnValues(2)).toEqual([printRole(initialBox.defaultRole)]);
  });

  test('Clicking on row dispatches the correct action', async () => 
  { 
     const { store } = renderWithState(STATE, <BoxListPage />);

     const titleCell = getCell(0,0);

    //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //click the first cell of the row and dispatch the action
    await userEvent.click(titleCell);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }); //, { timeout: 2000 });

    //verify action
    const selectAction = boxActions.getSpecifiedBoxById(initialBox.id);
    expect(store.dispatch).lastCalledWith(selectAction);
  });

  test('[CTRL] Clicking on row dispatches the correct action', async () => 
  { 
    const { store } = renderWithState(STATE, <BoxListPage />);

    const titleCell = getCell(0,0);
    screen.debug(titleCell);

    //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    /* [CTRL] click the sell to deselect */
    await userEvent.click(titleCell,      /* keyboard event to hold [CTRL] */
                          {keyboardState: (await userEvent.keyboard('{Control>}'))});
    /* NOTE: if futher interactions are required, 
       [CTRL] would need to be released */

    //verify action was dispatched once
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }); //, { timeout: 2000 });

    //verify action
    const removeAction = boxActions.setSpecifiedBox(undefined);
    expect(store.dispatch).lastCalledWith(removeAction);
  });
});