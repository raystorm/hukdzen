/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelBoxUserFilterInput = {
  and?: Array< ModelBoxUserFilterInput | null > | null,
  boxUserBoxId?: ModelIDInput | null,
  boxUserUserId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelBoxUserFilterInput | null,
  or?: Array< ModelBoxUserFilterInput | null > | null,
  role?: ModelAccessLevelInput | null,
  updatedAt?: ModelStringInput | null,
  userUserId?: ModelIDInput | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelAccessLevelInput = {
  eq?: AccessLevel | null,
  ne?: AccessLevel | null,
};

export enum AccessLevel {
  NONE = "NONE",
  READ = "READ",
  WRITE = "WRITE",
}


export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelBoxUserConnection = {
  __typename: "ModelBoxUserConnection",
  items:  Array<BoxUser | null >,
  nextToken?: string | null,
};

export type BoxUser = {
  __typename: "BoxUser",
  box?: Xbiis | null,
  boxUserBoxId?: string | null,
  boxUserUserId?: string | null,
  createdAt: string,
  id: string,
  role: AccessLevel,
  updatedAt: string,
  user?: User | null,
  userUserId?: string | null,
};

export type Xbiis = {
  __typename: "Xbiis",
  createdAt: string,
  defaultRole?: AccessLevel | null,
  id: string,
  name: string,
  owner?: User | null,
  ownerUserId?: string | null,
  purpose?: BoxPurpose | null,
  updatedAt: string,
  waa?: string | null,
  xbiisOwnerId?: string | null,
};

export type User = {
  __typename: "User",
  clan?: Clan | null,
  createdAt: string,
  email: string,
  emailPreferences?: EmailPreferences | null,
  id: string,
  isAdmin?: boolean | null,
  name: string,
  updatedAt: string,
  waa?: string | null,
};

export type Gyet = {
  __typename: "Gyet",
  clan?: Clan | null,
  email?: string | null,
  id: string,
  name: string,
  waa?: string | null,
};

export type Author = {
  __typename: "Author",
  clan?: Clan | null,
  createdAt: string,
  email?: string | null,
  id: string,
  name: string,
  updatedAt: string,
  waa?: string | null,
};

export enum Clan {
  GANHADA = "GANHADA",
  GITSBUTWADA = "GITSBUTWADA",
  LAXGIBU = "LAXGIBU",
  LAXSGIIK = "LAXSGIIK",
}


export type EmailPreferences = {
  __typename: "EmailPreferences",
  allOptOut?: boolean | null,
  boxRequestOptOut?: boolean | null,
  collaboratorOptOut?: boolean | null,
  optOutAt?: string | null,
  optOutReason?: OptOutReason | null,
  softBounceCount?: number | null,
  systemOptOut?: boolean | null,
};

export enum OptOutReason {
  BOUNCE_HARD = "BOUNCE_HARD",
  BOUNCE_SOFT = "BOUNCE_SOFT",
  COMPLAINT = "COMPLAINT",
  USER_CHOICE = "USER_CHOICE",
}


export enum BoxPurpose {
  DEFAULT = "DEFAULT",
  GROUP = "GROUP",
  USER = "USER",
}


export type ModelCollectionItemFilterInput = {
  and?: Array< ModelCollectionItemFilterInput | null > | null,
  collectionCollectionId?: ModelIDInput | null,
  collectionItemChildCollectionId?: ModelIDInput | null,
  collectionItemDocumentId?: ModelIDInput | null,
  collectionItemsId?: ModelIDInput | null,
  created?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelCollectionItemFilterInput | null,
  or?: Array< ModelCollectionItemFilterInput | null > | null,
  order?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelCollectionItemConnection = {
  __typename: "ModelCollectionItemConnection",
  items:  Array<CollectionItem | null >,
  nextToken?: string | null,
};

export type CollectionItem = {
  __typename: "CollectionItem",
  childCollection?: Collection | null,
  collection?: Collection | null,
  collectionCollectionId?: string | null,
  collectionItemChildCollectionId?: string | null,
  collectionItemDocumentId?: string | null,
  collectionItemsId?: string | null,
  created: string,
  createdAt: string,
  document?: DocumentDetails | null,
  id: string,
  order?: number | null,
  updatedAt: string,
};

export type Collection = {
  __typename: "Collection",
  ak_description: string,
  ak_title: string,
  bc_description: string,
  bc_title: string,
  box?: Xbiis | null,
  collectionBoxId?: string | null,
  collectionCollectionOwnerId?: string | null,
  collectionOwner?: User | null,
  created: string,
  createdAt: string,
  eng_description: string,
  eng_title: string,
  id: string,
  items?: ModelCollectionItemConnection | null,
  updated?: string | null,
  updatedAt: string,
};

export type DocumentDetails = {
  __typename: "DocumentDetails",
  ak_description: string,
  ak_title: string,
  author?: Author | null,
  bc_description: string,
  bc_title: string,
  box?: Xbiis | null,
  boxXbiisId?: string | null,
  created: string,
  createdAt: string,
  docOwner?: User | null,
  docOwnerUserId?: string | null,
  documentDetailsAuthorId?: string | null,
  documentDetailsBoxId?: string | null,
  documentDetailsDocOwnerId?: string | null,
  eng_description: string,
  eng_title: string,
  fileHash?: string | null,
  fileKey: string,
  id: string,
  keywords?: Array< string | null > | null,
  type?: string | null,
  updated?: string | null,
  updatedAt: string,
  version: number,
};

export type ModelDocumentDetailsFilterInput = {
  ak_description?: ModelStringInput | null,
  ak_title?: ModelStringInput | null,
  and?: Array< ModelDocumentDetailsFilterInput | null > | null,
  bc_description?: ModelStringInput | null,
  bc_title?: ModelStringInput | null,
  boxXbiisId?: ModelIDInput | null,
  created?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  docOwnerUserId?: ModelIDInput | null,
  documentDetailsAuthorId?: ModelIDInput | null,
  documentDetailsBoxId?: ModelIDInput | null,
  documentDetailsDocOwnerId?: ModelIDInput | null,
  eng_description?: ModelStringInput | null,
  eng_title?: ModelStringInput | null,
  fileHash?: ModelStringInput | null,
  fileKey?: ModelStringInput | null,
  id?: ModelIDInput | null,
  keywords?: ModelStringInput | null,
  not?: ModelDocumentDetailsFilterInput | null,
  or?: Array< ModelDocumentDetailsFilterInput | null > | null,
  type?: ModelStringInput | null,
  updated?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  version?: ModelFloatInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelDocumentDetailsConnection = {
  __typename: "ModelDocumentDetailsConnection",
  items:  Array<DocumentDetails | null >,
  nextToken?: string | null,
};

export type BoxRequest = {
  __typename: "BoxRequest",
  approvedBy?: User | null,
  boxRequestApprovedById?: string | null,
  boxRequestCreatedBoxId?: string | null,
  boxRequestCreatedById?: string | null,
  createdAt: string,
  createdBox?: Xbiis | null,
  createdBy?: User | null,
  denialReason?: string | null,
  id: string,
  requestReason: string,
  requestedName: string,
  status: BoxRequestStatus,
  updatedAt: string,
};

export enum BoxRequestStatus {
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  PENDING = "PENDING",
}


export type ModelUserFilterInput = {
  and?: Array< ModelUserFilterInput | null > | null,
  clan?: ModelClanInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isAdmin?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  waa?: ModelStringInput | null,
};

export type ModelClanInput = {
  eq?: Clan | null,
  ne?: Clan | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type AuthorFilterInput = {
  and?: Array< AuthorFilterInput | null > | null,
  clan?: ModelClanInput | null,
  email?: StringFilter | null,
  id?: IDFilter | null,
  name?: StringFilter | null,
  not?: AuthorFilterInput | null,
  or?: Array< AuthorFilterInput | null > | null,
  waa?: StringFilter | null,
};

export type StringFilter = {
  attributeExists?: boolean | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  gt?: string | null,
  gte?: string | null,
  in?: Array< string | null > | null,
  lt?: string | null,
  lte?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type IDFilter = {
  attributeExists?: boolean | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  gt?: string | null,
  gte?: string | null,
  in?: Array< string | null > | null,
  lt?: string | null,
  lte?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type AuthorList = {
  __typename: "AuthorList",
  items?:  Array<Author | null > | null,
  nextToken?: string | null,
};

export type ModelAuthorFilterInput = {
  and?: Array< ModelAuthorFilterInput | null > | null,
  clan?: ModelClanInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelAuthorFilterInput | null,
  or?: Array< ModelAuthorFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  waa?: ModelStringInput | null,
};

export type ModelAuthorConnection = {
  __typename: "ModelAuthorConnection",
  items:  Array<Author | null >,
  nextToken?: string | null,
};

export type BoxRequestFilterInput = {
  and?: Array< BoxRequestFilterInput | null > | null,
  boxRequestApprovedById?: IDFilter | null,
  boxRequestCreatedBoxId?: IDFilter | null,
  boxRequestCreatedById?: IDFilter | null,
  denialReason?: StringFilter | null,
  id?: IDFilter | null,
  not?: BoxRequestFilterInput | null,
  or?: Array< BoxRequestFilterInput | null > | null,
  requestReason?: StringFilter | null,
  requestedName?: StringFilter | null,
  status?: ModelBoxRequestStatusInput | null,
};

export type ModelBoxRequestStatusInput = {
  eq?: BoxRequestStatus | null,
  ne?: BoxRequestStatus | null,
};

export type BoxRequestList = {
  __typename: "BoxRequestList",
  items?:  Array<BoxRequest | null > | null,
  nextToken?: string | null,
};

export type ModelBoxRequestFilterInput = {
  and?: Array< ModelBoxRequestFilterInput | null > | null,
  boxRequestApprovedById?: ModelIDInput | null,
  boxRequestCreatedBoxId?: ModelIDInput | null,
  boxRequestCreatedById?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  denialReason?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelBoxRequestFilterInput | null,
  or?: Array< ModelBoxRequestFilterInput | null > | null,
  requestReason?: ModelStringInput | null,
  requestedName?: ModelStringInput | null,
  status?: ModelBoxRequestStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelBoxRequestConnection = {
  __typename: "ModelBoxRequestConnection",
  items:  Array<BoxRequest | null >,
  nextToken?: string | null,
};

export type BoxUserFilterInput = {
  and?: Array< BoxUserFilterInput | null > | null,
  boxUserBoxId?: IDFilter | null,
  boxUserUserId?: IDFilter | null,
  id?: IDFilter | null,
  not?: BoxUserFilterInput | null,
  or?: Array< BoxUserFilterInput | null > | null,
  role?: ModelAccessLevelInput | null,
  userUserId?: IDFilter | null,
};

export type BoxUserList = {
  __typename: "BoxUserList",
  items?:  Array<BoxUser | null > | null,
  nextToken?: string | null,
};

export type CollectionFilterInput = {
  ak_description?: StringFilter | null,
  ak_title?: StringFilter | null,
  and?: Array< CollectionFilterInput | null > | null,
  bc_description?: StringFilter | null,
  bc_title?: StringFilter | null,
  created?: DateTimeFilter | null,
  eng_description?: StringFilter | null,
  eng_title?: StringFilter | null,
  id?: IDFilter | null,
  not?: CollectionFilterInput | null,
  or?: Array< CollectionFilterInput | null > | null,
  updated?: DateTimeFilter | null,
};

export type DateTimeFilter = {
  attributeExists?: boolean | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  gt?: string | null,
  gte?: string | null,
  in?: Array< string | null > | null,
  lt?: string | null,
  lte?: string | null,
  ne?: string | null,
  notIn?: Array< string | null > | null,
};

export type CollectionList = {
  __typename: "CollectionList",
  items?:  Array<Collection | null > | null,
  nextToken?: string | null,
};

export type CollectionItemFilterInput = {
  and?: Array< CollectionItemFilterInput | null > | null,
  collectionCollectionId?: IDFilter | null,
  created?: DateTimeFilter | null,
  id?: IDFilter | null,
  not?: CollectionItemFilterInput | null,
  or?: Array< CollectionItemFilterInput | null > | null,
  order?: IntFilter | null,
};

export type IntFilter = {
  attributeExists?: boolean | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  gt?: number | null,
  gte?: number | null,
  in?: Array< number | null > | null,
  lt?: number | null,
  lte?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type CollectionItemList = {
  __typename: "CollectionItemList",
  items?:  Array<CollectionItem | null > | null,
  nextToken?: string | null,
};

export type ModelCollectionFilterInput = {
  ak_description?: ModelStringInput | null,
  ak_title?: ModelStringInput | null,
  and?: Array< ModelCollectionFilterInput | null > | null,
  bc_description?: ModelStringInput | null,
  bc_title?: ModelStringInput | null,
  collectionBoxId?: ModelIDInput | null,
  collectionCollectionOwnerId?: ModelIDInput | null,
  created?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  eng_description?: ModelStringInput | null,
  eng_title?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelCollectionFilterInput | null,
  or?: Array< ModelCollectionFilterInput | null > | null,
  updated?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCollectionConnection = {
  __typename: "ModelCollectionConnection",
  items:  Array<Collection | null >,
  nextToken?: string | null,
};

export type DocumentDetailsFilterInput = {
  ak_description?: StringFilter | null,
  ak_title?: StringFilter | null,
  and?: Array< DocumentDetailsFilterInput | null > | null,
  bc_description?: StringFilter | null,
  bc_title?: StringFilter | null,
  boxXbiisId?: IDFilter | null,
  created?: DateTimeFilter | null,
  docOwnerUserId?: IDFilter | null,
  eng_description?: StringFilter | null,
  eng_title?: StringFilter | null,
  fileHash?: StringFilter | null,
  fileKey?: StringFilter | null,
  id?: IDFilter | null,
  not?: DocumentDetailsFilterInput | null,
  or?: Array< DocumentDetailsFilterInput | null > | null,
  type?: StringFilter | null,
  updated?: DateTimeFilter | null,
  version?: FloatFilter | null,
};

export type FloatFilter = {
  attributeExists?: boolean | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  gt?: number | null,
  gte?: number | null,
  in?: Array< number | null > | null,
  lt?: number | null,
  lte?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type DocumentDetailsList = {
  __typename: "DocumentDetailsList",
  items?:  Array<DocumentDetails | null > | null,
  nextToken?: string | null,
};

export type UserFilterInput = {
  and?: Array< UserFilterInput | null > | null,
  clan?: ModelClanInput | null,
  email?: StringFilter | null,
  id?: IDFilter | null,
  isAdmin?: BooleanFilter | null,
  name?: StringFilter | null,
  not?: UserFilterInput | null,
  or?: Array< UserFilterInput | null > | null,
  waa?: StringFilter | null,
};

export type BooleanFilter = {
  attributeExists?: boolean | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type UserList = {
  __typename: "UserList",
  items?:  Array<User | null > | null,
  nextToken?: string | null,
};

export type ModelXbiisFilterInput = {
  and?: Array< ModelXbiisFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  defaultRole?: ModelAccessLevelInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelXbiisFilterInput | null,
  or?: Array< ModelXbiisFilterInput | null > | null,
  ownerUserId?: ModelIDInput | null,
  purpose?: ModelBoxPurposeInput | null,
  updatedAt?: ModelStringInput | null,
  waa?: ModelStringInput | null,
  xbiisOwnerId?: ModelIDInput | null,
};

export type ModelBoxPurposeInput = {
  eq?: BoxPurpose | null,
  ne?: BoxPurpose | null,
};

export type ModelXbiisConnection = {
  __typename: "ModelXbiisConnection",
  items:  Array<Xbiis | null >,
  nextToken?: string | null,
};

export type XbiisFilterInput = {
  and?: Array< XbiisFilterInput | null > | null,
  defaultRole?: ModelAccessLevelInput | null,
  id?: IDFilter | null,
  name?: StringFilter | null,
  not?: XbiisFilterInput | null,
  or?: Array< XbiisFilterInput | null > | null,
  ownerUserId?: IDFilter | null,
  purpose?: ModelBoxPurposeInput | null,
  waa?: StringFilter | null,
  xbiisOwnerId?: IDFilter | null,
};

export type XbiisList = {
  __typename: "XbiisList",
  items?:  Array<Xbiis | null > | null,
  nextToken?: string | null,
};

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type SearchResults = {
  __typename: "SearchResults",
  from: number,
  items:  Array<SearchResultItem >,
  limit: number,
  nextToken?: string | null,
  total: number,
};

export type SearchResultItem = {
  __typename: "SearchResultItem",
  collection?: Collection | null,
  document?: DocumentDetails | null,
  score?: number | null,
  type: SearchResultType,
};

export enum SearchResultType {
  COLLECTION = "COLLECTION",
  DOCUMENT = "DOCUMENT",
}


export type ModelAuthorConditionInput = {
  and?: Array< ModelAuthorConditionInput | null > | null,
  clan?: ModelClanInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelAuthorConditionInput | null,
  or?: Array< ModelAuthorConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  waa?: ModelStringInput | null,
};

export type CreateAuthorInput = {
  clan?: Clan | null,
  email?: string | null,
  id?: string | null,
  name: string,
  waa?: string | null,
};

export type AuthorInput = {
  clan?: Clan | null,
  email?: string | null,
  id?: string | null,
  name: string,
  waa?: string | null,
};

export type ModelBoxRequestConditionInput = {
  and?: Array< ModelBoxRequestConditionInput | null > | null,
  boxRequestApprovedById?: ModelIDInput | null,
  boxRequestCreatedBoxId?: ModelIDInput | null,
  boxRequestCreatedById?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  denialReason?: ModelStringInput | null,
  not?: ModelBoxRequestConditionInput | null,
  or?: Array< ModelBoxRequestConditionInput | null > | null,
  requestReason?: ModelStringInput | null,
  requestedName?: ModelStringInput | null,
  status?: ModelBoxRequestStatusInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateBoxRequestInput = {
  boxRequestApprovedById?: string | null,
  boxRequestCreatedBoxId?: string | null,
  boxRequestCreatedById?: string | null,
  denialReason?: string | null,
  id?: string | null,
  requestReason: string,
  requestedName: string,
  status: BoxRequestStatus,
};

export type BoxRequestInput = {
  approvedByUserId?: string | null,
  createdBoxXbiisId?: string | null,
  createdByUserId: string,
  denialReason?: string | null,
  id?: string | null,
  requestReason: string,
  requestedName: string,
  status: BoxRequestStatus,
};

export type ModelBoxUserConditionInput = {
  and?: Array< ModelBoxUserConditionInput | null > | null,
  boxUserBoxId?: ModelIDInput | null,
  boxUserUserId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelBoxUserConditionInput | null,
  or?: Array< ModelBoxUserConditionInput | null > | null,
  role?: ModelAccessLevelInput | null,
  updatedAt?: ModelStringInput | null,
  userUserId?: ModelIDInput | null,
};

export type CreateBoxUserInput = {
  boxUserBoxId?: string | null,
  boxUserUserId?: string | null,
  id?: string | null,
  role: AccessLevel,
  userUserId?: string | null,
};

export type BoxUserInput = {
  boxId: string,
  id?: string | null,
  role: AccessLevel,
  userUserId: string,
};

export type ModelCollectionConditionInput = {
  ak_description?: ModelStringInput | null,
  ak_title?: ModelStringInput | null,
  and?: Array< ModelCollectionConditionInput | null > | null,
  bc_description?: ModelStringInput | null,
  bc_title?: ModelStringInput | null,
  collectionBoxId?: ModelIDInput | null,
  collectionCollectionOwnerId?: ModelIDInput | null,
  created?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  eng_description?: ModelStringInput | null,
  eng_title?: ModelStringInput | null,
  not?: ModelCollectionConditionInput | null,
  or?: Array< ModelCollectionConditionInput | null > | null,
  updated?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCollectionInput = {
  ak_description: string,
  ak_title: string,
  bc_description: string,
  bc_title: string,
  collectionBoxId?: string | null,
  collectionCollectionOwnerId?: string | null,
  created: string,
  eng_description: string,
  eng_title: string,
  id?: string | null,
  updated?: string | null,
};

export type CollectionInput = {
  ak_description: string,
  ak_title: string,
  bc_description: string,
  bc_title: string,
  boxXbiisId: string,
  collectionOwnerUserId: string,
  eng_description: string,
  eng_title: string,
  id?: string | null,
};

export type ModelCollectionItemConditionInput = {
  and?: Array< ModelCollectionItemConditionInput | null > | null,
  collectionCollectionId?: ModelIDInput | null,
  collectionItemChildCollectionId?: ModelIDInput | null,
  collectionItemDocumentId?: ModelIDInput | null,
  collectionItemsId?: ModelIDInput | null,
  created?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelCollectionItemConditionInput | null,
  or?: Array< ModelCollectionItemConditionInput | null > | null,
  order?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCollectionItemInput = {
  collectionCollectionId?: string | null,
  collectionItemChildCollectionId?: string | null,
  collectionItemDocumentId?: string | null,
  collectionItemsId?: string | null,
  created: string,
  id?: string | null,
  order?: number | null,
};

export type CollectionItemInput = {
  childCollectionId?: string | null,
  collectionCollectionId: string,
  documentDetailsId?: string | null,
  id?: string | null,
  order?: number | null,
};

export type ModelDocumentDetailsConditionInput = {
  ak_description?: ModelStringInput | null,
  ak_title?: ModelStringInput | null,
  and?: Array< ModelDocumentDetailsConditionInput | null > | null,
  bc_description?: ModelStringInput | null,
  bc_title?: ModelStringInput | null,
  boxXbiisId?: ModelIDInput | null,
  created?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  docOwnerUserId?: ModelIDInput | null,
  documentDetailsAuthorId?: ModelIDInput | null,
  documentDetailsBoxId?: ModelIDInput | null,
  documentDetailsDocOwnerId?: ModelIDInput | null,
  eng_description?: ModelStringInput | null,
  eng_title?: ModelStringInput | null,
  fileHash?: ModelStringInput | null,
  fileKey?: ModelStringInput | null,
  keywords?: ModelStringInput | null,
  not?: ModelDocumentDetailsConditionInput | null,
  or?: Array< ModelDocumentDetailsConditionInput | null > | null,
  type?: ModelStringInput | null,
  updated?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  version?: ModelFloatInput | null,
};

export type CreateDocumentDetailsInput = {
  ak_description: string,
  ak_title: string,
  bc_description: string,
  bc_title: string,
  boxXbiisId?: string | null,
  created: string,
  docOwnerUserId?: string | null,
  documentDetailsAuthorId?: string | null,
  documentDetailsBoxId?: string | null,
  documentDetailsDocOwnerId?: string | null,
  eng_description: string,
  eng_title: string,
  fileHash?: string | null,
  fileKey: string,
  id?: string | null,
  keywords?: Array< string | null > | null,
  type?: string | null,
  updated?: string | null,
  version: number,
};

export type DocumentDetailsInput = {
  ak_description: string,
  ak_title: string,
  authorId: string,
  bc_description: string,
  bc_title: string,
  boxXbiisId: string,
  docOwnerUserId: string,
  eng_description: string,
  eng_title: string,
  fileHash?: string | null,
  fileKey: string,
  id?: string | null,
  keywords?: Array< string | null > | null,
  type?: string | null,
  version: number,
};

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  clan?: ModelClanInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  waa?: ModelStringInput | null,
};

export type CreateUserInput = {
  clan?: Clan | null,
  email: string,
  emailPreferences?: EmailPreferencesInput | null,
  id?: string | null,
  isAdmin?: boolean | null,
  name: string,
  waa?: string | null,
};

export type EmailPreferencesInput = {
  allOptOut?: boolean | null,
  boxRequestOptOut?: boolean | null,
  collaboratorOptOut?: boolean | null,
  optOutAt?: string | null,
  optOutReason?: OptOutReason | null,
  softBounceCount?: number | null,
  systemOptOut?: boolean | null,
};

export type UserInput = {
  clan?: Clan | null,
  email: string,
  emailPreferences?: EmailPreferencesInput | null,
  id?: string | null,
  isAdmin?: boolean | null,
  name: string,
  waa?: string | null,
};

export type ModelXbiisConditionInput = {
  and?: Array< ModelXbiisConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  defaultRole?: ModelAccessLevelInput | null,
  name?: ModelStringInput | null,
  not?: ModelXbiisConditionInput | null,
  or?: Array< ModelXbiisConditionInput | null > | null,
  ownerUserId?: ModelIDInput | null,
  purpose?: ModelBoxPurposeInput | null,
  updatedAt?: ModelStringInput | null,
  waa?: ModelStringInput | null,
  xbiisOwnerId?: ModelIDInput | null,
};

export type CreateXbiisInput = {
  defaultRole?: AccessLevel | null,
  id?: string | null,
  name: string,
  ownerUserId?: string | null,
  purpose?: BoxPurpose | null,
  waa?: string | null,
  xbiisOwnerId?: string | null,
};

export type XbiisInput = {
  defaultRole?: AccessLevel | null,
  id?: string | null,
  name: string,
  ownerUserId: string,
  purpose?: BoxPurpose | null,
  waa?: string | null,
};

export type DeleteAuthorInput = {
  id: string,
};

export type DeleteBoxRequestInput = {
  id: string,
};

export type DeleteBoxUserInput = {
  id: string,
};

export type DeleteCollectionInput = {
  id: string,
};

export type DeleteCollectionItemInput = {
  id: string,
};

export type DeleteDocumentDetailsInput = {
  id: string,
};

export type DeleteUserInput = {
  id: string,
};

export type DeleteXbiisInput = {
  id: string,
};

export type UpdateAuthorInput = {
  clan?: Clan | null,
  email?: string | null,
  id: string,
  name?: string | null,
  waa?: string | null,
};

export type UpdateBoxRequestInput = {
  boxRequestApprovedById?: string | null,
  boxRequestCreatedBoxId?: string | null,
  boxRequestCreatedById?: string | null,
  denialReason?: string | null,
  id: string,
  requestReason?: string | null,
  requestedName?: string | null,
  status?: BoxRequestStatus | null,
};

export type UpdateBoxUserInput = {
  boxUserBoxId?: string | null,
  boxUserUserId?: string | null,
  id: string,
  role?: AccessLevel | null,
  userUserId?: string | null,
};

export type UpdateCollectionInput = {
  ak_description?: string | null,
  ak_title?: string | null,
  bc_description?: string | null,
  bc_title?: string | null,
  collectionBoxId?: string | null,
  collectionCollectionOwnerId?: string | null,
  created?: string | null,
  eng_description?: string | null,
  eng_title?: string | null,
  id: string,
  updated?: string | null,
};

export type UpdateCollectionItemInput = {
  collectionCollectionId?: string | null,
  collectionItemChildCollectionId?: string | null,
  collectionItemDocumentId?: string | null,
  collectionItemsId?: string | null,
  created?: string | null,
  id: string,
  order?: number | null,
};

export type UpdateDocumentDetailsInput = {
  ak_description?: string | null,
  ak_title?: string | null,
  bc_description?: string | null,
  bc_title?: string | null,
  boxXbiisId?: string | null,
  created?: string | null,
  docOwnerUserId?: string | null,
  documentDetailsAuthorId?: string | null,
  documentDetailsBoxId?: string | null,
  documentDetailsDocOwnerId?: string | null,
  eng_description?: string | null,
  eng_title?: string | null,
  fileHash?: string | null,
  fileKey?: string | null,
  id: string,
  keywords?: Array< string | null > | null,
  type?: string | null,
  updated?: string | null,
  version?: number | null,
};

export type UpdateUserInput = {
  clan?: Clan | null,
  email?: string | null,
  emailPreferences?: EmailPreferencesInput | null,
  id: string,
  isAdmin?: boolean | null,
  name?: string | null,
  waa?: string | null,
};

export type UpdateXbiisInput = {
  defaultRole?: AccessLevel | null,
  id: string,
  name?: string | null,
  ownerUserId?: string | null,
  purpose?: BoxPurpose | null,
  waa?: string | null,
  xbiisOwnerId?: string | null,
};

export type ModelSubscriptionAuthorFilterInput = {
  and?: Array< ModelSubscriptionAuthorFilterInput | null > | null,
  clan?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionAuthorFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBoxRequestFilterInput = {
  and?: Array< ModelSubscriptionBoxRequestFilterInput | null > | null,
  boxRequestApprovedById?: ModelSubscriptionIDInput | null,
  boxRequestCreatedBoxId?: ModelSubscriptionIDInput | null,
  boxRequestCreatedById?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  denialReason?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionBoxRequestFilterInput | null > | null,
  requestReason?: ModelSubscriptionStringInput | null,
  requestedName?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBoxUserFilterInput = {
  and?: Array< ModelSubscriptionBoxUserFilterInput | null > | null,
  boxUserBoxId?: ModelSubscriptionIDInput | null,
  boxUserUserId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionBoxUserFilterInput | null > | null,
  role?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userUserId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionCollectionFilterInput = {
  ak_description?: ModelSubscriptionStringInput | null,
  ak_title?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCollectionFilterInput | null > | null,
  bc_description?: ModelSubscriptionStringInput | null,
  bc_title?: ModelSubscriptionStringInput | null,
  collectionBoxId?: ModelSubscriptionIDInput | null,
  collectionCollectionOwnerId?: ModelSubscriptionIDInput | null,
  collectionItemsId?: ModelSubscriptionIDInput | null,
  created?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  eng_description?: ModelSubscriptionStringInput | null,
  eng_title?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionCollectionFilterInput | null > | null,
  updated?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionCollectionItemFilterInput = {
  and?: Array< ModelSubscriptionCollectionItemFilterInput | null > | null,
  collectionCollectionId?: ModelSubscriptionIDInput | null,
  collectionItemChildCollectionId?: ModelSubscriptionIDInput | null,
  collectionItemDocumentId?: ModelSubscriptionIDInput | null,
  created?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionCollectionItemFilterInput | null > | null,
  order?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionDocumentDetailsFilterInput = {
  ak_description?: ModelSubscriptionStringInput | null,
  ak_title?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDocumentDetailsFilterInput | null > | null,
  bc_description?: ModelSubscriptionStringInput | null,
  bc_title?: ModelSubscriptionStringInput | null,
  boxXbiisId?: ModelSubscriptionIDInput | null,
  created?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  docOwnerUserId?: ModelSubscriptionIDInput | null,
  documentDetailsAuthorId?: ModelSubscriptionIDInput | null,
  documentDetailsBoxId?: ModelSubscriptionIDInput | null,
  documentDetailsDocOwnerId?: ModelSubscriptionIDInput | null,
  eng_description?: ModelSubscriptionStringInput | null,
  eng_title?: ModelSubscriptionStringInput | null,
  fileHash?: ModelSubscriptionStringInput | null,
  fileKey?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  keywords?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionDocumentDetailsFilterInput | null > | null,
  type?: ModelSubscriptionStringInput | null,
  updated?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  version?: ModelSubscriptionFloatInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  clan?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isAdmin?: ModelSubscriptionBooleanInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionXbiisFilterInput = {
  and?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  defaultRole?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
  ownerUserId?: ModelSubscriptionIDInput | null,
  purpose?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
  xbiisOwnerId?: ModelSubscriptionIDInput | null,
};

export type _emptyQueryVariables = {
};

export type _emptyQuery = {
  _empty?: string | null,
};

export type BoxUsersByUserQueryVariables = {
  filter?: ModelBoxUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userUserId: string,
};

export type BoxUsersByUserQuery = {
  boxUsersByUser?:  {
    __typename: "ModelBoxUserConnection",
    items:  Array< {
      __typename: "BoxUser",
      boxUserBoxId?: string | null,
      boxUserUserId?: string | null,
      createdAt: string,
      id: string,
      role: AccessLevel,
      updatedAt: string,
      userUserId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CollectionItemsByCollectionQueryVariables = {
  collectionCollectionId: string,
  filter?: ModelCollectionItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type CollectionItemsByCollectionQuery = {
  collectionItemsByCollection?:  {
    __typename: "ModelCollectionItemConnection",
    items:  Array< {
      __typename: "CollectionItem",
      collectionCollectionId?: string | null,
      collectionItemChildCollectionId?: string | null,
      collectionItemDocumentId?: string | null,
      collectionItemsId?: string | null,
      created: string,
      createdAt: string,
      id: string,
      order?: number | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DocumentDetailsByBoxQueryVariables = {
  boxXbiisId: string,
  filter?: ModelDocumentDetailsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type DocumentDetailsByBoxQuery = {
  documentDetailsByBox?:  {
    __typename: "ModelDocumentDetailsConnection",
    items:  Array< {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DocumentDetailsByOwnerQueryVariables = {
  docOwnerUserId: string,
  filter?: ModelDocumentDetailsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type DocumentDetailsByOwnerQuery = {
  documentDetailsByOwner?:  {
    __typename: "ModelDocumentDetailsConnection",
    items:  Array< {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAuthorQueryVariables = {
  id: string,
};

export type GetAuthorQuery = {
  getAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type GetAuthorDetailedQueryVariables = {
  id: string,
};

export type GetAuthorDetailedQuery = {
  getAuthorDetailed?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type GetBoxRequestQueryVariables = {
  id: string,
};

export type GetBoxRequestQuery = {
  getBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type GetBoxRequestDetailedQueryVariables = {
  id: string,
};

export type GetBoxRequestDetailedQuery = {
  getBoxRequestDetailed?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type GetBoxUserQueryVariables = {
  id: string,
};

export type GetBoxUserQuery = {
  getBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type GetBoxUserDetailedQueryVariables = {
  id: string,
};

export type GetBoxUserDetailedQuery = {
  getBoxUserDetailed?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type GetCollectionQueryVariables = {
  id: string,
};

export type GetCollectionQuery = {
  getCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type GetCollectionDetailedQueryVariables = {
  id: string,
};

export type GetCollectionDetailedQuery = {
  getCollectionDetailed?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type GetCollectionItemQueryVariables = {
  id: string,
};

export type GetCollectionItemQuery = {
  getCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type GetCollectionItemDetailedQueryVariables = {
  id: string,
};

export type GetCollectionItemDetailedQuery = {
  getCollectionItemDetailed?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type GetDocumentDetailsQueryVariables = {
  id: string,
};

export type GetDocumentDetailsQuery = {
  getDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type GetDocumentDetailsDetailedQueryVariables = {
  id: string,
};

export type GetDocumentDetailsDetailedQuery = {
  getDocumentDetailsDetailed?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type GetUserByEmailQueryVariables = {
  email: string,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type GetUserByEmailQuery = {
  getUserByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserDetailedQueryVariables = {
  id: string,
};

export type GetUserDetailedQuery = {
  getUserDetailed?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type GetXbiisQueryVariables = {
  id: string,
};

export type GetXbiisQuery = {
  getXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type GetXbiisDetailedQueryVariables = {
  id: string,
};

export type GetXbiisDetailedQuery = {
  getXbiisDetailed?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type ListAuthorDetailedQueryVariables = {
  filter?: AuthorFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAuthorDetailedQuery = {
  listAuthorDetailed?:  {
    __typename: "AuthorList",
    items?:  Array< {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListAuthorsQueryVariables = {
  filter?: ModelAuthorFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAuthorsQuery = {
  listAuthors?:  {
    __typename: "ModelAuthorConnection",
    items:  Array< {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListBoxRequestDetailedQueryVariables = {
  filter?: BoxRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBoxRequestDetailedQuery = {
  listBoxRequestDetailed?:  {
    __typename: "BoxRequestList",
    items?:  Array< {
      __typename: "BoxRequest",
      boxRequestApprovedById?: string | null,
      boxRequestCreatedBoxId?: string | null,
      boxRequestCreatedById?: string | null,
      createdAt: string,
      denialReason?: string | null,
      id: string,
      requestReason: string,
      requestedName: string,
      status: BoxRequestStatus,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListBoxRequestsQueryVariables = {
  filter?: ModelBoxRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBoxRequestsQuery = {
  listBoxRequests?:  {
    __typename: "ModelBoxRequestConnection",
    items:  Array< {
      __typename: "BoxRequest",
      boxRequestApprovedById?: string | null,
      boxRequestCreatedBoxId?: string | null,
      boxRequestCreatedById?: string | null,
      createdAt: string,
      denialReason?: string | null,
      id: string,
      requestReason: string,
      requestedName: string,
      status: BoxRequestStatus,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListBoxUsersQueryVariables = {
  filter?: ModelBoxUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBoxUsersQuery = {
  listBoxUsers?:  {
    __typename: "ModelBoxUserConnection",
    items:  Array< {
      __typename: "BoxUser",
      boxUserBoxId?: string | null,
      boxUserUserId?: string | null,
      createdAt: string,
      id: string,
      role: AccessLevel,
      updatedAt: string,
      userUserId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListBoxUsersDetailedQueryVariables = {
  filter?: BoxUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBoxUsersDetailedQuery = {
  listBoxUsersDetailed?:  {
    __typename: "BoxUserList",
    items?:  Array< {
      __typename: "BoxUser",
      boxUserBoxId?: string | null,
      boxUserUserId?: string | null,
      createdAt: string,
      id: string,
      role: AccessLevel,
      updatedAt: string,
      userUserId?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListCollectionDetailedQueryVariables = {
  filter?: CollectionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCollectionDetailedQuery = {
  listCollectionDetailed?:  {
    __typename: "CollectionList",
    items?:  Array< {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListCollectionItemDetailedQueryVariables = {
  filter?: CollectionItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCollectionItemDetailedQuery = {
  listCollectionItemDetailed?:  {
    __typename: "CollectionItemList",
    items?:  Array< {
      __typename: "CollectionItem",
      collectionCollectionId?: string | null,
      collectionItemChildCollectionId?: string | null,
      collectionItemDocumentId?: string | null,
      collectionItemsId?: string | null,
      created: string,
      createdAt: string,
      id: string,
      order?: number | null,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListCollectionItemsQueryVariables = {
  filter?: ModelCollectionItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCollectionItemsQuery = {
  listCollectionItems?:  {
    __typename: "ModelCollectionItemConnection",
    items:  Array< {
      __typename: "CollectionItem",
      collectionCollectionId?: string | null,
      collectionItemChildCollectionId?: string | null,
      collectionItemDocumentId?: string | null,
      collectionItemsId?: string | null,
      created: string,
      createdAt: string,
      id: string,
      order?: number | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCollectionsQueryVariables = {
  filter?: ModelCollectionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCollectionsQuery = {
  listCollections?:  {
    __typename: "ModelCollectionConnection",
    items:  Array< {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDocumentDetailsQueryVariables = {
  filter?: ModelDocumentDetailsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDocumentDetailsQuery = {
  listDocumentDetails?:  {
    __typename: "ModelDocumentDetailsConnection",
    items:  Array< {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDocumentDetailsDetailedQueryVariables = {
  filter?: DocumentDetailsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDocumentDetailsDetailedQuery = {
  listDocumentDetailsDetailed?:  {
    __typename: "DocumentDetailsList",
    items?:  Array< {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListUserDetailedQueryVariables = {
  filter?: UserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserDetailedQuery = {
  listUserDetailed?:  {
    __typename: "UserList",
    items?:  Array< {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListXbiisQueryVariables = {
  filter?: ModelXbiisFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListXbiisQuery = {
  listXbiis?:  {
    __typename: "ModelXbiisConnection",
    items:  Array< {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListXbiisDetailedQueryVariables = {
  filter?: XbiisFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListXbiisDetailedQuery = {
  listXbiisDetailed?:  {
    __typename: "XbiisList",
    items?:  Array< {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type SearchQueryVariables = {
  boxIds?: Array< string > | null,
  field?: string | null,
  from?: number | null,
  limit?: number | null,
  query: string,
  sortDirection?: SortDirection | null,
  sortField?: string | null,
};

export type SearchQuery = {
  search?:  {
    __typename: "SearchResults",
    from: number,
    items:  Array< {
      __typename: "SearchResultItem",
      score?: number | null,
      type: SearchResultType,
    } >,
    limit: number,
    nextToken?: string | null,
    total: number,
  } | null,
};

export type XbiisByOwnerQueryVariables = {
  filter?: ModelXbiisFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  ownerUserId: string,
  sortDirection?: ModelSortDirection | null,
};

export type XbiisByOwnerQuery = {
  xbiisByOwner?:  {
    __typename: "ModelXbiisConnection",
    items:  Array< {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type _ignoreMutationVariables = {
};

export type _ignoreMutation = {
  _ignore?: string | null,
};

export type CreateAuthorMutationVariables = {
  condition?: ModelAuthorConditionInput | null,
  input: CreateAuthorInput,
};

export type CreateAuthorMutation = {
  createAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type CreateAuthorGuardedMutationVariables = {
  input: AuthorInput,
};

export type CreateAuthorGuardedMutation = {
  createAuthorGuarded?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type CreateBoxRequestMutationVariables = {
  condition?: ModelBoxRequestConditionInput | null,
  input: CreateBoxRequestInput,
};

export type CreateBoxRequestMutation = {
  createBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type CreateBoxRequestGuardedMutationVariables = {
  input: BoxRequestInput,
};

export type CreateBoxRequestGuardedMutation = {
  createBoxRequestGuarded?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type CreateBoxUserMutationVariables = {
  condition?: ModelBoxUserConditionInput | null,
  input: CreateBoxUserInput,
};

export type CreateBoxUserMutation = {
  createBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type CreateBoxUserGuardedMutationVariables = {
  input: BoxUserInput,
};

export type CreateBoxUserGuardedMutation = {
  createBoxUserGuarded?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type CreateCollectionMutationVariables = {
  condition?: ModelCollectionConditionInput | null,
  input: CreateCollectionInput,
};

export type CreateCollectionMutation = {
  createCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateCollectionGuardedMutationVariables = {
  input: CollectionInput,
};

export type CreateCollectionGuardedMutation = {
  createCollectionGuarded?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateCollectionItemMutationVariables = {
  condition?: ModelCollectionItemConditionInput | null,
  input: CreateCollectionItemInput,
};

export type CreateCollectionItemMutation = {
  createCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type CreateCollectionItemGuardedMutationVariables = {
  input: CollectionItemInput,
};

export type CreateCollectionItemGuardedMutation = {
  createCollectionItemGuarded?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type CreateDocumentDetailsMutationVariables = {
  condition?: ModelDocumentDetailsConditionInput | null,
  input: CreateDocumentDetailsInput,
};

export type CreateDocumentDetailsMutation = {
  createDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type CreateDocumentDetailsGuardedMutationVariables = {
  input: DocumentDetailsInput,
};

export type CreateDocumentDetailsGuardedMutation = {
  createDocumentDetailsGuarded?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type CreateUserGuardedMutationVariables = {
  input: UserInput,
};

export type CreateUserGuardedMutation = {
  createUserGuarded?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type CreateXbiisMutationVariables = {
  condition?: ModelXbiisConditionInput | null,
  input: CreateXbiisInput,
};

export type CreateXbiisMutation = {
  createXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type CreateXbiisGuardedMutationVariables = {
  input: XbiisInput,
};

export type CreateXbiisGuardedMutation = {
  createXbiisGuarded?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type DeleteAuthorMutationVariables = {
  condition?: ModelAuthorConditionInput | null,
  input: DeleteAuthorInput,
};

export type DeleteAuthorMutation = {
  deleteAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type DeleteBoxRequestMutationVariables = {
  condition?: ModelBoxRequestConditionInput | null,
  input: DeleteBoxRequestInput,
};

export type DeleteBoxRequestMutation = {
  deleteBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type DeleteBoxUserMutationVariables = {
  condition?: ModelBoxUserConditionInput | null,
  input: DeleteBoxUserInput,
};

export type DeleteBoxUserMutation = {
  deleteBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type DeleteCollectionMutationVariables = {
  condition?: ModelCollectionConditionInput | null,
  input: DeleteCollectionInput,
};

export type DeleteCollectionMutation = {
  deleteCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteCollectionItemMutationVariables = {
  condition?: ModelCollectionItemConditionInput | null,
  input: DeleteCollectionItemInput,
};

export type DeleteCollectionItemMutation = {
  deleteCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type DeleteDocumentDetailsMutationVariables = {
  condition?: ModelDocumentDetailsConditionInput | null,
  input: DeleteDocumentDetailsInput,
};

export type DeleteDocumentDetailsMutation = {
  deleteDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type DeleteXbiisMutationVariables = {
  condition?: ModelXbiisConditionInput | null,
  input: DeleteXbiisInput,
};

export type DeleteXbiisMutation = {
  deleteXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type SendTemplatedEmailMutationVariables = {
  cc?: Array< string | null > | null,
  globalParams?: string | null,
  templateArgs: string,
  templateName: string,
  to: Array< string >,
};

export type SendTemplatedEmailMutation = {
  sendTemplatedEmail?: string | null,
};

export type UpdateAuthorMutationVariables = {
  condition?: ModelAuthorConditionInput | null,
  input: UpdateAuthorInput,
};

export type UpdateAuthorMutation = {
  updateAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type UpdateAuthorGuardedMutationVariables = {
  input: AuthorInput,
};

export type UpdateAuthorGuardedMutation = {
  updateAuthorGuarded?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type UpdateBoxRequestMutationVariables = {
  condition?: ModelBoxRequestConditionInput | null,
  input: UpdateBoxRequestInput,
};

export type UpdateBoxRequestMutation = {
  updateBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type UpdateBoxRequestGuardedMutationVariables = {
  input: BoxRequestInput,
};

export type UpdateBoxRequestGuardedMutation = {
  updateBoxRequestGuarded?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type UpdateBoxUserMutationVariables = {
  condition?: ModelBoxUserConditionInput | null,
  input: UpdateBoxUserInput,
};

export type UpdateBoxUserMutation = {
  updateBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type UpdateBoxUserGuardedMutationVariables = {
  input: BoxUserInput,
};

export type UpdateBoxUserGuardedMutation = {
  updateBoxUserGuarded?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type UpdateCollectionMutationVariables = {
  condition?: ModelCollectionConditionInput | null,
  input: UpdateCollectionInput,
};

export type UpdateCollectionMutation = {
  updateCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateCollectionGuardedMutationVariables = {
  input: CollectionInput,
};

export type UpdateCollectionGuardedMutation = {
  updateCollectionGuarded?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateCollectionItemMutationVariables = {
  condition?: ModelCollectionItemConditionInput | null,
  input: UpdateCollectionItemInput,
};

export type UpdateCollectionItemMutation = {
  updateCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type UpdateCollectionItemGuardedMutationVariables = {
  input: CollectionItemInput,
};

export type UpdateCollectionItemGuardedMutation = {
  updateCollectionItemGuarded?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type UpdateDocumentDetailsMutationVariables = {
  condition?: ModelDocumentDetailsConditionInput | null,
  input: UpdateDocumentDetailsInput,
};

export type UpdateDocumentDetailsMutation = {
  updateDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type UpdateDocumentDetailsGuardedMutationVariables = {
  input: DocumentDetailsInput,
};

export type UpdateDocumentDetailsGuardedMutation = {
  updateDocumentDetailsGuarded?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type UpdateUserEmailPreferencesMutationVariables = {
  email: string,
  preferences: string,
  token: string,
};

export type UpdateUserEmailPreferencesMutation = {
  updateUserEmailPreferences?:  {
    __typename: "EmailPreferences",
    allOptOut?: boolean | null,
    boxRequestOptOut?: boolean | null,
    collaboratorOptOut?: boolean | null,
    optOutAt?: string | null,
    optOutReason?: OptOutReason | null,
    softBounceCount?: number | null,
    systemOptOut?: boolean | null,
  } | null,
};

export type UpdateUserGuardedMutationVariables = {
  input: UserInput,
};

export type UpdateUserGuardedMutation = {
  updateUserGuarded?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type UpdateXbiisMutationVariables = {
  condition?: ModelXbiisConditionInput | null,
  input: UpdateXbiisInput,
};

export type UpdateXbiisMutation = {
  updateXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type UpdateXbiisGuardedMutationVariables = {
  input: XbiisInput,
};

export type UpdateXbiisGuardedMutation = {
  updateXbiisGuarded?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type OnCreateAuthorSubscriptionVariables = {
  filter?: ModelSubscriptionAuthorFilterInput | null,
};

export type OnCreateAuthorSubscription = {
  onCreateAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type OnCreateBoxRequestSubscriptionVariables = {
  filter?: ModelSubscriptionBoxRequestFilterInput | null,
};

export type OnCreateBoxRequestSubscription = {
  onCreateBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type OnCreateBoxUserSubscriptionVariables = {
  filter?: ModelSubscriptionBoxUserFilterInput | null,
};

export type OnCreateBoxUserSubscription = {
  onCreateBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type OnCreateCollectionSubscriptionVariables = {
  filter?: ModelSubscriptionCollectionFilterInput | null,
};

export type OnCreateCollectionSubscription = {
  onCreateCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateCollectionItemSubscriptionVariables = {
  filter?: ModelSubscriptionCollectionItemFilterInput | null,
};

export type OnCreateCollectionItemSubscription = {
  onCreateCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type OnCreateDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
};

export type OnCreateDocumentDetailsSubscription = {
  onCreateDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type OnCreateXbiisSubscriptionVariables = {
  filter?: ModelSubscriptionXbiisFilterInput | null,
};

export type OnCreateXbiisSubscription = {
  onCreateXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type OnDeleteAuthorSubscriptionVariables = {
  filter?: ModelSubscriptionAuthorFilterInput | null,
};

export type OnDeleteAuthorSubscription = {
  onDeleteAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type OnDeleteBoxRequestSubscriptionVariables = {
  filter?: ModelSubscriptionBoxRequestFilterInput | null,
};

export type OnDeleteBoxRequestSubscription = {
  onDeleteBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type OnDeleteBoxUserSubscriptionVariables = {
  filter?: ModelSubscriptionBoxUserFilterInput | null,
};

export type OnDeleteBoxUserSubscription = {
  onDeleteBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type OnDeleteCollectionSubscriptionVariables = {
  filter?: ModelSubscriptionCollectionFilterInput | null,
};

export type OnDeleteCollectionSubscription = {
  onDeleteCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteCollectionItemSubscriptionVariables = {
  filter?: ModelSubscriptionCollectionItemFilterInput | null,
};

export type OnDeleteCollectionItemSubscription = {
  onDeleteCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
};

export type OnDeleteDocumentDetailsSubscription = {
  onDeleteDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type OnDeleteXbiisSubscriptionVariables = {
  filter?: ModelSubscriptionXbiisFilterInput | null,
};

export type OnDeleteXbiisSubscription = {
  onDeleteXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};

export type OnUpdateAuthorSubscriptionVariables = {
  filter?: ModelSubscriptionAuthorFilterInput | null,
};

export type OnUpdateAuthorSubscription = {
  onUpdateAuthor?:  {
    __typename: "Author",
    clan?: Clan | null,
    createdAt: string,
    email?: string | null,
    id: string,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type OnUpdateBoxRequestSubscriptionVariables = {
  filter?: ModelSubscriptionBoxRequestFilterInput | null,
};

export type OnUpdateBoxRequestSubscription = {
  onUpdateBoxRequest?:  {
    __typename: "BoxRequest",
    approvedBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    boxRequestApprovedById?: string | null,
    boxRequestCreatedBoxId?: string | null,
    boxRequestCreatedById?: string | null,
    createdAt: string,
    createdBox?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    createdBy?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    denialReason?: string | null,
    id: string,
    requestReason: string,
    requestedName: string,
    status: BoxRequestStatus,
    updatedAt: string,
  } | null,
};

export type OnUpdateBoxUserSubscriptionVariables = {
  filter?: ModelSubscriptionBoxUserFilterInput | null,
};

export type OnUpdateBoxUserSubscription = {
  onUpdateBoxUser?:  {
    __typename: "BoxUser",
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxUserBoxId?: string | null,
    boxUserUserId?: string | null,
    createdAt: string,
    id: string,
    role: AccessLevel,
    updatedAt: string,
    user?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    userUserId?: string | null,
  } | null,
};

export type OnUpdateCollectionSubscriptionVariables = {
  filter?: ModelSubscriptionCollectionFilterInput | null,
};

export type OnUpdateCollectionSubscription = {
  onUpdateCollection?:  {
    __typename: "Collection",
    ak_description: string,
    ak_title: string,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    collectionBoxId?: string | null,
    collectionCollectionOwnerId?: string | null,
    collectionOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    created: string,
    createdAt: string,
    eng_description: string,
    eng_title: string,
    id: string,
    items?:  {
      __typename: "ModelCollectionItemConnection",
      nextToken?: string | null,
    } | null,
    updated?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateCollectionItemSubscriptionVariables = {
  filter?: ModelSubscriptionCollectionItemFilterInput | null,
};

export type OnUpdateCollectionItemSubscription = {
  onUpdateCollectionItem?:  {
    __typename: "CollectionItem",
    childCollection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collection?:  {
      __typename: "Collection",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      collectionBoxId?: string | null,
      collectionCollectionOwnerId?: string | null,
      created: string,
      createdAt: string,
      eng_description: string,
      eng_title: string,
      id: string,
      updated?: string | null,
      updatedAt: string,
    } | null,
    collectionCollectionId?: string | null,
    collectionItemChildCollectionId?: string | null,
    collectionItemDocumentId?: string | null,
    collectionItemsId?: string | null,
    created: string,
    createdAt: string,
    document?:  {
      __typename: "DocumentDetails",
      ak_description: string,
      ak_title: string,
      bc_description: string,
      bc_title: string,
      boxXbiisId?: string | null,
      created: string,
      createdAt: string,
      docOwnerUserId?: string | null,
      documentDetailsAuthorId?: string | null,
      documentDetailsBoxId?: string | null,
      documentDetailsDocOwnerId?: string | null,
      eng_description: string,
      eng_title: string,
      fileHash?: string | null,
      fileKey: string,
      id: string,
      keywords?: Array< string | null > | null,
      type?: string | null,
      updated?: string | null,
      updatedAt: string,
      version: number,
    } | null,
    id: string,
    order?: number | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
};

export type OnUpdateDocumentDetailsSubscription = {
  onUpdateDocumentDetails?:  {
    __typename: "DocumentDetails",
    ak_description: string,
    ak_title: string,
    author?:  {
      __typename: "Author",
      clan?: Clan | null,
      createdAt: string,
      email?: string | null,
      id: string,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    bc_description: string,
    bc_title: string,
    box?:  {
      __typename: "Xbiis",
      createdAt: string,
      defaultRole?: AccessLevel | null,
      id: string,
      name: string,
      ownerUserId?: string | null,
      purpose?: BoxPurpose | null,
      updatedAt: string,
      waa?: string | null,
      xbiisOwnerId?: string | null,
    } | null,
    boxXbiisId?: string | null,
    created: string,
    createdAt: string,
    docOwner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    docOwnerUserId?: string | null,
    documentDetailsAuthorId?: string | null,
    documentDetailsBoxId?: string | null,
    documentDetailsDocOwnerId?: string | null,
    eng_description: string,
    eng_title: string,
    fileHash?: string | null,
    fileKey: string,
    id: string,
    keywords?: Array< string | null > | null,
    type?: string | null,
    updated?: string | null,
    updatedAt: string,
    version: number,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    clan?: Clan | null,
    createdAt: string,
    email: string,
    emailPreferences?:  {
      __typename: "EmailPreferences",
      allOptOut?: boolean | null,
      boxRequestOptOut?: boolean | null,
      collaboratorOptOut?: boolean | null,
      optOutAt?: string | null,
      optOutReason?: OptOutReason | null,
      softBounceCount?: number | null,
      systemOptOut?: boolean | null,
    } | null,
    id: string,
    isAdmin?: boolean | null,
    name: string,
    updatedAt: string,
    waa?: string | null,
  } | null,
};

export type OnUpdateXbiisSubscriptionVariables = {
  filter?: ModelSubscriptionXbiisFilterInput | null,
};

export type OnUpdateXbiisSubscription = {
  onUpdateXbiis?:  {
    __typename: "Xbiis",
    createdAt: string,
    defaultRole?: AccessLevel | null,
    id: string,
    name: string,
    owner?:  {
      __typename: "User",
      clan?: Clan | null,
      createdAt: string,
      email: string,
      id: string,
      isAdmin?: boolean | null,
      name: string,
      updatedAt: string,
      waa?: string | null,
    } | null,
    ownerUserId?: string | null,
    purpose?: BoxPurpose | null,
    updatedAt: string,
    waa?: string | null,
    xbiisOwnerId?: string | null,
  } | null,
};
