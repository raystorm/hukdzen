/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateDocumentDetailsInput = {
  id?: string | null,
  eng_title: string,
  eng_description: string,
  fileKey: string,
  created: string,
  updated?: string | null,
  type?: string | null,
  version: number,
  bc_title: string,
  bc_description: string,
  ak_title: string,
  ak_description: string,
  documentDetailsAuthorId: string,
  documentDetailsDocOwnerId: string,
  documentDetailsBoxId: string,
};

export type ModelDocumentDetailsConditionInput = {
  eng_title?: ModelStringInput | null,
  eng_description?: ModelStringInput | null,
  fileKey?: ModelStringInput | null,
  created?: ModelStringInput | null,
  updated?: ModelStringInput | null,
  type?: ModelStringInput | null,
  version?: ModelFloatInput | null,
  bc_title?: ModelStringInput | null,
  bc_description?: ModelStringInput | null,
  ak_title?: ModelStringInput | null,
  ak_description?: ModelStringInput | null,
  and?: Array< ModelDocumentDetailsConditionInput | null > | null,
  or?: Array< ModelDocumentDetailsConditionInput | null > | null,
  not?: ModelDocumentDetailsConditionInput | null,
  documentDetailsAuthorId?: ModelIDInput | null,
  documentDetailsDocOwnerId?: ModelIDInput | null,
  documentDetailsBoxId?: ModelIDInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type DocumentDetails = {
  __typename: "DocumentDetails",
  id: string,
  eng_title: string,
  eng_description: string,
  author: Author,
  docOwner: User,
  fileKey: string,
  created: string,
  updated?: string | null,
  type?: string | null,
  version: number,
  box: Xbiis,
  bc_title: string,
  bc_description: string,
  ak_title: string,
  ak_description: string,
  createdAt: string,
  updatedAt: string,
  documentDetailsAuthorId: string,
  documentDetailsDocOwnerId: string,
  documentDetailsBoxId: string,
};

export type Author = {
  __typename: "Author",
  id: string,
  name: string,
  clan?: Clan | null,
  waa?: string | null,
  email?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type Gyet = {
  __typename: "Gyet",
  id: string,
  name: string,
  clan?: Clan | null,
  waa?: string | null,
  email?: string | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  clan?: Clan | null,
  waa?: string | null,
  email: string,
  isAdmin?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export enum Clan {
  GANHADA = "GANHADA",
  LAXSGIIK = "LAXSGIIK",
  GITSBUTWADA = "GITSBUTWADA",
  LAXGIBU = "LAXGIBU",
}


export type Xbiis = {
  __typename: "Xbiis",
  id: string,
  name: string,
  waa?: string | null,
  owner: User,
  defaultRole?: AccessLevel | null,
  createdAt: string,
  updatedAt: string,
  xbiisOwnerId: string,
};

export enum AccessLevel {
  NONE = "NONE",
  READ = "READ",
  WRITE = "WRITE",
}


export type UpdateDocumentDetailsInput = {
  id: string,
  eng_title?: string | null,
  eng_description?: string | null,
  fileKey?: string | null,
  created?: string | null,
  updated?: string | null,
  type?: string | null,
  version?: number | null,
  bc_title?: string | null,
  bc_description?: string | null,
  ak_title?: string | null,
  ak_description?: string | null,
  documentDetailsAuthorId?: string | null,
  documentDetailsDocOwnerId?: string | null,
  documentDetailsBoxId?: string | null,
};

export type DeleteDocumentDetailsInput = {
  id: string,
};

export type CreateAuthorInput = {
  id?: string | null,
  name: string,
  clan?: Clan | null,
  waa?: string | null,
  email?: string | null,
};

export type ModelAuthorConditionInput = {
  name?: ModelStringInput | null,
  clan?: ModelClanInput | null,
  waa?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelAuthorConditionInput | null > | null,
  or?: Array< ModelAuthorConditionInput | null > | null,
  not?: ModelAuthorConditionInput | null,
};

export type ModelClanInput = {
  eq?: Clan | null,
  ne?: Clan | null,
};

export type UpdateAuthorInput = {
  id: string,
  name?: string | null,
  clan?: Clan | null,
  waa?: string | null,
  email?: string | null,
};

export type DeleteAuthorInput = {
  id: string,
};

export type CreateXbiisInput = {
  id?: string | null,
  name: string,
  waa?: string | null,
  defaultRole?: AccessLevel | null,
  xbiisOwnerId: string,
};

export type ModelXbiisConditionInput = {
  name?: ModelStringInput | null,
  waa?: ModelStringInput | null,
  defaultRole?: ModelAccessLevelInput | null,
  and?: Array< ModelXbiisConditionInput | null > | null,
  or?: Array< ModelXbiisConditionInput | null > | null,
  not?: ModelXbiisConditionInput | null,
  xbiisOwnerId?: ModelIDInput | null,
};

export type ModelAccessLevelInput = {
  eq?: AccessLevel | null,
  ne?: AccessLevel | null,
};

export type UpdateXbiisInput = {
  id: string,
  name?: string | null,
  waa?: string | null,
  defaultRole?: AccessLevel | null,
  xbiisOwnerId?: string | null,
};

export type DeleteXbiisInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  name: string,
  clan?: Clan | null,
  waa?: string | null,
  email: string,
  isAdmin?: boolean | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  clan?: ModelClanInput | null,
  waa?: ModelStringInput | null,
  email?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  clan?: Clan | null,
  waa?: string | null,
  email?: string | null,
  isAdmin?: boolean | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateBoxUserInput = {
  id?: string | null,
  role: AccessLevel,
  boxUserUserId: string,
  boxUserBoxId: string,
};

export type ModelBoxUserConditionInput = {
  role?: ModelAccessLevelInput | null,
  and?: Array< ModelBoxUserConditionInput | null > | null,
  or?: Array< ModelBoxUserConditionInput | null > | null,
  not?: ModelBoxUserConditionInput | null,
  boxUserUserId?: ModelIDInput | null,
  boxUserBoxId?: ModelIDInput | null,
};

export type BoxUser = {
  __typename: "BoxUser",
  id: string,
  user: User,
  box: Xbiis,
  role: AccessLevel,
  createdAt: string,
  updatedAt: string,
  boxUserUserId: string,
  boxUserBoxId: string,
};

export type UpdateBoxUserInput = {
  id: string,
  role?: AccessLevel | null,
  boxUserUserId?: string | null,
  boxUserBoxId?: string | null,
};

export type DeleteBoxUserInput = {
  id: string,
};

export type ModelDocumentDetailsFilterInput = {
  id?: ModelIDInput | null,
  eng_title?: ModelStringInput | null,
  eng_description?: ModelStringInput | null,
  fileKey?: ModelStringInput | null,
  created?: ModelStringInput | null,
  updated?: ModelStringInput | null,
  type?: ModelStringInput | null,
  version?: ModelFloatInput | null,
  bc_title?: ModelStringInput | null,
  bc_description?: ModelStringInput | null,
  ak_title?: ModelStringInput | null,
  ak_description?: ModelStringInput | null,
  and?: Array< ModelDocumentDetailsFilterInput | null > | null,
  or?: Array< ModelDocumentDetailsFilterInput | null > | null,
  not?: ModelDocumentDetailsFilterInput | null,
  documentDetailsAuthorId?: ModelIDInput | null,
  documentDetailsDocOwnerId?: ModelIDInput | null,
  documentDetailsBoxId?: ModelIDInput | null,
};

export type ModelDocumentDetailsConnection = {
  __typename: "ModelDocumentDetailsConnection",
  items:  Array<DocumentDetails | null >,
  nextToken?: string | null,
};

export type SearchableDocumentDetailsFilterInput = {
  id?: SearchableIDFilterInput | null,
  eng_title?: SearchableStringFilterInput | null,
  eng_description?: SearchableStringFilterInput | null,
  fileKey?: SearchableStringFilterInput | null,
  created?: SearchableStringFilterInput | null,
  updated?: SearchableStringFilterInput | null,
  type?: SearchableStringFilterInput | null,
  version?: SearchableFloatFilterInput | null,
  bc_title?: SearchableStringFilterInput | null,
  bc_description?: SearchableStringFilterInput | null,
  ak_title?: SearchableStringFilterInput | null,
  ak_description?: SearchableStringFilterInput | null,
  createdAt?: SearchableStringFilterInput | null,
  updatedAt?: SearchableStringFilterInput | null,
  documentDetailsAuthorId?: SearchableIDFilterInput | null,
  documentDetailsDocOwnerId?: SearchableIDFilterInput | null,
  documentDetailsBoxId?: SearchableIDFilterInput | null,
  and?: Array< SearchableDocumentDetailsFilterInput | null > | null,
  or?: Array< SearchableDocumentDetailsFilterInput | null > | null,
  not?: SearchableDocumentDetailsFilterInput | null,
};

export type SearchableIDFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
  range?: Array< string | null > | null,
};

export type SearchableStringFilterInput = {
  ne?: string | null,
  gt?: string | null,
  lt?: string | null,
  gte?: string | null,
  lte?: string | null,
  eq?: string | null,
  match?: string | null,
  matchPhrase?: string | null,
  matchPhrasePrefix?: string | null,
  multiMatch?: string | null,
  exists?: boolean | null,
  wildcard?: string | null,
  regexp?: string | null,
  range?: Array< string | null > | null,
};

export type SearchableFloatFilterInput = {
  ne?: number | null,
  gt?: number | null,
  lt?: number | null,
  gte?: number | null,
  lte?: number | null,
  eq?: number | null,
  range?: Array< number | null > | null,
};

export type SearchableDocumentDetailsSortInput = {
  field?: SearchableDocumentDetailsSortableFields | null,
  direction?: SearchableSortDirection | null,
};

export enum SearchableDocumentDetailsSortableFields {
  id = "id",
  eng_title = "eng_title",
  eng_description = "eng_description",
  fileKey = "fileKey",
  created = "created",
  updated = "updated",
  type = "type",
  version = "version",
  bc_title = "bc_title",
  bc_description = "bc_description",
  ak_title = "ak_title",
  ak_description = "ak_description",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  documentDetailsAuthorId = "documentDetailsAuthorId",
  documentDetailsDocOwnerId = "documentDetailsDocOwnerId",
  documentDetailsBoxId = "documentDetailsBoxId",
}


export enum SearchableSortDirection {
  asc = "asc",
  desc = "desc",
}


export type SearchableDocumentDetailsAggregationInput = {
  name: string,
  type: SearchableAggregateType,
  field: SearchableDocumentDetailsAggregateField,
};

export enum SearchableAggregateType {
  terms = "terms",
  avg = "avg",
  min = "min",
  max = "max",
  sum = "sum",
}


export enum SearchableDocumentDetailsAggregateField {
  id = "id",
  eng_title = "eng_title",
  eng_description = "eng_description",
  fileKey = "fileKey",
  created = "created",
  updated = "updated",
  type = "type",
  version = "version",
  bc_title = "bc_title",
  bc_description = "bc_description",
  ak_title = "ak_title",
  ak_description = "ak_description",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  documentDetailsAuthorId = "documentDetailsAuthorId",
  documentDetailsDocOwnerId = "documentDetailsDocOwnerId",
  documentDetailsBoxId = "documentDetailsBoxId",
}


export type SearchableDocumentDetailsConnection = {
  __typename: "SearchableDocumentDetailsConnection",
  items:  Array<DocumentDetails | null >,
  nextToken?: string | null,
  total?: number | null,
  aggregateItems:  Array<SearchableAggregateResult | null >,
};

export type SearchableAggregateResult = {
  __typename: "SearchableAggregateResult",
  name: string,
  result?: SearchableAggregateGenericResult | null,
};

export type SearchableAggregateGenericResult = SearchableAggregateScalarResult | SearchableAggregateBucketResult


export type SearchableAggregateScalarResult = {
  __typename: "SearchableAggregateScalarResult",
  value: number,
};

export type SearchableAggregateBucketResult = {
  __typename: "SearchableAggregateBucketResult",
  buckets?:  Array<SearchableAggregateBucketResultItem | null > | null,
};

export type SearchableAggregateBucketResultItem = {
  __typename: "SearchableAggregateBucketResultItem",
  key: string,
  doc_count: number,
};

export type ModelAuthorFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  clan?: ModelClanInput | null,
  waa?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelAuthorFilterInput | null > | null,
  or?: Array< ModelAuthorFilterInput | null > | null,
  not?: ModelAuthorFilterInput | null,
};

export type ModelAuthorConnection = {
  __typename: "ModelAuthorConnection",
  items:  Array<Author | null >,
  nextToken?: string | null,
};

export type ModelXbiisFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  waa?: ModelStringInput | null,
  defaultRole?: ModelAccessLevelInput | null,
  and?: Array< ModelXbiisFilterInput | null > | null,
  or?: Array< ModelXbiisFilterInput | null > | null,
  not?: ModelXbiisFilterInput | null,
  xbiisOwnerId?: ModelIDInput | null,
};

