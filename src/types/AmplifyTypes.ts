/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateLangFieldsInput = {
  title: string,
  description: string,
  id?: string | null,
};

export type ModelLangFieldsConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelLangFieldsConditionInput | null > | null,
  or?: Array< ModelLangFieldsConditionInput | null > | null,
  not?: ModelLangFieldsConditionInput | null,
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

export type LangFields = {
  __typename: "LangFields",
  title: string,
  description: string,
  id: string,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateLangFieldsInput = {
  title?: string | null,
  description?: string | null,
  id: string,
};

export type DeleteLangFieldsInput = {
  id: string,
};

export type CreateDocumentDetailsInput = {
  id?: string | null,
  title: string,
  description: string,
  filePath: string,
  created: string,
  updated?: string | null,
  type?: string | null,
  version: number,
};

export type ModelDocumentDetailsConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  filePath?: ModelStringInput | null,
  created?: ModelStringInput | null,
  updated?: ModelStringInput | null,
  type?: ModelStringInput | null,
  version?: ModelFloatInput | null,
  and?: Array< ModelDocumentDetailsConditionInput | null > | null,
  or?: Array< ModelDocumentDetailsConditionInput | null > | null,
  not?: ModelDocumentDetailsConditionInput | null,
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

export type DocumentDetails = {
  __typename: "DocumentDetails",
  id: string,
  title: string,
  description: string,
  authorId: Gyet,
  ownerId: Gyet,
  filePath: string,
  created: string,
  updated?: string | null,
  type?: string | null,
  version: number,
  box: Xbiis,
  bc: LangFields,
  ak: LangFields,
  createdAt: string,
  updatedAt: string,
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
  role: RoleType,
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
  defaultRole?: RoleType | null,
  createdAt: string,
  updatedAt: string,
};

export type RoleType = {
  __typename: "RoleType",
  name: string,
  read: boolean,
  write: boolean,
  createdAt: string,
  updatedAt: string,
};

export type UpdateDocumentDetailsInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  filePath?: string | null,
  created?: string | null,
  updated?: string | null,
  type?: string | null,
  version?: number | null,
};

export type DeleteDocumentDetailsInput = {
  id: string,
};

export type CreateRoleTypeInput = {
  name: string,
  read: boolean,
  write: boolean,
};

export type ModelRoleTypeConditionInput = {
  read?: ModelBooleanInput | null,
  write?: ModelBooleanInput | null,
  and?: Array< ModelRoleTypeConditionInput | null > | null,
  or?: Array< ModelRoleTypeConditionInput | null > | null,
  not?: ModelRoleTypeConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateRoleTypeInput = {
  name: string,
  read?: boolean | null,
  write?: boolean | null,
};

export type DeleteRoleTypeInput = {
  name: string,
};

export type CreateXbiisInput = {
  id?: string | null,
  name: string,
};

export type ModelXbiisConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelXbiisConditionInput | null > | null,
  or?: Array< ModelXbiisConditionInput | null > | null,
  not?: ModelXbiisConditionInput | null,
};

export type UpdateXbiisInput = {
  id: string,
  name?: string | null,
};

export type DeleteXbiisInput = {
  id: string,
};

export type CreateBoxRoleInput = {
  id?: string | null,
  gyetBoxRolesId?: string | null,
};

export type ModelBoxRoleConditionInput = {
  and?: Array< ModelBoxRoleConditionInput | null > | null,
  or?: Array< ModelBoxRoleConditionInput | null > | null,
  not?: ModelBoxRoleConditionInput | null,
  gyetBoxRolesId?: ModelIDInput | null,
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

export type UpdateBoxRoleInput = {
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

export type ModelLangFieldsFilterInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelLangFieldsFilterInput | null > | null,
  or?: Array< ModelLangFieldsFilterInput | null > | null,
  not?: ModelLangFieldsFilterInput | null,
};

export type ModelLangFieldsConnection = {
  __typename: "ModelLangFieldsConnection",
  items:  Array<LangFields | null >,
  nextToken?: string | null,
};

export type ModelDocumentDetailsFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  filePath?: ModelStringInput | null,
  created?: ModelStringInput | null,
  updated?: ModelStringInput | null,
  type?: ModelStringInput | null,
  version?: ModelFloatInput | null,
  and?: Array< ModelDocumentDetailsFilterInput | null > | null,
  or?: Array< ModelDocumentDetailsFilterInput | null > | null,
  not?: ModelDocumentDetailsFilterInput | null,
};

export type ModelDocumentDetailsConnection = {
  __typename: "ModelDocumentDetailsConnection",
  items:  Array<DocumentDetails | null >,
  nextToken?: string | null,
};

export type ModelRoleTypeFilterInput = {
  name?: ModelStringInput | null,
  read?: ModelBooleanInput | null,
  write?: ModelBooleanInput | null,
  and?: Array< ModelRoleTypeFilterInput | null > | null,
  or?: Array< ModelRoleTypeFilterInput | null > | null,
  not?: ModelRoleTypeFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelRoleTypeConnection = {
  __typename: "ModelRoleTypeConnection",
  items:  Array<RoleType | null >,
  nextToken?: string | null,
};

export type ModelXbiisFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelXbiisFilterInput | null > | null,
  or?: Array< ModelXbiisFilterInput | null > | null,
  not?: ModelXbiisFilterInput | null,
};

export type ModelXbiisConnection = {
  __typename: "ModelXbiisConnection",
  items:  Array<Xbiis | null >,
  nextToken?: string | null,
};

