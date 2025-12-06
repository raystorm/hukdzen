// Import from generated Amplify types after 'amplify push'
export type { Collection, CollectionItem } from '../types/AmplifyTypes';

// Action payload types
export interface AddItemsPayload {
   collectionId: string;
   items: CollectionItemInput[];
}

export interface CollectionItemInput {
   documentId?: string;
   childCollectionId?: string;
}

export interface RemoveItemPayload {
   collectionId: string;
   itemId: string;
}

export interface ReorderItemPayload {
   collectionId: string;
   itemId: string;
   direction: 'up' | 'down';
}