export type ModelXbiisConnection = {
  __typename: "ModelXbiisConnection",
  items:  Array<Xbiis | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  clan?: ModelClanInput | null,
  waa?: ModelStringInput | null,
  email?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelBoxUserFilterInput = {
  id?: ModelIDInput | null,
  role?: ModelAccessLevelInput | null,
  and?: Array< ModelBoxUserFilterInput | null > | null,
  or?: Array< ModelBoxUserFilterInput | null > | null,
  not?: ModelBoxUserFilterInput | null,
  boxUserUserId?: ModelIDInput | null,
  boxUserBoxId?: ModelIDInput | null,
};

export type ModelBoxUserConnection = {
  __typename: "ModelBoxUserConnection",
  items:  Array<BoxUser | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionDocumentDetailsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  eng_title?: ModelSubscriptionStringInput | null,
  eng_description?: ModelSubscriptionStringInput | null,
  fileKey?: ModelSubscriptionStringInput | null,
  created?: ModelSubscriptionStringInput | null,
  updated?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  version?: ModelSubscriptionFloatInput | null,
  bc_title?: ModelSubscriptionStringInput | null,
  bc_description?: ModelSubscriptionStringInput | null,
  ak_title?: ModelSubscriptionStringInput | null,
  ak_description?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDocumentDetailsFilterInput | null > | null,
  or?: Array< ModelSubscriptionDocumentDetailsFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionAuthorFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  clan?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAuthorFilterInput | null > | null,
  or?: Array< ModelSubscriptionAuthorFilterInput | null > | null,
};

export type ModelSubscriptionXbiisFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
  defaultRole?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
  or?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  clan?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  isAdmin?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionBoxUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  role?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBoxUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionBoxUserFilterInput | null > | null,
};

