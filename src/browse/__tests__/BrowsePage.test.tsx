import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setupBoxListMocking } from "../../__utils__/__fixtures__/BoxAPI.helper";
import {setDocList, setupDocListMocking} from "../../__utils__/__fixtures__/DocumentAPI.helper";
import {contains, renderPage, startsWith} from '../../__utils__/testUtilities';

import boxList from "../../data/boxList.json";
import docList from "../../data/docList.json";

import { BrowsePage } from '../BrowsePage';
import { emptyDocumentDetails } from '../../docs/initialDocumentDetails';
import {DefaultBox, emptyXbiis, Xbiis} from '../../Box/boxTypes';
import { BROWSE_PATH } from "../../components/shared/constants";
import { printBox } from "../../Box/boxTypes";
import {DocumentDetails} from "../../docs/DocumentTypes";
import {emptyDocList} from "../../docs/docList/documentListTypes";


const mockBox: Xbiis = boxList.items[0] as Xbiis;

const mockDocument: DocumentDetails = docList.items[0] as DocumentDetails;

const initialState = {
   browse: {
      selectedBox: null,
      visibleFields: ['eng_title', 'bc_title', 'ak_title'],
      sort: { field: 'eng_title', direction: 'ASC' },
      filters: {
         authors: [], docOwners: [], types: [], created: {}, updated: {},
         keywords: [], eng_titles: [], bc_titles: [], ak_titles: [],
         eng_descriptions: [], bc_descriptions: [], ak_descriptions: [],
         fileKeys: [], versions: [], ids: [],
      },
   },
   boxList: boxList, //{ items: [mockBox] },
   documentList: docList, //{ items: [] },
};

const renderBrowse = (state: any) => renderPage(BROWSE_PATH, <BrowsePage />, state);

describe('BrowsePage', () =>
{
   beforeEach(() => {
      setupBoxListMocking();
      setupDocListMocking();
   });

   test('renders page title and box selector', () => {
      renderBrowse(initialState)

      expect(screen.getByText('Browse Content Items')).toBeInTheDocument();
      expect(screen.getByTestId('select-box')).toBeInTheDocument();
   });

   //default box now
   test.skip('shows message when no box selected', () => {
      renderBrowse(initialState)

      expect(screen.getByText('Select a box to browse its content items.'))
        .toBeInTheDocument();
   });

   test('displays box options in dropdown', async () =>
   {
      renderBrowse(initialState)

      await waitFor(() => {
         expect(screen.getByTestId('select-box')).toBeInTheDocument();
      });

      // get and click into the box select dropdown
      const boxSelect = screen.getAllByRole('combobox')[0];
      expect(boxSelect).toBeInTheDocument();
      await userEvent.click(boxSelect);
      //screen.debug(boxSelect);

      //check that the boxList appears
      await waitFor(() => {
         expect(screen.getAllByText(printBox(mockBox))).toHaveLength(2);
      });
   });

   test('shows sort controls when box is selected', async () =>
   {
      const stateWithSelectedBox = {
         ...initialState,
         browse: {
            ...initialState.browse,
            selectedBox: mockBox,
         },
      };

      renderBrowse(initialState);

      // get and click into the box select dropdown
      const boxSelect = screen.getAllByRole('combobox')[0];
      expect(boxSelect).toBeInTheDocument();
      await userEvent.click(boxSelect);

      //wait for the boxList to appear
      await waitFor(() => {
         expect(screen.getAllByText(printBox(mockBox))).toHaveLength(2);
      });

      //Select a box
      await userEvent.click(screen.getAllByText(printBox(mockBox))[0]);

      //sort field drop down
      await waitFor(() => {
         expect(screen.getByTestId('sort-by')).toBeInTheDocument();
      });
      //sort icon
      expect(screen.getByTitle(startsWith('Currently Sorting')))
        .toBeInTheDocument();
   });

   test('displays document count when box selected', async () =>
   {
      const stateWithDocuments = {
         ...initialState,
         browse: {
            ...initialState.browse,
            selectedBox: mockBox,
         },
         documentList: { items: [mockDocument] },
      };

      setDocList(stateWithDocuments.documentList);
      setupDocListMocking();

      renderBrowse(initialState);

      // get and click into the box select dropdown
      const boxSelect = screen.getAllByRole('combobox')[0];
      expect(boxSelect).toBeInTheDocument();
      await userEvent.click(boxSelect);

      const boxName = printBox(mockBox);

      //wait for the boxList to appear
      await waitFor(() => {
         expect(screen.getAllByText(boxName)).toHaveLength(2);
      });

      //Select a box
      await userEvent.click(screen.getAllByText(boxName)[0]);

      await waitFor(() => {
         expect(screen.getByText(startsWith(`"${boxName}"`)))
           .toBeInTheDocument();
      });
      //screen.debug(screen.getByText(startsWith(`"${boxName}"`)));

      expect(screen.getByText(contains('(1 of 1 items)')))
        .toBeInTheDocument();
   });

   test('shows empty box message when no documents', async () => {
      const stateWithEmptyBox = {
         ...initialState,
         browse: {
            ...initialState.browse,
            selectedBox: mockBox,
         },
         documentList: { items: [] },
      };

      setDocList(emptyDocList);
      setupDocListMocking();

      renderBrowse(initialState);

      // get and click into the box select dropdown
      const boxSelect = screen.getAllByRole('combobox')[0];
      expect(boxSelect).toBeInTheDocument();
      await userEvent.click(boxSelect);

      const boxName = printBox(mockBox);

      //wait for the boxList to appear
      await waitFor(() => {
         expect(screen.getAllByText(boxName)).toHaveLength(2);
      });

      //Select a box
      await userEvent.click(screen.getAllByText(boxName)[0]);

      await waitFor(() => {
         expect(screen.getByText('Box is empty')).toBeInTheDocument();
      });

      expect(screen.getByText(contains('(0 of 0 items)')))
         .toBeInTheDocument();
   });
});