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
  author: Gyet,
  docOwner: Gyet,
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
  owner?: string | null,
};

export type Gyet = {
  __typename: "Gyet",
  id: string,
  name: string,
  email: string,
  clan?: ClanType | null,
  waa?: string | null,
  isAdmin?: boolean | null,
  boxRoles?: ModelBoxRoleConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ClanType = {
  __typename: "ClanType",
  name: string,
  smalgyax: string,
  createdAt: string,
  updatedAt: string,
};

export type ModelBoxRoleConnection = {
  __typename: "ModelBoxRoleConnection",
  items:  Array<BoxRole | null >,
  nextToken?: string | null,
};

export type BoxRole = {
  __typename: "BoxRole",
  box: Xbiis,
  role: AccessLevel,
  id: string,
  createdAt: string,
  updatedAt: string,
  gyetBoxRolesId?: string | null,
};

export type Xbiis = {
  __typename: "Xbiis",
  id: string,
  name: string,
  owner: Gyet,
  defaultRole?: AccessLevel | null,
  createdAt: string,
  updatedAt: string,
  xbiisOwnerId: string,
};

export enum AccessLevel {
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
  gyetBoxRolesId?: string | null,
};

export type ModelBoxRoleConditionInput = {
  role?: ModelAccessLevelInput | null,
  and?: Array< ModelBoxRoleConditionInput | null > | null,
  or?: Array< ModelBoxRoleConditionInput | null > | null,
  not?: ModelBoxRoleConditionInput | null,
  gyetBoxRolesId?: ModelIDInput | null,
};

export type UpdateBoxRoleInput = {
  role?: AccessLevel | null,
  id: string,
  gyetBoxRolesId?: string | null,
};

export type DeleteBoxRoleInput = {
  id: string,
};

export type CreateClanTypeInput = {
  name: string,
  smalgyax: string,
};

export type ModelClanTypeConditionInput = {
  smalgyax?: ModelStringInput | null,
  and?: Array< ModelClanTypeConditionInput | null > | null,
  or?: Array< ModelClanTypeConditionInput | null > | null,
  not?: ModelClanTypeConditionInput | null,
};

export type UpdateClanTypeInput = {
  name: string,
  smalgyax?: string | null,
};

export type DeleteClanTypeInput = {
  name: string,
};

export type CreateGyetInput = {
  id?: string | null,
  name: string,
  email: string,
  waa?: string | null,
  isAdmin?: boolean | null,
};

export type ModelGyetConditionInput = {
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  waa?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  and?: Array< ModelGyetConditionInput | null > | null,
  or?: Array< ModelGyetConditionInput | null > | null,
  not?: ModelGyetConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateGyetInput = {
  id: string,
  name?: string | null,
  email?: string | null,
  waa?: string | null,
  isAdmin?: boolean | null,
};

export type DeleteGyetInput = {
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
  gyetBoxRolesId?: ModelIDInput | null,
};

export type ModelClanTypeFilterInput = {
  name?: ModelStringInput | null,
  smalgyax?: ModelStringInput | null,
  and?: Array< ModelClanTypeFilterInput | null > | null,
  or?: Array< ModelClanTypeFilterInput | null > | null,
  not?: ModelClanTypeFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelClanTypeConnection = {
  __typename: "ModelClanTypeConnection",
  items:  Array<ClanType | null >,
  nextToken?: string | null,
};

export type ModelGyetFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  waa?: ModelStringInput | null,
  isAdmin?: ModelBooleanInput | null,
  and?: Array< ModelGyetFilterInput | null > | null,
  or?: Array< ModelGyetFilterInput | null > | null,
  not?: ModelGyetFilterInput | null,
};

export type ModelGyetConnection = {
  __typename: "ModelGyetConnection",
  items:  Array<Gyet | null >,
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

export type ModelSubscriptionClanTypeFilterInput = {
  name?: ModelSubscriptionStringInput | null,
  smalgyax?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionClanTypeFilterInput | null > | null,
  or?: Array< ModelSubscriptionClanTypeFilterInput | null > | null,
};

export type ModelSubscriptionGyetFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  waa?: ModelSubscriptionStringInput | null,
  isAdmin?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionGyetFilterInput | null > | null,
  or?: Array< ModelSubscriptionGyetFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
  } | null,
};

export type CreateClanTypeMutationVariables = {
  input: CreateClanTypeInput,
  condition?: ModelClanTypeConditionInput | null,
};

export type CreateClanTypeMutation = {
  createClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateClanTypeMutationVariables = {
  input: UpdateClanTypeInput,
  condition?: ModelClanTypeConditionInput | null,
};

export type UpdateClanTypeMutation = {
  updateClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteClanTypeMutationVariables = {
  input: DeleteClanTypeInput,
  condition?: ModelClanTypeConditionInput | null,
};

export type DeleteClanTypeMutation = {
  deleteClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGyetMutationVariables = {
  input: CreateGyetInput,
  condition?: ModelGyetConditionInput | null,
};

export type CreateGyetMutation = {
  createGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateGyetMutationVariables = {
  input: UpdateGyetInput,
  condition?: ModelGyetConditionInput | null,
};

export type UpdateGyetMutation = {
  updateGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteGyetMutationVariables = {
  input: DeleteGyetInput,
  condition?: ModelGyetConditionInput | null,
};

export type DeleteGyetMutation = {
  deleteGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      },
      docOwner:  {
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
      owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
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
      gyetBoxRolesId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetClanTypeQueryVariables = {
  name: string,
};

export type GetClanTypeQuery = {
  getClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListClanTypesQueryVariables = {
  name?: string | null,
  filter?: ModelClanTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListClanTypesQuery = {
  listClanTypes?:  {
    __typename: "ModelClanTypeConnection",
    items:  Array< {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ClanTypesBySmalgyaxQueryVariables = {
  smalgyax: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelClanTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ClanTypesBySmalgyaxQuery = {
  clanTypesBySmalgyax?:  {
    __typename: "ModelClanTypeConnection",
    items:  Array< {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGyetQueryVariables = {
  id: string,
};

export type GetGyetQuery = {
  getGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListGyetsQueryVariables = {
  filter?: ModelGyetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGyetsQuery = {
  listGyets?:  {
    __typename: "ModelGyetConnection",
    items:  Array< {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
  owner?: string | null,
};

export type OnCreateDocumentDetailsSubscription = {
  onCreateDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
  } | null,
};

export type OnUpdateDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDocumentDetailsSubscription = {
  onUpdateDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
  } | null,
};

export type OnDeleteDocumentDetailsSubscriptionVariables = {
  filter?: ModelSubscriptionDocumentDetailsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDocumentDetailsSubscription = {
  onDeleteDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    eng_title: string,
    eng_description: string,
    author:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    docOwner:  {
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      __typename: "Gyet",
      id: string,
      name: string,
      email: string,
      clan?:  {
        __typename: "ClanType",
        name: string,
        smalgyax: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      waa?: string | null,
      isAdmin?: boolean | null,
      boxRoles?:  {
        __typename: "ModelBoxRoleConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
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
        __typename: "Gyet",
        id: string,
        name: string,
        email: string,
        waa?: string | null,
        isAdmin?: boolean | null,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
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
    gyetBoxRolesId?: string | null,
  } | null,
};

export type OnCreateClanTypeSubscriptionVariables = {
  filter?: ModelSubscriptionClanTypeFilterInput | null,
};

export type OnCreateClanTypeSubscription = {
  onCreateClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateClanTypeSubscriptionVariables = {
  filter?: ModelSubscriptionClanTypeFilterInput | null,
};

export type OnUpdateClanTypeSubscription = {
  onUpdateClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteClanTypeSubscriptionVariables = {
  filter?: ModelSubscriptionClanTypeFilterInput | null,
};

export type OnDeleteClanTypeSubscription = {
  onDeleteClanType?:  {
    __typename: "ClanType",
    name: string,
    smalgyax: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGyetSubscriptionVariables = {
  filter?: ModelSubscriptionGyetFilterInput | null,
  owner?: string | null,
};

export type OnCreateGyetSubscription = {
  onCreateGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateGyetSubscriptionVariables = {
  filter?: ModelSubscriptionGyetFilterInput | null,
  owner?: string | null,
};

export type OnUpdateGyetSubscription = {
  onUpdateGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteGyetSubscriptionVariables = {
  filter?: ModelSubscriptionGyetFilterInput | null,
  owner?: string | null,
};

export type OnDeleteGyetSubscription = {
  onDeleteGyet?:  {
    __typename: "Gyet",
    id: string,
    name: string,
    email: string,
    clan?:  {
      __typename: "ClanType",
      name: string,
      smalgyax: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    waa?: string | null,
    isAdmin?: boolean | null,
    boxRoles?:  {
      __typename: "ModelBoxRoleConnection",
      items:  Array< {
        __typename: "BoxRole",
        role: AccessLevel,
        id: string,
        createdAt: string,
        updatedAt: string,
        gyetBoxRolesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
