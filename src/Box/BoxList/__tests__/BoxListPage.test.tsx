import React from 'react';
import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvnt from '@testing-library/user-event';
import { useNavigate } from 'react-router';

import { renderPage, LocationDisplay } from '../../../__utils__/testUtilities';

import blJson from '../../../data/boxList.json';
import {BOX_LIST_PATH} from "../../../components/shared/constants";

import { Xbiis, emptyXbiis, printBox} from '../../boxTypes';
import { emptyUser, User, } from '../../../User/userType';
import { printGyet } from "../../../Gyet/GyetType";

import BoxListPage from '../BoxListPage';
import { boxActions } from '../../boxSlice';
import type { BoxList } from "../BoxListType";
import { emptyBoxList } from "../BoxListType";
import { setupBoxListMocking, setupBoxMocking } from"../../../__utils__/__fixtures__/BoxAPI.helper";
import { nullFilter } from "../../../types";

const boxListJson = blJson as BoxList;

const initialBox: Xbiis = boxListJson.items[0] as Xbiis;
const initUser: User = initialBox.owner;

const STATE = {
  boxList: { items: [initialBox] },
  box: initialBox
};

const userEvent = userEvnt.setup();

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
   const actual = await vi.importActual('react-router');
   return { ...actual, useNavigate: () => mockNavigate };
});

describe('BoxListPage tests', () => {

  beforeEach(() => {
    setupBoxListMocking();
    setupBoxMocking();
    mockNavigate.mockClear();
  });

  test('Renders box cards when data available', async () => 
  {
     renderPage(BOX_LIST_PATH, <BoxListPage />, STATE);

     await waitFor(() => {
        expect(screen.getByText(printBox(initialBox))).toBeInTheDocument();
     });
     
     expect(screen.getByText(printGyet(initialBox.owner))).toBeInTheDocument();
  });

  test('Renders multiple box cards', async () =>
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0],
    };
    renderPage(BOX_LIST_PATH, <BoxListPage />, mockState);

    await waitFor(() => {
      expect(screen.getByText(printBox(boxListJson.items[0]))).toBeInTheDocument();
    });

    expect(screen.getByText(printBox(boxListJson.items[1]))).toBeInTheDocument();
  });

  test('Renders box card without owner', async () => 
  {
     const ownerLess = { ...initialBox, owner: undefined }
     const ownerLessState = { boxList: { items: [ownerLess] }, box: ownerLess };
     renderPage(BOX_LIST_PATH, <BoxListPage />, ownerLessState);

     await waitFor(() => {
        expect(screen.getByText(printBox(ownerLess))).toBeInTheDocument();
     });
  });

  test('Clicking on card dispatches getBoxById action', async () => 
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0],
    };
    const { store } = renderPage(BOX_LIST_PATH, <BoxListPage />, mockState);

    const boxName = printBox(boxListJson.items[1]);
    await waitFor(() => {
      expect(screen.getByText(boxName)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    const secondBoxCard = screen.getByText(boxName);
    await userEvent.click(secondBoxCard!);

    const selectAction = boxActions.getBoxById(boxListJson.items[1].id);
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(selectAction);
    });
  });

  test('Double-clicking on card navigates to box detail', async () => 
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0],
    };
    renderPage(BOX_LIST_PATH, <BoxListPage />, mockState);

    const boxName = printBox(boxListJson.items[0]);
    await waitFor(() => {
      expect(screen.getByText(boxName)).toBeInTheDocument();
    });

    const firstBoxCard = screen.getByText(boxName);
    await userEvent.dblClick(firstBoxCard!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/box/${boxListJson.items[0].id}`);
    });
  });

  test('Search field filters boxes', async () => 
  {
    const mockState = {
      boxList: boxListJson,
      box: boxListJson.items[0],
    };
    renderPage(BOX_LIST_PATH, <BoxListPage />, mockState);

    const box0Name = printBox(boxListJson.items[0]);
    const box1Name = printBox(boxListJson.items[1]);
    
    await waitFor(() => {
      expect(screen.getByText(box0Name)).toBeInTheDocument();
    });

    const searchField = screen.getByPlaceholderText(/Filter/i);
    await userEvent.type(searchField, boxListJson.items[0].name);

    expect(screen.getByText(box0Name)).toBeInTheDocument();
    expect(screen.queryByText(box1Name)).not.toBeInTheDocument();
  });
});