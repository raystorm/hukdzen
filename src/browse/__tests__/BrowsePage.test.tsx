import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setupBoxListMocking } from "../../__utils__/__setup__/BoxAPI.helper";
import { resetDefaults, setDocList, setupDocListMocking } from "../../__utils__/__setup__/DocumentAPI.helper";
import { contains, renderPage, startsWith } from '../../__utils__/testUtilities';

import boxList from "../../__utils__/__fixtures__/boxList.json";
import docList from "../../__utils__/__fixtures__/docList.json";

import { BrowsePage } from '../BrowsePage';
import { Box, printBox } from '../../Box/boxTypes';
import { BROWSE_PATH } from "../../components/shared/constants";
import { Document } from "../../docs/DocumentTypes";
import { emptyDocList } from "../../docs/docList/documentListTypes";
import { DocumentFieldDefinition as fd } from '../../types/fieldDefitions';


const mockBox: Box = boxList.items[0] as Box;

const mockDocument: Document = docList.items[0] as Document;
const docCount = docList.items.length;

const initialState = {
   browse: {
      selectedBox: null,
      visibleFields: ['eng_title', 'bc_title', 'ak_title'],
      sort: { field: 'eng_title', direction: 'ASC' },
      filters: {
         authors: [], contentOwners: [], types: [], created: {}, updated: {},
         keywords: [], eng_titles: [], bc_titles: [], ak_titles: [],
         eng_descriptions: [], bc_descriptions: [], ak_descriptions: [],
         fileKeys: [], versions: [], ids: [],
      },
   },
   boxList: boxList, //{ items: [mockBox] },
   documentList: docList, //{ items: [] },
};

const renderBrowse = (state: any) => renderPage(BROWSE_PATH, <BrowsePage />, state);

const selectMockBox = async () =>
{
   const boxName = printBox(mockBox);

   await userEvent.click(screen.getAllByRole('combobox')[0]);
   //an open menu hides the page from role queries, so pick the option by role
   await userEvent.click(await screen.findByRole('option', { name: boxName }));
   await waitFor(() => {
      expect(screen.getByText(startsWith(`"${boxName}"`))).toBeInTheDocument();
   });
};

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
         documentList: { ...emptyDocList, items: [mockDocument] },
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
         documentList: { ...emptyDocList } //, items: [] },
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

   test('shows the default title fields with their labels and values', async () =>
   {
      resetDefaults(); //earlier tests change the shared doc list mock
      setupDocListMocking();
      renderBrowse(initialState);

      await selectMockBox();

      await waitFor(() => {
         expect(screen.getAllByText(`${fd.eng.title.label}:`))
            .toHaveLength(docCount);
      });
      expect(screen.getByText(mockDocument.eng.title)).toBeInTheDocument();
      ['eng:', 'bc:', 'ak:'].forEach(label =>
      { expect(screen.queryByText(label)).not.toBeInTheDocument(); });
   });

   test('checking Description in Display Fields shows it on the cards', async () =>
   {
      resetDefaults();
      setupDocListMocking();
      renderBrowse(initialState);
      const descriptionLabel = `${fd.eng.description.label}:`;

      await selectMockBox();
      await waitFor(() => {
         expect(screen.getAllByText(`${fd.eng.title.label}:`))
            .toHaveLength(docCount);
      });
      expect(screen.queryByText(descriptionLabel)).not.toBeInTheDocument();

      await userEvent.click(await screen.findByRole('checkbox',
                                                    { name: fd.eng.description.label }));

      await waitFor(() => {
         expect(screen.getAllByText(descriptionLabel)).toHaveLength(docCount);
      });
      expect(screen.getByText(mockDocument.eng.description)).toBeInTheDocument();
   });

   test('choosing a title in Filters narrows the listed items', async () =>
   {
      resetDefaults();
      setupDocListMocking();
      renderBrowse(initialState);

      await selectMockBox();
      await waitFor(() => {
         expect(screen.getByText(contains(`(${docCount} of ${docCount} items)`)))
            .toBeInTheDocument();
      });

      //Filters accordion starts collapsed, so its inputs are not accessible
      await userEvent.click(await screen.findByRole('button', { name: 'Filters' }));
      await userEvent.click(await screen.findByRole('combobox',
                                                    { name: fd.eng.title.label }));
      await userEvent.click(screen.getByRole('option',
                                             { name: docList.items[1].eng.title }));

      await waitFor(() => {
         expect(screen.getByText(contains(`(1 of ${docCount} items)`)))
            .toBeInTheDocument();
      });
   });
});