export type CreateDocumentDetailsMutationVariables = {
  input: CreateDocumentDetailsInput,
  condition?: ModelDocumentDetailsConditionInput | null,
};

export type CreateDocumentDetailsMutation = {
  createDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
  } | null,
};

export type UpdateDocumentDetailsMutationVariables = {
  input: UpdateDocumentDetailsInput,
  condition?: ModelDocumentDetailsConditionInput | null,
};

export type UpdateDocumentDetailsMutation = {
  updateDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
  } | null,
};

export type DeleteDocumentDetailsMutationVariables = {
  input: DeleteDocumentDetailsInput,
  condition?: ModelDocumentDetailsConditionInput | null,
};

export type DeleteDocumentDetailsMutation = {
  deleteDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
  } | null,
};

export type CreateAuthorMutationVariables = {
  input: CreateAuthorInput,
  condition?: ModelAuthorConditionInput | null,
};

export type CreateAuthorMutation = {
  createAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAuthorMutationVariables = {
  input: UpdateAuthorInput,
  condition?: ModelAuthorConditionInput | null,
};

export type UpdateAuthorMutation = {
  updateAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAuthorMutationVariables = {
  input: DeleteAuthorInput,
  condition?: ModelAuthorConditionInput | null,
};

export type DeleteAuthorMutation = {
  deleteAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateXbiisMutationVariables = {
  input: CreateXbiisInput,
  condition?: ModelXbiisConditionInput | null,
};

export type CreateXbiisMutation = {
  createXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
  } | null,
};

export type UpdateXbiisMutationVariables = {
  input: UpdateXbiisInput,
  condition?: ModelXbiisConditionInput | null,
};

export type UpdateXbiisMutation = {
  updateXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
  } | null,
};

export type DeleteXbiisMutationVariables = {
  input: DeleteXbiisInput,
  condition?: ModelXbiisConditionInput | null,
};

export type DeleteXbiisMutation = {
  deleteXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateBoxUserMutationVariables = {
  input: CreateBoxUserInput,
  condition?: ModelBoxUserConditionInput | null,
};

export type CreateBoxUserMutation = {
  createBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
  } | null,
};

export type UpdateBoxUserMutationVariables = {
  input: UpdateBoxUserInput,
  condition?: ModelBoxUserConditionInput | null,
};

export type UpdateBoxUserMutation = {
  updateBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
  } | null,
};

