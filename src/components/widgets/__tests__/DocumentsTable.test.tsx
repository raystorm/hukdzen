import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { 
         renderWithProviders, renderWithState 
       } from '../../../utilities/testUtilities';
import { DocumentDetailsFieldDefintion } from '../../../types/fieldDefitions';
import DocumentsTable, { DocTableProps } from '../DocumentsTable';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import { 
         getColumnHeadersTextContent, getColumnValues, getCell
       } from './dataGridHelperFunctions';
import { documentActions } from '../../../docs/documentSlice';


const initialDocument: DocumentDetails = {
  id: 'DOCUMENT-GUID-HERE',
  title: 'TEST DOCUMENT TITLE',
  description: 'TEST DOCUMENT DESCRIPTION',
  filePath: '/PATH/TO/TEST/FILE',
  type: 'application/example',
  ownerId: 'USER-GUID-HERE', //TODO copy a setup test GUID
  authorId: 'USER-GUID-HERE', //TODO copy a setup test GUID
  version: 1,
  created: new Date(), //TODO set specific dates/times
  updated: new Date(),
  bc: { title: 'Nahawat-BC', description: 'Magon-BC', },
  ak: { title: 'Nahawat-AK', description: 'Magon-AK', },
};

const TEST_PROPS: DocTableProps = {
  title: 'Test Page',
  documents: [initialDocument]
};

const fd = DocumentDetailsFieldDefintion;

userEvent.setup();

describe('DocumentsTable', () => { 

  test('Renders Correctly when no data available', async () => 
  { 
     const emptyProps = { ...TEST_PROPS, documents: [] };
     renderWithProviders(<DocumentsTable {...emptyProps} />);

     /*
     title: 'ERROR',
      nahawtBC: 'Documents',
      nahawtAK: 'Not yet',
      authorId: 'loaded'
      */

     //TODO: check for ID

     
     /*
        check for visible headers
        **NOTE:** something doesn't like embedded ' in column header labels
      */

     expect(getColumnHeadersTextContent())
       .toEqual([fd.title.label, fd.bc.title.label, fd.ak.title.label]);
                 //fd.authorId.label]);    
     
    expect(getColumnValues(0)).toEqual(['ERROR']);
    expect(getColumnValues(1)).toEqual(['Documents']);
    expect(getColumnValues(2)).toEqual(['Not yet']);
    //expect(getColumnValues(3)).toEqual(['loaded']);

  });

  test('Renders Correctly when data available', async () => 
  { 
     const testProps = { ...TEST_PROPS };
     renderWithProviders(<DocumentsTable {...testProps} />);

     /*
     title: 'ERROR',
      nahawtBC: 'Documents',
      nahawtAK: 'Not yet',
      authorId: 'loaded'
      */

     //TODO: check for ID

     
     /*
        check for visible headers
        **NOTE:** something doesn't like embedded ' in column header labels
      */

     expect(getColumnHeadersTextContent())
       .toEqual([fd.title.label, fd.bc.title.label, fd.ak.title.label]);
                 //fd.authorId.label]);    
     
    expect(getColumnValues(0)).toEqual([initialDocument.title]);
    expect(getColumnValues(1)).toEqual([initialDocument.bc.title]);
    expect(getColumnValues(2)).toEqual([initialDocument.ak.title]);
    //expect(getColumnValues(3)).toEqual(['loaded']);

  });

  test('Clicking on row dispatches the correct action', async () => 
  { 
     const testProps = { ...TEST_PROPS };
     const { store } = renderWithProviders(<DocumentsTable {...testProps} />);

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
    const selectAction = documentActions.selectDocumentById(initialDocument.id);
    expect(store.dispatch).lastCalledWith(selectAction);
  });

  test('[CTRL] Clicking on row dispatches the correct action', async () => 
  { 
    const testProps = { ...TEST_PROPS };
    const { store } = renderWithProviders(<DocumentsTable {...testProps} />);

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
    const removeAction = documentActions.removeDocumentRequested(null);
    expect(store.dispatch).lastCalledWith(removeAction);
  });

});