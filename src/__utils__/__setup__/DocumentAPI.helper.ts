import {vi} from 'vitest'
import {when} from "vitest-when";
import { generateClient } from '@aws-amplify/api';

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import docList from "../__fixtures__/docList.json";
import {emptyUser} from "../../User/userType";
import {DocumentDetails} from "../../docs/DocumentTypes";
import { DocumentList, emptyDocList } from "../../docs/docList/documentListTypes";
import {emptyDocumentDetails} from "../../docs/initialDocumentDetails";
import {emptyAuthor} from "../../Author/AuthorType";
import {DefaultBox} from "../../Box/boxTypes";
import {
   emptySearchResultItem,
   emptySearchResults,
   SearchQueryVariables,
   SearchResultItem, SearchResults
} from "../../Search/searchTypes";
import { search } from "../../graphql/queries";

vi.mock('aws-amplify/storage');
const client = generateClient();

/*
 *  TODO: move search mocks to a new file
 */

const Documents = docList as DocumentList;
/**
 *  helper to convert a DocumentList into SearchResults
 *  @param docs DocumentList to convert, defaults to full list from docList.json
 */
export const buildSearchResults = (docs = Documents): SearchResults =>
{
   let results = { ...emptySearchResults };
   results.items = [];
   for (const doc of docs.items)
   { results.items.push({ ...emptySearchResultItem, document: doc }); }
   return results;
}
const defaultResults = buildSearchResults();

let searchResults = defaultResults;
export const setSearchResults = (results: SearchResults) => { searchResults = results; }

/**
 *  Convenience setter for setting searchResults to empty for DocExistence checks
 *  @param exists flag is search should return results or not.
 */
export const setDocExists = (exists: boolean) =>
{
   if (exists) { searchResults = defaultResults; }
   else { searchResults = emptySearchResults; }
}

export const setupSearchMocking = () =>
{
   when(client.graphql)
      .calledWith(expect.objectContaining({ query: queries.search }))
      //.thenResolve({ data: { search: searchResults } });
      .thenDo(() => {
         console.log("Search Intercepted");
         return Promise.resolve({ data: { search: searchResults } });
      });
}

// ==== end Search Document and DocumentList below ====== */

let documentList = Documents;
export const setDocList = (list: DocumentList) => { documentList = list; }

export const setupDocListMocking = () =>
{
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listDocumentDetails} ))
      .thenResolve({data: { listDocumentDetails: documentList } });
}

export const defaultCreatedDocument: DocumentDetails = {
   ...emptyDocumentDetails,
   id:              'Newly Generated GUID',
   eng_title:       'Newly Created Document',
   eng_description: 'Newly Created Document for unit testing',

   author: emptyAuthor,
   documentDetailsAuthorId: emptyAuthor.id,

   docOwner: emptyUser,
   documentDetailsDocOwnerId: emptyUser.id,

   box: DefaultBox,
   documentDetailsBoxId: DefaultBox.id,

   bc_title: 'BS Title',
   bc_description: 'BC Description',

   ak_title: 'AK title',
   ak_description: 'AK description',

   type: 'text/plain',
   version: 1,
   fileKey: 'test/DOES_NOT_EXIST.txt',
}

let getDoc = docList.items[0] as DocumentDetails;

export const setGetDocument = (doc: DocumentDetails) => { getDoc = doc; }

let newDoc: DocumentDetails = defaultCreatedDocument;
export const setCreatedDocument = (doc: DocumentDetails) => { newDoc = doc; }

let updatedDoc: DocumentDetails = docList.items[0] as DocumentDetails;
export const setUpdatedDoc = (doc: DocumentDetails) => { updatedDoc = doc; }

export const setupDocumentMocking = () =>
{
   when(client.graphql)
     .calledWith(expect.objectContaining({query: queries.getDocumentDetails} ))
     .thenResolve({data: { getDocumentDetails: getDoc } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.createDocumentDetails} ))
     .thenResolve({data: { createDocumentDetails: newDoc } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.updateDocumentDetails} ))
     .thenResolve({data: { updateDocumentDetails: updatedDoc } });
}

/**
 *   reset mock return values to defaults
 *   @param exists if search should return results or not. (default true)
 */
export const resetDefaults = (exists = true) =>
{
   setDocExists(exists);  //search results return default
   setDocList(Documents); //DocList returns default list

   setGetDocument(docList.items[0] as DocumentDetails);
   setCreatedDocument(defaultCreatedDocument);
   setUpdatedDoc(docList.items[0] as DocumentDetails);
}
