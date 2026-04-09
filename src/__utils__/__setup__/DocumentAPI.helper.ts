import { vi } from 'vitest'
import { when } from "vitest-when";
import { generateClient } from '@aws-amplify/api';

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import docList from "../__fixtures__/docList.json";
import { emptyUser } from "../../User/userType";
import { Document } from "../../docs/DocumentTypes";
import { DocumentList, emptyDocList } from "../../docs/docList/documentListTypes";
import { emptyDocument } from "../../docs/initialDocumentDetails";
import { emptyAuthor } from "../../Author/AuthorType";
import { DefaultBox } from "../../Box/boxTypes";
import { emptySearchResultItem, emptySearchResults,
         SearchQueryVariables, SearchResultItem, SearchResults
       } from "../../Search/searchTypes";

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
         return Promise.resolve({ data: { search: { ...searchResults } } });
      });
}

// ==== end Search Document and DocumentList below ====== */

let documentList = Documents;
export const setDocList = (list: DocumentList) => { documentList = list; }

export const setupDocListMocking = () =>
{
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listDocuments} ))
      .thenResolve({data: { listDocuments: documentList } });
}

export const defaultCreatedDocument: Document = {
   ...emptyDocument,
   id: 'Newly Generated GUID',
   
   eng: {
      __typename: 'Summary',
      title: 'Newly Created Document',
      description: 'Newly Created Document for unit testing',
   },
   bc: {
      __typename: 'Summary',
      title: 'BS Title',
      description: 'BC Description',
   },
   ak: {
      __typename: 'Summary',
      title: 'AK title',
      description: 'AK description',
   },

   author: emptyAuthor,
   documentAuthorId: emptyAuthor.id,

   contentOwner: emptyUser,
   documentContentOwnerUserId: emptyUser.id,

   box: DefaultBox,
   documentBoxBoxId: DefaultBox.id,

   type: 'text/plain',
   version: 1,
   fileKey: 'test/DOES_NOT_EXIST.txt',
}

let getDoc = docList.items[0] as Document;

export const setGetDocument = (doc: Document) => { getDoc = doc; }

let newDoc: Document = defaultCreatedDocument;
export const setCreatedDocument = (doc: Document) => { newDoc = doc; }

let updatedDoc: Document = docList.items[0] as Document;
export const setUpdatedDoc = (doc: Document) => { updatedDoc = doc; }

export const setupDocumentMocking = () =>
{
   when(client.graphql)
     .calledWith(expect.objectContaining({query: queries.getDocument} ))
     .thenResolve({data: { getDocument: getDoc } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.createDocumentGuarded} ))
     .thenResolve({data: { createDocumentGuarded: newDoc } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.updateDocumentGuarded} ))
     .thenResolve({data: { updateDocumentGuarded: updatedDoc } });
}

/**
 *   reset mock return values to defaults
 *   @param exists if search should return results or not. (default true)
 */
export const resetDefaults = (exists = true) =>
{
   setDocExists(exists);  //search results return default
   setDocList(Documents); //DocList returns default list

   setGetDocument(docList.items[0] as Document);
   setCreatedDocument(defaultCreatedDocument);
   setUpdatedDoc(docList.items[0] as Document);
}
