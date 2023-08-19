import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Xbiis, DefaultBox, emptyXbiis} from '../../boxTypes';
import { User, } from '../../../User/userType';
import { printGyet } from "../../../Gyet/GyetType";
import { Role, DefaultRole, printRole } from '../../../Role/roleTypes';
import { Clans } from '../../../Gyet/ClanType';

import {renderPage} from '../../../__utils__/testUtilities';
import {
  getColumnHeadersTextContent, getColumnValues, getCell, getRow, getRows
} from '../../../__utils__/dataGridHelperFunctions';
import BoxListPage from '../BoxListPage';
import { boxActions } from '../../boxSlice';
import {emptyBoxList} from "../BoxListType";
import {setupBoxListMocking, setupBoxMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import boxListJson from '../../../data/boxList.json';
import {ADMIN_BOXLIST_PATH} from "../../../components/shared/constants";

const initUser: User = {
  __typename: "User",
  id: 'USER GUID HERE',
  name: 'I am a Test User',
  waa: 'not a Kampshewampt name',
  email: 'test@example.com',
  isAdmin: false,
  clan: Clans.Eagle.value,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialBox: Xbiis = {
  __typename: "Xbiis",
  id: 'BOX-GUID-HERE',
  name: 'BoxName',
  waa:  'Xbiis Waa',
  owner: initUser,
  xbiisOwnerId: initUser.id,
  defaultRole: Role.Write,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const STATE = {
  boxList: { items: [initialBox] },
  box: initialBox
};

describe('BoxListPage tests', () => {

  beforeEach(() => {
    setupBoxListMocking();
    setupBoxMocking();
  });

  test('Renders Correctly when no data already in state', async () =>
  { 
     const emptyState = { boxList: emptyBoxList, box: initialBox };
     renderPage(ADMIN_BOXLIST_PATH, <BoxListPage />, emptyState);

     /*
       name:        'ERROR',
       owner:       'Boxes',
       defaultRole: 'Not Loaded',
      */

     //TODO: check for ID

     expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Waa', 'Owner']); //'Default Role']);

     expect(screen.getByText('No rows')).toBeInTheDocument();
     //expect(getColumnValues(0)).toEqual(['ERROR']);
     //expect(getColumnValues(1)).toEqual(['Boxes']);
     //expect(getColumnValues(2)).toEqual(['Not Loaded']);
  });

  test('Renders Correctly when data available', async () => 
  {
     renderPage(ADMIN_BOXLIST_PATH, <BoxListPage />, STATE);

     /*
       name:        'ERROR',
       owner:       'Boxes',
       defaultRole: 'Not Loaded',
     */

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Waa', 'Owner']); //'Default Role']);
     
     expect(getColumnValues(0)).toEqual([initialBox.name]);
     expect(getColumnValues(1)).toEqual([initialBox!.waa]);
     expect(getColumnValues(2)).toEqual([printGyet(initialBox.owner)]);
     //expect(getColumnValues(3)).toEqual([printRole(initialBox.defaultRole)]);
  });

  test('Renders Correctly when loading data', async () =>
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0] as Xbiis,
    };
    const { store } =
          renderPage(ADMIN_BOXLIST_PATH, <BoxListPage />, mockState);

    const initialBox: Xbiis = mockState.box;
    await waitFor(() => {
      expect(getCell(0,0)).toHaveTextContent(initialBox.name);
    });

    expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Waa', 'Owner']); //'Default Role']);

    //screen.debug(getRow(0));

    expect(getCell(0,0)).toHaveTextContent(initialBox.name);
    expect(getCell(0,1)).toHaveTextContent(`${initialBox.waa}`);
    expect(getCell(0,2)).toHaveTextContent(printGyet(initialBox.owner));
    //expect(getCell(0,3)).toHaveTextContent(`${printRole(initialBox.defaultRole)}`);
  });

  test('Renders Correctly when data available without owner', async () => 
  {
     const ownerLess = { ...initialBox, owner: undefined };
     const ownerLessState = { boxList: { items: [ownerLess] }, box: ownerLess };
     renderPage(ADMIN_BOXLIST_PATH, <BoxListPage />, ownerLessState);

     /*
       name:        'ERROR',
       owner:       'Boxes',
       defaultRole: 'Not Loaded',
     */

     //TODO: check for ID

    const headers = screen.getAllByRole('columnheader');
    console.log('headers: ' + headers.map(h => h!.textContent));

     expect(getColumnHeadersTextContent())
       .toEqual(['Name', 'Waa', 'Owner']); //'Default Role']);
     
     expect(getColumnValues(0)).toEqual([initialBox.name]);
     expect(getColumnValues(1)).toEqual([initialBox.waa]);
     expect(getColumnValues(2)).toEqual(['']);
     //expect(getColumnValues(3)).toEqual([printRole(initialBox.defaultRole)]);
  });

  test('Clicking on row dispatches the correct action', async () => 
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0],
    };
    const { store } = renderPage(ADMIN_BOXLIST_PATH, <BoxListPage />, mockState);

    await waitFor(() =>{ expect(getRows()).toHaveLength(2); });

    // @ts-ignore //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    const firstRow = getRow(1);

    //click the first cell of the row and dispatch the action
    await userEvent.click(firstRow);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }); //, { timeout: 2000 });

    //verify action
    const selectAction = boxActions.getBoxById(boxListJson.items[1].id);
    expect(store.dispatch).lastCalledWith(selectAction);
  });

  test('[CTRL] Clicking on row dispatches the correct action', async () => 
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0],
    };
    const { store } = renderPage(ADMIN_BOXLIST_PATH, <BoxListPage />, mockState);

    const titleCell = getCell(1,0);
    //screen.debug(titleCell);

    // @ts-ignore //verify current dispatch count
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
    const unSetAction = boxActions.setBox(emptyXbiis);
    expect(store.dispatch).lastCalledWith(unSetAction);
  });
});