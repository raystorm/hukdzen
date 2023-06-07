import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithState } from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import UserDocuments from '../UserDocuments';
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {emptyUser, User} from "../../../User/userType";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocList} from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";


const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'
}

const initUser: User = {
  ...emptyUser,
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

  author:   author,
  docOwner: initUser,
  documentDetailsAuthorId:   author.id,
  documentDetailsDocOwnerId: initUser.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,

  fileKey: 'S3/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  //TODO: set specific dates/times
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
};

const STATE = {
  documentList: { ...emptyDocList, items: [initialDocument] }
};

describe('UserDocuments  widget', () => {

  test('renders correctly', () => { 
    
    renderWithState(STATE, <UserDocuments />);

    expect(screen.getByText('Owned/Authored Documents'))
      .toBeInTheDocument();

    expect(screen.getByText(initialDocument.eng_title)).toBeInTheDocument();
  });

});