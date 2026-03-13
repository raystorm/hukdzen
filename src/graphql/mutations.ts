/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const _ignore = /* GraphQL */ `mutation _ignore {
  _ignore
}
` as GeneratedMutation<
  APITypes._ignoreMutationVariables,
  APITypes._ignoreMutation
>;
export const createAuthor = /* GraphQL */ `mutation CreateAuthor(
  $condition: ModelAuthorConditionInput
  $input: CreateAuthorInput!
) {
  createAuthor(condition: $condition, input: $input) {
    clan
    createdAt
    email
    id
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAuthorMutationVariables,
  APITypes.CreateAuthorMutation
>;
export const createAuthorGuarded = /* GraphQL */ `mutation CreateAuthorGuarded($input: AuthorInput!) {
  createAuthorGuarded(input: $input) {
    clan
    createdAt
    email
    id
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAuthorGuardedMutationVariables,
  APITypes.CreateAuthorGuardedMutation
>;
export const createBoxRequest = /* GraphQL */ `mutation CreateBoxRequest(
  $condition: ModelBoxRequestConditionInput
  $input: CreateBoxRequestInput!
) {
  createBoxRequest(condition: $condition, input: $input) {
    approvedBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    boxRequestApprovedById
    boxRequestCreatedBoxId
    boxRequestCreatedById
    createdAt
    createdBox {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    createdBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    denialReason
    id
    requestReason
    requestedName
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBoxRequestMutationVariables,
  APITypes.CreateBoxRequestMutation
>;
export const createBoxRequestGuarded = /* GraphQL */ `mutation CreateBoxRequestGuarded($input: BoxRequestInput!) {
  createBoxRequestGuarded(input: $input) {
    approvedBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    boxRequestApprovedById
    boxRequestCreatedBoxId
    boxRequestCreatedById
    createdAt
    createdBox {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    createdBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    denialReason
    id
    requestReason
    requestedName
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBoxRequestGuardedMutationVariables,
  APITypes.CreateBoxRequestGuardedMutation
>;
export const createBoxUser = /* GraphQL */ `mutation CreateBoxUser(
  $condition: ModelBoxUserConditionInput
  $input: CreateBoxUserInput!
) {
  createBoxUser(condition: $condition, input: $input) {
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    boxUserBoxId
    boxUserUserId
    createdAt
    id
    role
    updatedAt
    user {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    userUserId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBoxUserMutationVariables,
  APITypes.CreateBoxUserMutation
>;
export const createBoxUserGuarded = /* GraphQL */ `mutation CreateBoxUserGuarded($input: BoxUserInput!) {
  createBoxUserGuarded(input: $input) {
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    boxUserBoxId
    boxUserUserId
    createdAt
    id
    role
    updatedAt
    user {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    userUserId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBoxUserGuardedMutationVariables,
  APITypes.CreateBoxUserGuardedMutation
>;
export const createCollection = /* GraphQL */ `mutation CreateCollection(
  $condition: ModelCollectionConditionInput
  $input: CreateCollectionInput!
) {
  createCollection(condition: $condition, input: $input) {
    ak_description
    ak_title
    bc_description
    bc_title
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    collectionBoxId
    collectionCollectionOwnerId
    collectionOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    eng_description
    eng_title
    id
    items {
      items {
        childCollection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collectionCollectionId
        collectionItemChildCollectionId
        collectionItemDocumentId
        collectionItemsId
        created
        createdAt
        document {
          created
          createdAt
          documentAuthorId
          documentBoxId
          documentBoxXbiisId
          documentContentOwnerId
          documentContentOwnerUserId
          fileHash
          fileKey
          id
          keywords
          type
          updated
          updatedAt
          version
          __typename
        }
        id
        order
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    updated
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCollectionMutationVariables,
  APITypes.CreateCollectionMutation
>;
export const createCollectionGuarded = /* GraphQL */ `mutation CreateCollectionGuarded($input: CollectionInput!) {
  createCollectionGuarded(input: $input) {
    ak_description
    ak_title
    bc_description
    bc_title
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    collectionBoxId
    collectionCollectionOwnerId
    collectionOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    eng_description
    eng_title
    id
    items {
      items {
        childCollection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collectionCollectionId
        collectionItemChildCollectionId
        collectionItemDocumentId
        collectionItemsId
        created
        createdAt
        document {
          created
          createdAt
          documentAuthorId
          documentBoxId
          documentBoxXbiisId
          documentContentOwnerId
          documentContentOwnerUserId
          fileHash
          fileKey
          id
          keywords
          type
          updated
          updatedAt
          version
          __typename
        }
        id
        order
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    updated
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCollectionGuardedMutationVariables,
  APITypes.CreateCollectionGuardedMutation
>;
export const createCollectionItem = /* GraphQL */ `mutation CreateCollectionItem(
  $condition: ModelCollectionItemConditionInput
  $input: CreateCollectionItemInput!
) {
  createCollectionItem(condition: $condition, input: $input) {
    childCollection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collectionCollectionId
    collectionItemChildCollectionId
    collectionItemDocumentId
    collectionItemsId
    created
    createdAt
    document {
      ak {
        description
        title
        __typename
      }
      author {
        clan
        createdAt
        email
        id
        name
        updatedAt
        waa
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      contentOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      documentAuthorId
      documentBoxId
      documentBoxXbiisId
      documentContentOwnerId
      documentContentOwnerUserId
      eng {
        description
        title
        __typename
      }
      fileHash
      fileKey
      id
      keywords
      type
      updated
      updatedAt
      version
      __typename
    }
    id
    order
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCollectionItemMutationVariables,
  APITypes.CreateCollectionItemMutation
>;
export const createCollectionItemGuarded = /* GraphQL */ `mutation CreateCollectionItemGuarded($input: CollectionItemInput!) {
  createCollectionItemGuarded(input: $input) {
    childCollection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collectionCollectionId
    collectionItemChildCollectionId
    collectionItemDocumentId
    collectionItemsId
    created
    createdAt
    document {
      ak {
        description
        title
        __typename
      }
      author {
        clan
        createdAt
        email
        id
        name
        updatedAt
        waa
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      contentOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      documentAuthorId
      documentBoxId
      documentBoxXbiisId
      documentContentOwnerId
      documentContentOwnerUserId
      eng {
        description
        title
        __typename
      }
      fileHash
      fileKey
      id
      keywords
      type
      updated
      updatedAt
      version
      __typename
    }
    id
    order
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCollectionItemGuardedMutationVariables,
  APITypes.CreateCollectionItemGuardedMutation
>;
export const createDocument = /* GraphQL */ `mutation CreateDocument(
  $condition: ModelDocumentConditionInput
  $input: CreateDocumentInput!
) {
  createDocument(condition: $condition, input: $input) {
    ak {
      description
      title
      __typename
    }
    author {
      clan
      createdAt
      email
      id
      name
      updatedAt
      waa
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    contentOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    documentAuthorId
    documentBoxId
    documentBoxXbiisId
    documentContentOwnerId
    documentContentOwnerUserId
    eng {
      description
      title
      __typename
    }
    fileHash
    fileKey
    id
    keywords
    type
    updated
    updatedAt
    version
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDocumentMutationVariables,
  APITypes.CreateDocumentMutation
>;
export const createDocumentGuarded = /* GraphQL */ `mutation CreateDocumentGuarded($input: DocumentInput!) {
  createDocumentGuarded(input: $input) {
    ak {
      description
      title
      __typename
    }
    author {
      clan
      createdAt
      email
      id
      name
      updatedAt
      waa
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    contentOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    documentAuthorId
    documentBoxId
    documentBoxXbiisId
    documentContentOwnerId
    documentContentOwnerUserId
    eng {
      description
      title
      __typename
    }
    fileHash
    fileKey
    id
    keywords
    type
    updated
    updatedAt
    version
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDocumentGuardedMutationVariables,
  APITypes.CreateDocumentGuardedMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
    clan
    createdAt
    email
    emailPreferences {
      allOptOut
      boxRequestOptOut
      collaboratorOptOut
      optOutAt
      optOutReason
      softBounceCount
      systemOptOut
      __typename
    }
    id
    isAdmin
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const createUserGuarded = /* GraphQL */ `mutation CreateUserGuarded($input: UserInput!) {
  createUserGuarded(input: $input) {
    clan
    createdAt
    email
    emailPreferences {
      allOptOut
      boxRequestOptOut
      collaboratorOptOut
      optOutAt
      optOutReason
      softBounceCount
      systemOptOut
      __typename
    }
    id
    isAdmin
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserGuardedMutationVariables,
  APITypes.CreateUserGuardedMutation
>;
export const createXbiis = /* GraphQL */ `mutation CreateXbiis(
  $condition: ModelXbiisConditionInput
  $input: CreateXbiisInput!
) {
  createXbiis(condition: $condition, input: $input) {
    createdAt
    defaultRole
    id
    name
    owner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    ownerUserId
    purpose
    updatedAt
    waa
    xbiisOwnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateXbiisMutationVariables,
  APITypes.CreateXbiisMutation
>;
export const createXbiisGuarded = /* GraphQL */ `mutation CreateXbiisGuarded($input: XbiisInput!) {
  createXbiisGuarded(input: $input) {
    createdAt
    defaultRole
    id
    name
    owner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    ownerUserId
    purpose
    updatedAt
    waa
    xbiisOwnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateXbiisGuardedMutationVariables,
  APITypes.CreateXbiisGuardedMutation
>;
export const deleteAuthor = /* GraphQL */ `mutation DeleteAuthor(
  $condition: ModelAuthorConditionInput
  $input: DeleteAuthorInput!
) {
  deleteAuthor(condition: $condition, input: $input) {
    clan
    createdAt
    email
    id
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAuthorMutationVariables,
  APITypes.DeleteAuthorMutation
>;
export const deleteBoxRequest = /* GraphQL */ `mutation DeleteBoxRequest(
  $condition: ModelBoxRequestConditionInput
  $input: DeleteBoxRequestInput!
) {
  deleteBoxRequest(condition: $condition, input: $input) {
    approvedBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    boxRequestApprovedById
    boxRequestCreatedBoxId
    boxRequestCreatedById
    createdAt
    createdBox {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    createdBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    denialReason
    id
    requestReason
    requestedName
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBoxRequestMutationVariables,
  APITypes.DeleteBoxRequestMutation
>;
export const deleteBoxUser = /* GraphQL */ `mutation DeleteBoxUser(
  $condition: ModelBoxUserConditionInput
  $input: DeleteBoxUserInput!
) {
  deleteBoxUser(condition: $condition, input: $input) {
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    boxUserBoxId
    boxUserUserId
    createdAt
    id
    role
    updatedAt
    user {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    userUserId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBoxUserMutationVariables,
  APITypes.DeleteBoxUserMutation
>;
export const deleteCollection = /* GraphQL */ `mutation DeleteCollection(
  $condition: ModelCollectionConditionInput
  $input: DeleteCollectionInput!
) {
  deleteCollection(condition: $condition, input: $input) {
    ak_description
    ak_title
    bc_description
    bc_title
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    collectionBoxId
    collectionCollectionOwnerId
    collectionOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    eng_description
    eng_title
    id
    items {
      items {
        childCollection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collectionCollectionId
        collectionItemChildCollectionId
        collectionItemDocumentId
        collectionItemsId
        created
        createdAt
        document {
          created
          createdAt
          documentAuthorId
          documentBoxId
          documentBoxXbiisId
          documentContentOwnerId
          documentContentOwnerUserId
          fileHash
          fileKey
          id
          keywords
          type
          updated
          updatedAt
          version
          __typename
        }
        id
        order
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    updated
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCollectionMutationVariables,
  APITypes.DeleteCollectionMutation
>;
export const deleteCollectionItem = /* GraphQL */ `mutation DeleteCollectionItem(
  $condition: ModelCollectionItemConditionInput
  $input: DeleteCollectionItemInput!
) {
  deleteCollectionItem(condition: $condition, input: $input) {
    childCollection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collectionCollectionId
    collectionItemChildCollectionId
    collectionItemDocumentId
    collectionItemsId
    created
    createdAt
    document {
      ak {
        description
        title
        __typename
      }
      author {
        clan
        createdAt
        email
        id
        name
        updatedAt
        waa
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      contentOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      documentAuthorId
      documentBoxId
      documentBoxXbiisId
      documentContentOwnerId
      documentContentOwnerUserId
      eng {
        description
        title
        __typename
      }
      fileHash
      fileKey
      id
      keywords
      type
      updated
      updatedAt
      version
      __typename
    }
    id
    order
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCollectionItemMutationVariables,
  APITypes.DeleteCollectionItemMutation
>;
export const deleteDocument = /* GraphQL */ `mutation DeleteDocument(
  $condition: ModelDocumentConditionInput
  $input: DeleteDocumentInput!
) {
  deleteDocument(condition: $condition, input: $input) {
    ak {
      description
      title
      __typename
    }
    author {
      clan
      createdAt
      email
      id
      name
      updatedAt
      waa
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    contentOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    documentAuthorId
    documentBoxId
    documentBoxXbiisId
    documentContentOwnerId
    documentContentOwnerUserId
    eng {
      description
      title
      __typename
    }
    fileHash
    fileKey
    id
    keywords
    type
    updated
    updatedAt
    version
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteDocumentMutationVariables,
  APITypes.DeleteDocumentMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
    clan
    createdAt
    email
    emailPreferences {
      allOptOut
      boxRequestOptOut
      collaboratorOptOut
      optOutAt
      optOutReason
      softBounceCount
      systemOptOut
      __typename
    }
    id
    isAdmin
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const deleteXbiis = /* GraphQL */ `mutation DeleteXbiis(
  $condition: ModelXbiisConditionInput
  $input: DeleteXbiisInput!
) {
  deleteXbiis(condition: $condition, input: $input) {
    createdAt
    defaultRole
    id
    name
    owner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    ownerUserId
    purpose
    updatedAt
    waa
    xbiisOwnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteXbiisMutationVariables,
  APITypes.DeleteXbiisMutation
>;
export const sendTemplatedEmail = /* GraphQL */ `mutation SendTemplatedEmail(
  $cc: [String]
  $globalParams: AWSJSON
  $templateArgs: AWSJSON!
  $templateName: String!
  $to: [String!]!
) {
  sendTemplatedEmail(
    cc: $cc
    globalParams: $globalParams
    templateArgs: $templateArgs
    templateName: $templateName
    to: $to
  )
}
` as GeneratedMutation<
  APITypes.SendTemplatedEmailMutationVariables,
  APITypes.SendTemplatedEmailMutation
>;
export const updateAuthor = /* GraphQL */ `mutation UpdateAuthor(
  $condition: ModelAuthorConditionInput
  $input: UpdateAuthorInput!
) {
  updateAuthor(condition: $condition, input: $input) {
    clan
    createdAt
    email
    id
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAuthorMutationVariables,
  APITypes.UpdateAuthorMutation
>;
export const updateAuthorGuarded = /* GraphQL */ `mutation UpdateAuthorGuarded($input: AuthorInput!) {
  updateAuthorGuarded(input: $input) {
    clan
    createdAt
    email
    id
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAuthorGuardedMutationVariables,
  APITypes.UpdateAuthorGuardedMutation
>;
export const updateBoxRequest = /* GraphQL */ `mutation UpdateBoxRequest(
  $condition: ModelBoxRequestConditionInput
  $input: UpdateBoxRequestInput!
) {
  updateBoxRequest(condition: $condition, input: $input) {
    approvedBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    boxRequestApprovedById
    boxRequestCreatedBoxId
    boxRequestCreatedById
    createdAt
    createdBox {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    createdBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    denialReason
    id
    requestReason
    requestedName
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBoxRequestMutationVariables,
  APITypes.UpdateBoxRequestMutation
>;
export const updateBoxRequestGuarded = /* GraphQL */ `mutation UpdateBoxRequestGuarded($input: BoxRequestInput!) {
  updateBoxRequestGuarded(input: $input) {
    approvedBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    boxRequestApprovedById
    boxRequestCreatedBoxId
    boxRequestCreatedById
    createdAt
    createdBox {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    createdBy {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    denialReason
    id
    requestReason
    requestedName
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBoxRequestGuardedMutationVariables,
  APITypes.UpdateBoxRequestGuardedMutation
>;
export const updateBoxUser = /* GraphQL */ `mutation UpdateBoxUser(
  $condition: ModelBoxUserConditionInput
  $input: UpdateBoxUserInput!
) {
  updateBoxUser(condition: $condition, input: $input) {
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    boxUserBoxId
    boxUserUserId
    createdAt
    id
    role
    updatedAt
    user {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    userUserId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBoxUserMutationVariables,
  APITypes.UpdateBoxUserMutation
>;
export const updateBoxUserGuarded = /* GraphQL */ `mutation UpdateBoxUserGuarded($input: BoxUserInput!) {
  updateBoxUserGuarded(input: $input) {
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    boxUserBoxId
    boxUserUserId
    createdAt
    id
    role
    updatedAt
    user {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    userUserId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBoxUserGuardedMutationVariables,
  APITypes.UpdateBoxUserGuardedMutation
>;
export const updateCollection = /* GraphQL */ `mutation UpdateCollection(
  $condition: ModelCollectionConditionInput
  $input: UpdateCollectionInput!
) {
  updateCollection(condition: $condition, input: $input) {
    ak_description
    ak_title
    bc_description
    bc_title
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    collectionBoxId
    collectionCollectionOwnerId
    collectionOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    eng_description
    eng_title
    id
    items {
      items {
        childCollection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collectionCollectionId
        collectionItemChildCollectionId
        collectionItemDocumentId
        collectionItemsId
        created
        createdAt
        document {
          created
          createdAt
          documentAuthorId
          documentBoxId
          documentBoxXbiisId
          documentContentOwnerId
          documentContentOwnerUserId
          fileHash
          fileKey
          id
          keywords
          type
          updated
          updatedAt
          version
          __typename
        }
        id
        order
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    updated
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCollectionMutationVariables,
  APITypes.UpdateCollectionMutation
>;
export const updateCollectionGuarded = /* GraphQL */ `mutation UpdateCollectionGuarded($input: CollectionInput!) {
  updateCollectionGuarded(input: $input) {
    ak_description
    ak_title
    bc_description
    bc_title
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    collectionBoxId
    collectionCollectionOwnerId
    collectionOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    eng_description
    eng_title
    id
    items {
      items {
        childCollection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collection {
          ak_description
          ak_title
          bc_description
          bc_title
          collectionBoxId
          collectionCollectionOwnerId
          created
          createdAt
          eng_description
          eng_title
          id
          updated
          updatedAt
          __typename
        }
        collectionCollectionId
        collectionItemChildCollectionId
        collectionItemDocumentId
        collectionItemsId
        created
        createdAt
        document {
          created
          createdAt
          documentAuthorId
          documentBoxId
          documentBoxXbiisId
          documentContentOwnerId
          documentContentOwnerUserId
          fileHash
          fileKey
          id
          keywords
          type
          updated
          updatedAt
          version
          __typename
        }
        id
        order
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    updated
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCollectionGuardedMutationVariables,
  APITypes.UpdateCollectionGuardedMutation
>;
export const updateCollectionItem = /* GraphQL */ `mutation UpdateCollectionItem(
  $condition: ModelCollectionItemConditionInput
  $input: UpdateCollectionItemInput!
) {
  updateCollectionItem(condition: $condition, input: $input) {
    childCollection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collectionCollectionId
    collectionItemChildCollectionId
    collectionItemDocumentId
    collectionItemsId
    created
    createdAt
    document {
      ak {
        description
        title
        __typename
      }
      author {
        clan
        createdAt
        email
        id
        name
        updatedAt
        waa
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      contentOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      documentAuthorId
      documentBoxId
      documentBoxXbiisId
      documentContentOwnerId
      documentContentOwnerUserId
      eng {
        description
        title
        __typename
      }
      fileHash
      fileKey
      id
      keywords
      type
      updated
      updatedAt
      version
      __typename
    }
    id
    order
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCollectionItemMutationVariables,
  APITypes.UpdateCollectionItemMutation
>;
export const updateCollectionItemGuarded = /* GraphQL */ `mutation UpdateCollectionItemGuarded($input: CollectionItemInput!) {
  updateCollectionItemGuarded(input: $input) {
    childCollection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collection {
      ak_description
      ak_title
      bc_description
      bc_title
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      collectionBoxId
      collectionCollectionOwnerId
      collectionOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      eng_description
      eng_title
      id
      items {
        items {
          collectionCollectionId
          collectionItemChildCollectionId
          collectionItemDocumentId
          collectionItemsId
          created
          createdAt
          id
          order
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      updated
      updatedAt
      __typename
    }
    collectionCollectionId
    collectionItemChildCollectionId
    collectionItemDocumentId
    collectionItemsId
    created
    createdAt
    document {
      ak {
        description
        title
        __typename
      }
      author {
        clan
        createdAt
        email
        id
        name
        updatedAt
        waa
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        createdAt
        defaultRole
        id
        name
        owner {
          clan
          createdAt
          email
          id
          isAdmin
          name
          updatedAt
          waa
          __typename
        }
        ownerUserId
        purpose
        updatedAt
        waa
        xbiisOwnerId
        __typename
      }
      contentOwner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      created
      createdAt
      documentAuthorId
      documentBoxId
      documentBoxXbiisId
      documentContentOwnerId
      documentContentOwnerUserId
      eng {
        description
        title
        __typename
      }
      fileHash
      fileKey
      id
      keywords
      type
      updated
      updatedAt
      version
      __typename
    }
    id
    order
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCollectionItemGuardedMutationVariables,
  APITypes.UpdateCollectionItemGuardedMutation
>;
export const updateDocument = /* GraphQL */ `mutation UpdateDocument(
  $condition: ModelDocumentConditionInput
  $input: UpdateDocumentInput!
) {
  updateDocument(condition: $condition, input: $input) {
    ak {
      description
      title
      __typename
    }
    author {
      clan
      createdAt
      email
      id
      name
      updatedAt
      waa
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    contentOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    documentAuthorId
    documentBoxId
    documentBoxXbiisId
    documentContentOwnerId
    documentContentOwnerUserId
    eng {
      description
      title
      __typename
    }
    fileHash
    fileKey
    id
    keywords
    type
    updated
    updatedAt
    version
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDocumentMutationVariables,
  APITypes.UpdateDocumentMutation
>;
export const updateDocumentGuarded = /* GraphQL */ `mutation UpdateDocumentGuarded($input: DocumentInput!) {
  updateDocumentGuarded(input: $input) {
    ak {
      description
      title
      __typename
    }
    author {
      clan
      createdAt
      email
      id
      name
      updatedAt
      waa
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      createdAt
      defaultRole
      id
      name
      owner {
        clan
        createdAt
        email
        emailPreferences {
          allOptOut
          boxRequestOptOut
          collaboratorOptOut
          optOutAt
          optOutReason
          softBounceCount
          systemOptOut
          __typename
        }
        id
        isAdmin
        name
        updatedAt
        waa
        __typename
      }
      ownerUserId
      purpose
      updatedAt
      waa
      xbiisOwnerId
      __typename
    }
    contentOwner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    created
    createdAt
    documentAuthorId
    documentBoxId
    documentBoxXbiisId
    documentContentOwnerId
    documentContentOwnerUserId
    eng {
      description
      title
      __typename
    }
    fileHash
    fileKey
    id
    keywords
    type
    updated
    updatedAt
    version
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDocumentGuardedMutationVariables,
  APITypes.UpdateDocumentGuardedMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
    clan
    createdAt
    email
    emailPreferences {
      allOptOut
      boxRequestOptOut
      collaboratorOptOut
      optOutAt
      optOutReason
      softBounceCount
      systemOptOut
      __typename
    }
    id
    isAdmin
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const updateUserEmailPreferences = /* GraphQL */ `mutation UpdateUserEmailPreferences(
  $email: AWSEmail!
  $preferences: AWSJSON!
  $token: String!
) {
  updateUserEmailPreferences(
    email: $email
    preferences: $preferences
    token: $token
  ) {
    allOptOut
    boxRequestOptOut
    collaboratorOptOut
    optOutAt
    optOutReason
    softBounceCount
    systemOptOut
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserEmailPreferencesMutationVariables,
  APITypes.UpdateUserEmailPreferencesMutation
>;
export const updateUserGuarded = /* GraphQL */ `mutation UpdateUserGuarded($input: UserInput!) {
  updateUserGuarded(input: $input) {
    clan
    createdAt
    email
    emailPreferences {
      allOptOut
      boxRequestOptOut
      collaboratorOptOut
      optOutAt
      optOutReason
      softBounceCount
      systemOptOut
      __typename
    }
    id
    isAdmin
    name
    updatedAt
    waa
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserGuardedMutationVariables,
  APITypes.UpdateUserGuardedMutation
>;
export const updateXbiis = /* GraphQL */ `mutation UpdateXbiis(
  $condition: ModelXbiisConditionInput
  $input: UpdateXbiisInput!
) {
  updateXbiis(condition: $condition, input: $input) {
    createdAt
    defaultRole
    id
    name
    owner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    ownerUserId
    purpose
    updatedAt
    waa
    xbiisOwnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateXbiisMutationVariables,
  APITypes.UpdateXbiisMutation
>;
export const updateXbiisGuarded = /* GraphQL */ `mutation UpdateXbiisGuarded($input: XbiisInput!) {
  updateXbiisGuarded(input: $input) {
    createdAt
    defaultRole
    id
    name
    owner {
      clan
      createdAt
      email
      emailPreferences {
        allOptOut
        boxRequestOptOut
        collaboratorOptOut
        optOutAt
        optOutReason
        softBounceCount
        systemOptOut
        __typename
      }
      id
      isAdmin
      name
      updatedAt
      waa
      __typename
    }
    ownerUserId
    purpose
    updatedAt
    waa
    xbiisOwnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateXbiisGuardedMutationVariables,
  APITypes.UpdateXbiisGuardedMutation
>;
