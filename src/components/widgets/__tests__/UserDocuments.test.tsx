import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithState } from '../../../__utils__/testUtilities';
import { Document } from '../../../docs/DocumentTypes';
import UserDocuments from '../UserDocuments';
import { emptyDocument } from "../../../docs/initialDocumentDetails";
import {emptyUser, User} from "../../../User/userType";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocList} from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {setupAmplifyUserMocking} from "../../../__utils__/__setup__/UserAPI.helper";
import {
  setupDocListMocking,
  setupSearchMocking,
  setupDocumentMocking
} from "../../../__utils__/__setup__/DocumentAPI.helper";


const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'
}

const initUser: User = {
  ...emptyUser,
  id: 'TEST-GUID-HERE', //TODO copy a setup test GUID
  name: 'Testy Mc Test Face',
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

  beforeEach(() => {
    setupAmplifyUserMocking();
    setupDocListMocking();
    setupSearchMocking();
    setupDocumentMocking();
  });

  test('renders correctly', () => { 
    
    renderWithState(STATE, <UserDocuments />);

    expect(screen.getByText('Owned/Authored Documents'))
      .toBeInTheDocument();

    expect(screen.getByText(initialDocument.eng.title)).toBeInTheDocument();
  });

});