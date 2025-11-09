import {vi} from 'vitest'
import {when} from "vitest-when";
import { generateClient } from '@aws-amplify/api';

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import docList from "../../data/docList.json";
import {emptyUser} from "../../User/userType";
import {DocumentDetails} from "../../docs/DocumentTypes";
import { emptyDocList } from "../../docs/docList/documentListTypes";
import {emptyDocumentDetails} from "../../docs/initialDocumentDetails";
import {emptyAuthor} from "../../Author/AuthorType";
import {DefaultBox} from "../../Box/boxTypes";
import {SearchDocumentDetailsQueryVariables} from "../../types/AmplifyTypes";

vi.mock('aws-amplify/storage');
const client = generateClient();

let allDocs = docList;
export const setDocList = (list) => { allDocs = list; }

export const setupDocListMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listDocumentDetails} ))
      .thenResolve({data: { listDocumentDetails: allDocs } });
}

export const setupDocSearchMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({ query: queries.searchDocumentDetails }))
      .thenResolve({ data: { searchDocumentDetails: allDocs } });
}

let exists: boolean = false;
export const setDocExists = (docExists: boolean) =>
{ exists = docExists; }

export const setupDocExistsMocking = () =>
{  //limit's search to existence check
   const existsParams : SearchDocumentDetailsQueryVariables =
           {
              filter:
              {
                id: { ne: expect.anything(), },
                or: {
                  fileKey:  { eq: expect.anything(), },
                  fileHash: { eq: expect.anything(), }
                }
              }
           }

   when(client.graphql)
     .calledWith(expect.objectContaining({ query: queries.searchDocumentDetails,
                                           variables: existsParams } ))
     //.mockResolvedValue({data: { searchDocumentDetails: allDocs } });
     .thenDo(() => {
        let docs = {
           data: { searchDocumentDetails: emptyDocList }
        };

        if ( exists)
        {
           docs.data.searchDocumentDetails = {
              ...emptyDocList,
              items: docList.items as DocumentDetails[]
           };

        }

        return Promise.resolve(docs);
     });
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

//used to ensure resets after tests
export const resetDefaults = () => {
   setDocList(docList);
   setDocExists(false);
   setGetDocument(docList.items[0] as DocumentDetails);
   setCreatedDocument(defaultCreatedDocument);
   setUpdatedDoc(docList.items[0] as DocumentDetails);
}
