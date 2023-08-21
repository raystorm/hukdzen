import {when} from "jest-when";
import {API, Storage} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import docList from "../../data/docList.json";
import {emptyUser} from "../../User/userType";
import {DocumentDetails} from "../../docs/DocumentTypes";
import {emptyDocumentDetails} from "../../docs/initialDocumentDetails";
import {emptyAuthor} from "../../Author/AuthorType";
import {DefaultBox} from "../../Box/boxTypes";

let allDocs = docList;
export const setDocList = (list) => { allDocs = list; }

export const setupDocListMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.listDocumentDetails} ))
      .mockResolvedValue({data: { listDocumentDetails: allDocs } });
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

export const setupDocumentMocking = () => {

   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.getDocumentDetails} ))
      .mockResolvedValue({data: { getDocumentDetails: getDoc } });

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.createDocumentDetails} ))
      .mockResolvedValue({data: { createDocumentDetails: newDoc } });

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateDocumentDetails} ))
      .mockResolvedValue({data: { updateDocumentDetails: updatedDoc } });
}

export const setupStorageMocking = () => {
   // @ts-ignore
   Storage.copy = jest.fn((src, dest, config?) =>
      { return Promise.resolve({fileKey: dest.key}); }
   );

   when(Storage.remove)
     .mockResolvedValue({
                          DeleteMarker: true,
                          VersionId: '',
                          $metadata: {},
                        });
}