export type DeleteBoxUserMutationVariables = {
  input: DeleteBoxUserInput,
  condition?: ModelBoxUserConditionInput | null,
};

export type DeleteBoxUserMutation = {
  deleteBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
  } | null,
};

export type GetDocumentDetailsQueryVariables = {
  id: string,
};

export type GetDocumentDetailsQuery = {
  getDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
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
      id: string,
      eng_title: string,
      eng_description: string,
      author:  {
        __typename: "Author",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email?: string | null,
        createdAt: string,
        updatedAt: string,
      },
      docOwner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      fileKey: string,
      created: string,
      updated?: string | null,
      type?: string | null,
      version: number,
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        waa?: string | null,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      bc_title: string,
      bc_description: string,
      ak_title: string,
      ak_description: string,
      createdAt: string,
      updatedAt: string,
      documentDetailsAuthorId: string,
      documentDetailsDocOwnerId: string,
      documentDetailsBoxId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SearchDocumentDetailsQueryVariables = {
  filter?: SearchableDocumentDetailsFilterInput | null,
  sort?: Array< SearchableDocumentDetailsSortInput | null > | null,
  limit?: number | null,
  nextToken?: string | null,
  from?: number | null,
  aggregates?: Array< SearchableDocumentDetailsAggregationInput | null > | null,
};

export type SearchDocumentDetailsQuery = {
  searchDocumentDetails?:  {
    __typename: "SearchableDocumentDetailsConnection",
    items:  Array< {
      __typename: "DocumentDetails",
      id: string,
      eng_title: string,
      eng_description: string,
      author:  {
        __typename: "Author",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email?: string | null,
        createdAt: string,
        updatedAt: string,
      },
      docOwner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      fileKey: string,
      created: string,
      updated?: string | null,
      type?: string | null,
      version: number,
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        waa?: string | null,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      bc_title: string,
      bc_description: string,
      ak_title: string,
      ak_description: string,
      createdAt: string,
      updatedAt: string,
      documentDetailsAuthorId: string,
      documentDetailsDocOwnerId: string,
      documentDetailsBoxId: string,
    } | null >,
    nextToken?: string | null,
    total?: number | null,
    aggregateItems:  Array< {
      __typename: "SearchableAggregateResult",
      name: string,
      result: ( {
          __typename: "SearchableAggregateScalarResult",
          value: number,
        } | {
          __typename: "SearchableAggregateBucketResult",
          buckets?:  Array< {
            __typename: string,
            key: string,
            doc_count: number,
          } | null > | null,
        }
      ) | null,
    } | null >,
  } | null,
};

export type GetAuthorQueryVariables = {
  id: string,
};

export type GetAuthorQuery = {
  getAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
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
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetXbiisQueryVariables = {
  id: string,
};

export type GetXbiisQuery = {
  getXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
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
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
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
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetBoxUserQueryVariables = {
  id: string,
};

export type GetBoxUserQuery = {
  getBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
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
      id: string,
      user:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        waa?: string | null,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      createdAt: string,
      updatedAt: string,
      boxUserUserId: string,
      boxUserBoxId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
};

export type OnCreateDocumentDetailsSubscription = {
  onCreateDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
  } | null,
};

export type OnUpdateDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
};

export type OnUpdateDocumentDetailsSubscription = {
  onUpdateDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
  } | null,
};