export type ModelBoxRoleFilterInput = {
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

export type ModelSubscriptionLangFieldsFilterInput = {
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLangFieldsFilterInput | null > | null,
  or?: Array< ModelSubscriptionLangFieldsFilterInput | null > | null,
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

export type ModelSubscriptionDocumentDetailsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  filePath?: ModelSubscriptionStringInput | null,
  created?: ModelSubscriptionStringInput | null,
  updated?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  version?: ModelSubscriptionFloatInput | null,
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

export type ModelSubscriptionRoleTypeFilterInput = {
  name?: ModelSubscriptionStringInput | null,
  read?: ModelSubscriptionBooleanInput | null,
  write?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionRoleTypeFilterInput | null > | null,
  or?: Array< ModelSubscriptionRoleTypeFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionXbiisFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
  or?: Array< ModelSubscriptionXbiisFilterInput | null > | null,
};

export type ModelSubscriptionBoxRoleFilterInput = {
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

export type CreateLangFieldsMutationVariables = {
  input: CreateLangFieldsInput,
  condition?: ModelLangFieldsConditionInput | null,
};

export type CreateLangFieldsMutation = {
  createLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateLangFieldsMutationVariables = {
  input: UpdateLangFieldsInput,
  condition?: ModelLangFieldsConditionInput | null,
};

export type UpdateLangFieldsMutation = {
  updateLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteLangFieldsMutationVariables = {
  input: DeleteLangFieldsInput,
  condition?: ModelLangFieldsConditionInput | null,
};

export type DeleteLangFieldsMutation = {
  deleteLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateDocumentDetailsMutationVariables = {
  input: CreateDocumentDetailsInput,
  condition?: ModelDocumentDetailsConditionInput | null,
};

export type CreateDocumentDetailsMutation = {
  createDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
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
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
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
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateRoleTypeMutationVariables = {
  input: CreateRoleTypeInput,
  condition?: ModelRoleTypeConditionInput | null,
};

export type CreateRoleTypeMutation = {
  createRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRoleTypeMutationVariables = {
  input: UpdateRoleTypeInput,
  condition?: ModelRoleTypeConditionInput | null,
};

export type UpdateRoleTypeMutation = {
  updateRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteRoleTypeMutationVariables = {
  input: DeleteRoleTypeInput,
  condition?: ModelRoleTypeConditionInput | null,
};

export type DeleteRoleTypeMutation = {
  deleteRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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

export type GetLangFieldsQueryVariables = {
  id: string,
};

export type GetLangFieldsQuery = {
  getLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListLangFieldsQueryVariables = {
  filter?: ModelLangFieldsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLangFieldsQuery = {
  listLangFields?:  {
    __typename: "ModelLangFieldsConnection",
    items:  Array< {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDocumentDetailsQueryVariables = {
  id: string,
};

export type GetDocumentDetailsQuery = {
  getDocumentDetails?:  {
    __typename: "DocumentDetails",
    id: string,
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
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
      title: string,
      description: string,
      authorId:  {
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
      ownerId:  {
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
      filePath: string,
      created: string,
      updated?: string | null,
      type?: string | null,
      version: number,
      box:  {
        __typename: "Xbiis",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      },
      bc:  {
        __typename: "LangFields",
        title: string,
        description: string,
        id: string,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      },
      ak:  {
        __typename: "LangFields",
        title: string,
        description: string,
        id: string,
        createdAt: string,
        updatedAt: string,
        owner?: string | null,
      },
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetRoleTypeQueryVariables = {
  name: string,
};

export type GetRoleTypeQuery = {
  getRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListRoleTypesQueryVariables = {
  name?: string | null,
  filter?: ModelRoleTypeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListRoleTypesQuery = {
  listRoleTypes?:  {
    __typename: "ModelRoleTypeConnection",
    items:  Array< {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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
        createdAt: string,
        updatedAt: string,
      },
      role:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      },
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

export type OnCreateLangFieldsSubscriptionVariables = {
  filter?: ModelSubscriptionLangFieldsFilterInput | null,
  owner?: string | null,
};

export type OnCreateLangFieldsSubscription = {
  onCreateLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateLangFieldsSubscriptionVariables = {
  filter?: ModelSubscriptionLangFieldsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLangFieldsSubscription = {
  onUpdateLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteLangFieldsSubscriptionVariables = {
  filter?: ModelSubscriptionLangFieldsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLangFieldsSubscription = {
  onDeleteLangFields?:  {
    __typename: "LangFields",
    title: string,
    description: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
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
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
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
    title: string,
    description: string,
    authorId:  {
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
    ownerId:  {
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
    filePath: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    bc:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    ak:  {
      __typename: "LangFields",
      title: string,
      description: string,
      id: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateRoleTypeSubscriptionVariables = {
  filter?: ModelSubscriptionRoleTypeFilterInput | null,
};

export type OnCreateRoleTypeSubscription = {
  onCreateRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateRoleTypeSubscriptionVariables = {
  filter?: ModelSubscriptionRoleTypeFilterInput | null,
};

export type OnUpdateRoleTypeSubscription = {
  onUpdateRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteRoleTypeSubscriptionVariables = {
  filter?: ModelSubscriptionRoleTypeFilterInput | null,
};

export type OnDeleteRoleTypeSubscription = {
  onDeleteRoleType?:  {
    __typename: "RoleType",
    name: string,
    read: boolean,
    write: boolean,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
    defaultRole?:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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
      defaultRole?:  {
        __typename: "RoleType",
        name: string,
        read: boolean,
        write: boolean,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    },
    role:  {
      __typename: "RoleType",
      name: string,
      read: boolean,
      write: boolean,
      createdAt: string,
      updatedAt: string,
    },
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
