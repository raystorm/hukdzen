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
  defaultRole?: AccessLevel | null,
  xbiisOwnerId: string,
};

export type ModelXbiisConditionInput = {
  name?: ModelStringInput | null,
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
  defaultRole?: AccessLevel | null,
  xbiisOwnerId?: string | null,
};

export type DeleteXbiisInput = {
  id: string,
};

export type CreateBoxRoleInput = {
  role: AccessLevel,
  id?: string | null,
  boxRoleBoxId: string,
};

export type ModelBoxRoleConditionInput = {
  role?: ModelAccessLevelInput | null,
  and?: Array< ModelBoxRoleConditionInput | null > | null,
  or?: Array< ModelBoxRoleConditionInput | null > | null,
  not?: ModelBoxRoleConditionInput | null,
  boxRoleBoxId?: ModelIDInput | null,
};

export type BoxRole = {
  __typename: "BoxRole",
  box: Xbiis,
  role: AccessLevel,
  id: string,
  createdAt: string,
  updatedAt: string,
  boxRoleBoxId: string,
};

export type UpdateBoxRoleInput = {
  role?: AccessLevel | null,
  id: string,
  boxRoleBoxId?: string | null,
};

export type DeleteBoxRoleInput = {
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
  boxUserUserId: string,
  boxUserBoxRoleId: string,
};

export type ModelBoxUserConditionInput = {
  and?: Array< ModelBoxUserConditionInput | null > | null,
  or?: Array< ModelBoxUserConditionInput | null > | null,
  not?: ModelBoxUserConditionInput | null,
  boxUserUserId?: ModelIDInput | null,
  boxUserBoxRoleId?: ModelIDInput | null,
};

export type BoxUser = {
  __typename: "BoxUser",
  id: string,
  user: User,
  boxRole: BoxRole,
  createdAt: string,
  updatedAt: string,
  boxUserUserId: string,
  boxUserBoxRoleId: string,
};

export type UpdateBoxUserInput = {
  id: string,
  boxUserUserId?: string | null,
  boxUserBoxRoleId?: string | null,
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

export type ModelBoxRoleFilterInput = {
  role?: ModelAccessLevelInput | null,
  and?: Array< ModelBoxRoleFilterInput | null > | null,
  or?: Array< ModelBoxRoleFilterInput | null > | null,
  not?: ModelBoxRoleFilterInput | null,
  boxRoleBoxId?: ModelIDInput | null,
};

export type ModelBoxRoleConnection = {
  __typename: "ModelBoxRoleConnection",
  items:  Array<BoxRole | null >,
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
  and?: Array< ModelBoxUserFilterInput | null > | null,
  or?: Array< ModelBoxUserFilterInput | null > | null,
  not?: ModelBoxUserFilterInput | null,
  boxUserUserId?: ModelIDInput | null,
  boxUserBoxRoleId?: ModelIDInput | null,
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
  defaultRole?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
  or?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
};

export type ModelSubscriptionBoxRoleFilterInput = {
  role?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBoxRoleFilterInput | null > | null,
  or?: Array< ModelSubscriptionBoxRoleFilterInput | null > | null,
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

export type CreateBoxRoleMutationVariables = {
  input: CreateBoxRoleInput,
  condition?: ModelBoxRoleConditionInput | null,
};

export type CreateBoxRoleMutation = {
  createBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
  } | null,
};

export type UpdateBoxRoleMutationVariables = {
  input: UpdateBoxRoleInput,
  condition?: ModelBoxRoleConditionInput | null,
};

export type UpdateBoxRoleMutation = {
  updateBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
  } | null,
};

export type DeleteBoxRoleMutationVariables = {
  input: DeleteBoxRoleInput,
  condition?: ModelBoxRoleConditionInput | null,
};

export type DeleteBoxRoleMutation = {
  deleteBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
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

export type GetBoxRoleQueryVariables = {
  id: string,
};

export type GetBoxRoleQuery = {
  getBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
  } | null,
};

export type ListBoxRolesQueryVariables = {
  filter?: ModelBoxRoleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBoxRolesQuery = {
  listBoxRoles?:  {
    __typename: "ModelBoxRoleConnection",
    items:  Array< {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
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
      boxRole:  {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        boxRoleBoxId: string,
      },
      createdAt: string,
      updatedAt: string,
      boxUserUserId: string,
      boxUserBoxRoleId: string,
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

export type OnCreateBoxRoleSubscriptionVariables = {
  filter?: ModelSubscriptionBoxRoleFilterInput | null,
};

export type OnCreateBoxRoleSubscription = {
  onCreateBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
  } | null,
};

export type OnUpdateBoxRoleSubscriptionVariables = {
  filter?: ModelSubscriptionBoxRoleFilterInput | null,
};

export type OnUpdateBoxRoleSubscription = {
  onUpdateBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
  } | null,
};

export type OnDeleteBoxRoleSubscriptionVariables = {
  filter?: ModelSubscriptionBoxRoleFilterInput | null,
};

export type OnDeleteBoxRoleSubscription = {
  onDeleteBoxRole?:  {
    __typename: "BoxRole",
    box:  {
      __typename: "Xbiis",
      id: string,
      name: string,
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
    id: string,
    createdAt: string,
    updatedAt: string,
    boxRoleBoxId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
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
    boxRole:  {
      __typename: "BoxRole",
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        defaultRole?: AccessLevel | null,
        createdAt: string,
        updatedAt: string,
        xbiisOwnerId: string,
      },
      role: AccessLevel,
      id: string,
      createdAt: string,
      updatedAt: string,
      boxRoleBoxId: string,
    },
    createdAt: string,
    updatedAt: string,
    boxUserUserId: string,
    boxUserBoxRoleId: string,
  } | null,
};