export type OnDeleteDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
};

export type OnDeleteDocumentDetailsSubscription = {
  onDeleteDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Author",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    },
    docOwner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    fileKey: string,
    created: string,
    updated?: string | null,
    type?: string | null,
    version: number,
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    bc_title: string,
    bc_description: string,
    ak_title: string,
    ak_description: string,
    createdAt: string,
    updatedAt: string,
    documentDetailsAuthorId: string,
    documentDetailsDocOwnerId: string,
    documentDetailsBoxId: string,
  } | null,
};

export type OnCreateAuthorSubscriptionVariables = {
  filter?: ModelSubscriptionAuthorFilterInput | null,
};

export type OnCreateAuthorSubscription = {
  onCreateAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAuthorSubscriptionVariables = {
  filter?: ModelSubscriptionAuthorFilterInput | null,
};

export type OnUpdateAuthorSubscription = {
  onUpdateAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAuthorSubscriptionVariables = {
  filter?: ModelSubscriptionAuthorFilterInput | null,
};

export type OnDeleteAuthorSubscription = {
  onDeleteAuthor?:  {
    __typename: "Author",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateXbiisSubscriptionVariables = {
  filter?: ModelSubscriptionXbiisFilterInput | null,
};

export type OnCreateXbiisSubscription = {
  onCreateXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
  } | null,
};

export type OnUpdateXbiisSubscriptionVariables = {
  filter?: ModelSubscriptionXbiisFilterInput | null,
};

export type OnUpdateXbiisSubscription = {
  onUpdateXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
  } | null,
};

export type OnDeleteXbiisSubscriptionVariables = {
  filter?: ModelSubscriptionXbiisFilterInput | null,
};

export type OnDeleteXbiisSubscription = {
  onDeleteXbiis?:  {
    __typename: "Xbiis",
    id: string,
    name: string,
    waa?: string | null,
    owner:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    defaultRole?: AccessLevel | null,
    createdAt: string,
    updatedAt: string,
    xbiisOwnerId: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    clan?: Clan | null,
    waa?: string | null,
    email: string,
    isAdmin?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBoxUserSubscriptionVariables = {
  filter?: ModelSubscriptionBoxUserFilterInput | null,
};

export type OnCreateBoxUserSubscription = {
  onCreateBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
  } | null,
};

export type OnUpdateBoxUserSubscriptionVariables = {
  filter?: ModelSubscriptionBoxUserFilterInput | null,
};

export type OnUpdateBoxUserSubscription = {
  onUpdateBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
  } | null,
};

export type OnDeleteBoxUserSubscriptionVariables = {
  filter?: ModelSubscriptionBoxUserFilterInput | null,
};

export type OnDeleteBoxUserSubscription = {
  onDeleteBoxUser?:  {
    __typename: "BoxUser",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      clan?: Clan | null,
      waa?: string | null,
      email: string,
      isAdmin?: boolean | null,
      createdAt: string,
      updatedAt: string,
    },
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
      waa?: string | null,
      owner:  {
        __typename: "User",
        id: string,
        name: string,
        clan?: Clan | null,
        waa?: string | null,
        email: string,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
      },
      defaultRole?: AccessLevel | null,
      createdAt: string,
      updatedAt: string,
      xbiisOwnerId: string,
    },
    role: AccessLevel,
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxId: string,
  } | null,
};
