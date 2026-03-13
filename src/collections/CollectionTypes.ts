// Import from generated Amplify types after 'amplify push'
import type { ModelCollectionItemConnection, Collection, CollectionItem } from '../graphql/API';
import type { User } from "../User/userType";
import type { Xbiis } from "../Box/boxTypes";

import { emptyXbiis } from "../Box/boxTypes";
import { emptyUser } from "../User/userType";

export type { Collection, CollectionItem,
              CreateCollectionInput, UpdateCollectionInput,
              CreateCollectionItemInput, UpdateCollectionItemInput
            } from '../graphql/API';

export const emptyCollection: Collection =
{
   __typename: 'Collection',
   id:         '',

   eng_title:       '',
   eng_description: '',

   collectionOwner:             emptyUser,
   collectionCollectionOwnerId: emptyUser.id,

   created: new Date().toISOString(),
   updated: null,

   box:             emptyXbiis,
   collectionBoxId: emptyXbiis.id,

   bc_title:       '',
   bc_description: '',
   ak_title:       '',
   ak_description: '',

   items: null, //should be emptyCollectionItemList, causes circular reference

   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

export const emptyCollectionItem: CollectionItem = {
   __typename: 'CollectionItem',
   id:         '',

   collection:   emptyCollection,
   collectionID: emptyCollection.id,

   created: new Date().toISOString(),

   documentID:        null,
   childCollectionID: null,
   order:             0,

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