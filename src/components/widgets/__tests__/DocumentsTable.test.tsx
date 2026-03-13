import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvnt from '@testing-library/user-event';

import {ctrlClick, renderWithProviders} from '../../../__utils__/testUtilities';
import {
  getColumnHeadersTextContent, getColumnValues, getCell
} from '../../../__utils__/dataGridHelperFunctions';

import { DocumentFieldDefinition } from '../../../types/fieldDefitions';

import DocumentsTable, { DocTableProps } from '../DocumentsTable';
import { Document } from '../../../docs/DocumentTypes';
import { documentActions } from '../../../docs/documentSlice';
import { emptyDocument } from "../../../docs/initialDocumentDetails";
import {emptyDocList} from "../../../docs/docList/documentListTypes";

import {emptyUser, User} from "../../../User/userType";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {setupDocListMocking, setupDocumentMocking} from "../../../__utils__/__setup__/DocumentAPI.helper";
import {setupBoxUserListMocking} from "../../../__utils__/__setup__/BoxUserAPI.helper";

const initUser: User = {
  ...emptyUser,
  id: 'USER-GUID-HERE', //TODO copy a setup test GUID
  name: 'User Mc Test Face',
}

const initAuthor: Author = {
  ...emptyAuthor,
  id: 'AUTHOR-GUID-HERE', //TODO copy a setup test GUID
  name: 'Author Mc Test Face',
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: initUser,
  xbiisOwnerId: initUser.id,
}

const initialDocument: Document = {
  ...emptyDocument,
  id: 'DOCUMENT-GUID-HERE',
  eng: { title: 'TEST DOCUMENT TITLE', description: 'TEST DOCUMENT DESCRIPTION' },

  bc: { title: 'Nahawat-BC', description: 'Magon-BC' },
  ak: { title: 'Nahawat-AK', description: 'Magon-AK' },

  author:   initAuthor,
  documentDetailsAuthorId: initAuthor.id,

  docOwner: initUser,
  documentDetailsDocOwnerId: initUser.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,

  fileKey: 'S3/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  created: new Date().toISOString(), //TODO set specific dates/times
  updated: new Date().toISOString(),
};

const TEST_PROPS: DocTableProps = {
  title: 'Test Page',
  documents: { ...emptyDocList, items: [initialDocument] }
};

const fd = DocumentFieldDefinition;

const userEvent = userEvnt.setup();

describe('DocumentsTable', () => { 

  test('Renders Correctly when no data available', async () => 
  { 
     const emptyProps = { ...TEST_PROPS, documents: emptyDocList };
     renderWithProviders(<DocumentsTable {...emptyProps} />);

     /*
     title: 'ERROR',
      nahawtBC: 'Documents',
      nahawtAK: 'Not yet',
      authorId: 'loaded'
      */

     /*
        check for visible headers
        **NOTE:** something doesn't like embedded ' in column header labels
      */

     expect(getColumnHeadersTextContent())
       .toEqual([fd.eng.title.label, fd.bc.title.label, fd.ak.title.label]);
                 //fd.authorId.label]);

     expect(screen.getByText('No rows')).toBeInTheDocument();
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

     /*
        check for visible headers
        **NOTE:** something doesn't like embedded ' in column header labels
      */

     expect(getColumnHeadersTextContent())
       .toEqual([fd.eng.title.label, fd.bc.title.label, fd.ak.title.label]);
                 //fd.authorId.label]);    
     
     expect(getColumnValues(0)).toEqual([initialDocument.eng.title]);
     expect(getColumnValues(1)).toEqual([initialDocument.bc.title]);
     expect(getColumnValues(2)).toEqual([initialDocument.ak.title]);
     //expect(getColumnValues(3)).toEqual(['loaded']);
  });

  test('Clicking on row dispatches the correct action',
       async () =>
  {
     setupDocumentMocking();
     setupBoxUserListMocking();
     setupDocListMocking();

     const testProps = { ...TEST_PROPS };
     const { store } = renderWithProviders(<DocumentsTable {...testProps} />);

     const titleCell = getCell(0,0);

    // @ts-ignore //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //click the first cell of the row and dispatch the action
    await userEvent.click(titleCell);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }); //, { timeout: 2000 });

    //verify action
    const selectAction = documentActions.getDocumentById(initialDocument.id);
    expect(store.dispatch).lastCalledWith(selectAction);
  });

  test('[CTRL] Clicking on row dispatches the correct action', async () => 
  { 
    const testProps = { ...TEST_PROPS };
    const { store } = renderWithProviders(<DocumentsTable {...testProps} />);

    const titleCell = getCell(0,0);
    //screen.debug(titleCell);

    // @ts-ignore //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    /* [CTRL] click the sell to deselect */
    await ctrlClick(titleCell);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }); //, { timeout: 2000 });

    //verify action
    const removeAction = documentActions.clearDocument();
    expect(store.dispatch).lastCalledWith(removeAction);
  });

});