// Import from generated Amplify types after 'amplify push'
import type { ModelCollectionItemConnection, Collection, CollectionItem } from '../graphql/API';
import type { User } from "../User/userType";
import type { Box } from "../Box/boxTypes";

import { emptyBox } from "../Box/boxTypes";
import { emptyUser } from "../User/userType";
import { emptySummary } from '../Content/ContentType';

export type { Collection, CollectionItem,
              CreateCollectionInput, UpdateCollectionInput,
              CreateCollectionItemInput, UpdateCollectionItemInput
            } from '../graphql/API';

export const emptyCollection: Collection =
{
   __typename: 'Collection',
   id:         '',

   eng: emptySummary,
   bc:  emptySummary,
   ak:  emptySummary,

   contentOwner:                 emptyUser,
   collectionContentOwnerUserId: emptyUser.id,
   collectionContentOwnerId:     emptyUser.id,

   created: new Date().toISOString(),
   updated: null,

   box:             emptyBox,
   collectionBoxId: emptyBox.id,

   items: null, //should be emptyCollectionItemList, causes circular reference

   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

export const emptyCollectionItem: CollectionItem = {
   __typename: 'CollectionItem',
   id:         '',

   collection:             emptyCollection,
   collectionCollectionId: emptyCollection.id,

   created: new Date().toISOString(),

   collectionItemDocumentId:        null,
   collectionItemChildCollectionId: null,
   order:                           0,

   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

export const emptyCollectionItemList: ModelCollectionItemConnection =
{
   __typename: 'ModelCollectionItemConnection',
   items:      [emptyCollectionItem],
   nextToken:  null,
};

// Action payload types
export interface AddItemsPayload {
   collectionId: string;
   items: CollectionItemInput[];
}

export interface CollectionItemInput {
   documentId?:        string;
   childCollectionId?: string;
}

export interface RemoveItemPayload {
   collectionId: string;
   itemId:       string;
}

export interface ReorderItemPayload {
   collectionId: string;
   itemId:       string;
   direction:    'up' | 'down';
}