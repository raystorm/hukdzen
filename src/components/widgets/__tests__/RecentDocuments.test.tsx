import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithState } from '../../../__utils__/testUtilities';
import { Document } from '../../../docs/DocumentTypes';
import RecentDocuments from '../RecentDocuments';
import {emptyUser, User} from "../../../User/userType";
import {emptyBox, Box} from "../../../Box/boxTypes";
import { emptyDocument } from "../../../docs/initialDocumentDetails";
import {emptyDocList} from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {setupAmplifyUserMocking} from "../../../__utils__/__setup__/UserAPI.helper";
import {
  setupSearchMocking,
  setupDocListMocking,
  setupDocumentMocking
} from "../../../__utils__/__setup__/DocumentAPI.helper";
import { buildSummary } from "../../../Content/ContentType";


const author: Author =
{
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'
}

const initUser: User =
{
  ...emptyUser,
  id: 'USER-GUID-HERE', //TODO copy a setup test GUID
  name: 'Testy Mc Test Face',
}

const initBox: Box =
{
  ...emptyBox,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: initUser,
  boxOwnerId: initUser.id,
}

const initialDocument: Document =
{
  ...emptyDocument,
  id: 'DOCUMENT-GUID-HERE',
  eng: buildSummary('TEST DOCUMENT TITLE', 'TEST DOCUMENT DESCRIPTION'),
  bc:  buildSummary('Nahawat-BC', 'Magon-BC'),
  ak:  buildSummary('Nahawat-AK', 'Magon-AK'),

  author:           author,
  documentAuthorId: author.id,

  contentOwner:               initUser,
  documentContentOwnerUserId: initUser.id,

  box:                initBox,
  documentBoxBoxId: initBox.id,

  fileKey: 'S3/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  //TODO: set specific dates/times
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
};

const STATE = { documentList: { ...emptyDocList, items: [initialDocument] } };

describe('RecentDocuments  widget', () =>
{

  beforeEach(() => {
    setupAmplifyUserMocking();
    setupDocListMocking();
    setupSearchMocking();
    setupDocumentMocking();
  });

  test('renders correctly', () =>
  {
    renderWithState(STATE, <RecentDocuments />);

    expect(screen.getByText("Sut'amiis da lax sa'winsk (Recent Documents)"))
      .toBeInTheDocument();

    expect(screen.getByText(initialDocument.eng!.title!)).toBeInTheDocument();
  });

});