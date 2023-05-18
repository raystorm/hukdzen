import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithState } from '../../../utilities/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import RecentDocuments from '../RecentDocuments';
import {emptyGyet, Gyet} from "../../../User/userType";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {emptyDocList} from "../../../docs/docList/documentListTypes";

const initUser: Gyet = {
  ...emptyGyet,
  id: 'USER-GUID-HERE', //TODO copy a setup test GUID
  name: 'Testy Mc Test Face',
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: initUser,
  xbiisOwnerId: initUser.id,
}

const initialDocument: DocumentDetails = {
  ...emptyDocumentDetails,
  id: 'DOCUMENT-GUID-HERE',
  eng_title: 'TEST DOCUMENT TITLE',
  eng_description: 'TEST DOCUMENT DESCRIPTION',

  bc_title: 'Nahawat-BC', bc_description: 'Magon-BC',
  ak_title: 'Nahawat-AK', ak_description: 'Magon-AK',

  author:   initUser,
  docOwner: initUser,
  documentDetailsAuthorId: initUser.id,
  documentDetailsDocOwnerId: initUser.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,

  fileKey: 'S3/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  created: new Date().toISOString(), //TODO set specific dates/times
  updated: new Date().toISOString(),
};

const STATE = {
  documentList: { ...emptyDocList, items: [initialDocument] }
};

describe('RecentDocuments  widget', () => {

  test('renders correctly', () => { 
    
    renderWithState(STATE, <RecentDocuments />);

    expect(screen.getByText("Sut'amiis da lax sa'winsk (Recent Documents)"))
      .toBeInTheDocument();

    expect(screen.getByText(initialDocument.eng_title)).toBeInTheDocument();
  });

});