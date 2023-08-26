import react from 'react'
import {screen, waitFor,} from '@testing-library/react'
import {when} from "jest-when";
import { Storage } from "aws-amplify";

import {renderPageWithPath} from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import ItemPage from '../ItemPage';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {ITEM_PATH} from "../../shared/constants";
import {
  setGetDocument,
  setupDocListMocking,
  setupDocumentMocking
} from "../../../__utils__/__fixtures__/DocumentAPI.helper";
import {setupBoxUserListMocking} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";

const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'  
}

const user: User = {
  ...emptyUser,
  id: 'USER_GUID',
  name: 'example User',
  email: 'user@example.com'
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: user,
  xbiisOwnerId: user.id,
}

const document: DocumentDetails = {
  ...emptyDocumentDetails,
  id:    'SOME_DOC_GUID_HERE',
  eng_title: 'Test Document',
  eng_description: 'Testing Item Page',
  
  bc_title: 'BC-title', bc_description: 'BC-Desc',
  ak_title: 'AK-title', ak_description: 'AK-Desc',

  author:   author,
  docOwner: user,
  documentDetailsAuthorId:   author.id,
  documentDetailsDocOwnerId: user.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,
  
  fileKey: '/',
  type: 'no',
  version: 1,

  //TODO: set specific dates/times
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
}

const state = {
  document: document,
}

describe('Item Page', () => {

  beforeEach(() => {
    //setupAmplifyUserMocking();
    setupDocListMocking();
    setGetDocument(document);
    setupDocumentMocking();
    setupBoxUserListMocking();
    //setupBoxUserMocking();
    when(Storage.get).mockResolvedValue(document.fileKey);
  });

  test('renders correctly', () =>
  {
    const itemUrl = `/item/${document.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);
    
    expect(screen.getByDisplayValue(document.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();
  });

  test('renders correctly when fileKey is null', () => {
    const noPathState = { document: { ...document, fileKey: null } };
    const itemUrl = `/item/${document.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, noPathState);
    
    expect(screen.getByDisplayValue(document.eng_title)).toBeInTheDocument();

    expect(screen.getByText('No Document to Display')).toBeInTheDocument();
  });

  test('renders correctly with viewer', async () =>
  {
    const docList = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';
    when(Storage.get)//.mockResolvedValue(docList);
      .mockReturnValue(Promise.resolve(docList));

    const itemUrl = `/item/${document.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);

    expect(screen.getByDisplayValue(document.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();

    //random string from the file.
    await waitFor(() => {
      //check for the header link
      expect(screen.getByText('docList.json'))
        .toHaveAttribute('href', docList);
      //text is in an iframe, not in the document
      //expect(screen.getByText('Sample Doc 1')).toBeInTheDocument();
    });
  });

  test('renders correctly for admin User', () => {
    const itemUrl = `/item/${document.id}`;
    const adminState = {
      ...state,
      currentUser: {
        ...emptyUser,
        id: 'ADMIN ID',
        name: 'ADMIN USER',
        isAdmin: true,
      }
    }
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, adminState);

    expect(screen.getByDisplayValue(document.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();
  });
});