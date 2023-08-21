import react from 'react'
import { screen, } from '@testing-library/react'

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
  });

  test('renders correctly', () => {
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