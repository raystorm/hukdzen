/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const _empty = /* GraphQL */ `query _empty {
  _empty
}
` as GeneratedQuery<APITypes._emptyQueryVariables, APITypes._emptyQuery>;
export const boxUsersByUser = /* GraphQL */ `query BoxUsersByUser(
  $filter: ModelBoxUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userUserId: ID!
) {
  boxUsersByUser(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userUserId: $userUserId
  ) {
    items {
      box {
        boxOwnerId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BoxUsersByUserQueryVariables,
  APITypes.BoxUsersByUserQuery
>;
export const boxesByOwner = /* GraphQL */ `query BoxesByOwner(
  $filter: ModelBoxFilterInput
  $limit: Int
  $nextToken: String
  $ownerUserId: ID!
  $sortDirection: ModelSortDirection
) {
  boxesByOwner(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    ownerUserId: $ownerUserId
    sortDirection: $sortDirection
  ) {
    items {
      boxOwnerId
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BoxesByOwnerQueryVariables,
  APITypes.BoxesByOwnerQuery
>;
export const collectionItemsByCollection = /* GraphQL */ `query CollectionItemsByCollection(
  $collectionCollectionId: ID!
  $filter: ModelCollectionItemFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  collectionItemsByCollection(
    collectionCollectionId: $collectionCollectionId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      childCollection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
          nextToken
          __typename
        }
        updated
        updatedAt
        __typename
      }
      collection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
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
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        contentOwner {
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
        created
        createdAt
        documentAuthorId
        documentBoxBoxId
        documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CollectionItemsByCollectionQueryVariables,
  APITypes.CollectionItemsByCollectionQuery
>;
export const collectionsByBox = /* GraphQL */ `query CollectionsByBox(
  $collectionBoxId: ID!
  $filter: ModelCollectionFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  collectionsByBox(
    collectionBoxId: $collectionBoxId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CollectionsByBoxQueryVariables,
  APITypes.CollectionsByBoxQuery
>;
export const collectionsByOwner = /* GraphQL */ `query CollectionsByOwner(
  $collectionContentOwnerUserId: ID!
  $filter: ModelCollectionFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  collectionsByOwner(
    collectionContentOwnerUserId: $collectionContentOwnerUserId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CollectionsByOwnerQueryVariables,
  APITypes.CollectionsByOwnerQuery
>;
export const documentsByAuthor = /* GraphQL */ `query DocumentsByAuthor(
  $documentAuthorId: ID!
  $filter: ModelDocumentFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  documentsByAuthor(
    documentAuthorId: $documentAuthorId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DocumentsByAuthorQueryVariables,
  APITypes.DocumentsByAuthorQuery
>;
export const documentsByBox = /* GraphQL */ `query DocumentsByBox(
  $documentBoxBoxId: ID!
  $filter: ModelDocumentFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  documentsByBox(
    documentBoxBoxId: $documentBoxBoxId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DocumentsByBoxQueryVariables,
  APITypes.DocumentsByBoxQuery
>;
export const documentsByOwner = /* GraphQL */ `query DocumentsByOwner(
  $documentContentOwnerUserId: ID!
  $filter: ModelDocumentFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  documentsByOwner(
    documentContentOwnerUserId: $documentContentOwnerUserId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DocumentsByOwnerQueryVariables,
  APITypes.DocumentsByOwnerQuery
>;
export const getAuthor = /* GraphQL */ `query GetAuthor($id: ID!) {
  getAuthor(id: $id) {
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
` as GeneratedQuery<APITypes.GetAuthorQueryVariables, APITypes.GetAuthorQuery>;
export const getBox = /* GraphQL */ `query GetBox($id: ID!) {
  getBox(id: $id) {
    boxOwnerId
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
    __typename
  }
}
` as GeneratedQuery<APITypes.GetBoxQueryVariables, APITypes.GetBoxQuery>;
export const getBoxDetailed = /* GraphQL */ `query GetBoxDetailed($id: ID!) {
  getBoxDetailed(id: $id) {
    boxOwnerId
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetBoxDetailedQueryVariables,
  APITypes.GetBoxDetailedQuery
>;
export const getBoxRequest = /* GraphQL */ `query GetBoxRequest($id: ID!) {
  getBoxRequest(id: $id) {
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
      boxOwnerId
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
` as GeneratedQuery<
  APITypes.GetBoxRequestQueryVariables,
  APITypes.GetBoxRequestQuery
>;
export const getBoxRequestDetailed = /* GraphQL */ `query GetBoxRequestDetailed($id: ID!) {
  getBoxRequestDetailed(id: $id) {
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
      boxOwnerId
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
` as GeneratedQuery<
  APITypes.GetBoxRequestDetailedQueryVariables,
  APITypes.GetBoxRequestDetailedQuery
>;
export const getBoxUser = /* GraphQL */ `query GetBoxUser($id: ID!) {
  getBoxUser(id: $id) {
    box {
      boxOwnerId
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
` as GeneratedQuery<
  APITypes.GetBoxUserQueryVariables,
  APITypes.GetBoxUserQuery
>;
export const getBoxUserDetailed = /* GraphQL */ `query GetBoxUserDetailed($id: ID!) {
  getBoxUserDetailed(id: $id) {
    box {
      boxOwnerId
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
` as GeneratedQuery<
  APITypes.GetBoxUserDetailedQueryVariables,
  APITypes.GetBoxUserDetailedQuery
>;
export const getCollection = /* GraphQL */ `query GetCollection($id: ID!) {
  getCollection(id: $id) {
    ak {
      description
      title
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      boxOwnerId
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
      __typename
    }
    collectionBoxId
    collectionContentOwnerId
    collectionContentOwnerUserId
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
    eng {
      description
      title
      __typename
    }
    id
    items {
      items {
        childCollection {
          collectionBoxId
          collectionContentOwnerId
          collectionContentOwnerUserId
          created
          createdAt
          id
          updated
          updatedAt
          __typename
        }
        collection {
          collectionBoxId
          collectionContentOwnerId
          collectionContentOwnerUserId
          created
          createdAt
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
          documentBoxBoxId
          documentBoxId
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
` as GeneratedQuery<
  APITypes.GetCollectionQueryVariables,
  APITypes.GetCollectionQuery
>;
export const getCollectionDetailed = /* GraphQL */ `query GetCollectionDetailed($id: ID!) {
  getCollectionDetailed(id: $id) {
    ak {
      description
      title
      __typename
    }
    bc {
      description
      title
      __typename
    }
    box {
      boxOwnerId
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
      __typename
    }
    collectionBoxId
    collectionContentOwnerId
    collectionContentOwnerUserId
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
    eng {
      description
      title
      __typename
    }
    id
    items {
      items {
        childCollection {
          collectionBoxId
          collectionContentOwnerId
          collectionContentOwnerUserId
          created
          createdAt
          id
          updated
          updatedAt
          __typename
        }
        collection {
          collectionBoxId
          collectionContentOwnerId
          collectionContentOwnerUserId
          created
          createdAt
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
          documentBoxBoxId
          documentBoxId
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
` as GeneratedQuery<
  APITypes.GetCollectionDetailedQueryVariables,
  APITypes.GetCollectionDetailedQuery
>;
export const getCollectionItem = /* GraphQL */ `query GetCollectionItem($id: ID!) {
  getCollectionItem(id: $id) {
    childCollection {
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
` as GeneratedQuery<
  APITypes.GetCollectionItemQueryVariables,
  APITypes.GetCollectionItemQuery
>;
export const getCollectionItemDetailed = /* GraphQL */ `query GetCollectionItemDetailed($id: ID!) {
  getCollectionItemDetailed(id: $id) {
    childCollection {
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
` as GeneratedQuery<
  APITypes.GetCollectionItemDetailedQueryVariables,
  APITypes.GetCollectionItemDetailedQuery
>;
export const getDocument = /* GraphQL */ `query GetDocument($id: ID!) {
  getDocument(id: $id) {
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
      boxOwnerId
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
    documentBoxBoxId
    documentBoxId
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
` as GeneratedQuery<
  APITypes.GetDocumentQueryVariables,
  APITypes.GetDocumentQuery
>;
export const getDocumentDetailed = /* GraphQL */ `query GetDocumentDetailed($id: ID!) {
  getDocumentDetailed(id: $id) {
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
      boxOwnerId
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
    documentBoxBoxId
    documentBoxId
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
` as GeneratedQuery<
  APITypes.GetDocumentDetailedQueryVariables,
  APITypes.GetDocumentDetailedQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const getUserByEmail = /* GraphQL */ `query GetUserByEmail(
  $email: AWSEmail!
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  getUserByEmail(
    email: $email
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserByEmailQueryVariables,
  APITypes.GetUserByEmailQuery
>;
export const listAuthors = /* GraphQL */ `query ListAuthors(
  $filter: ModelAuthorFilterInput
  $limit: Int
  $nextToken: String
) {
  listAuthors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      clan
      createdAt
      email
      id
      name
      updatedAt
      waa
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAuthorsQueryVariables,
  APITypes.ListAuthorsQuery
>;
export const listBoxDetailed = /* GraphQL */ `query ListBoxDetailed(
  $filter: BoxFilterInput
  $limit: Int
  $nextToken: String
) {
  listBoxDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      boxOwnerId
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoxDetailedQueryVariables,
  APITypes.ListBoxDetailedQuery
>;
export const listBoxRequestDetailed = /* GraphQL */ `query ListBoxRequestDetailed(
  $filter: BoxRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listBoxRequestDetailed(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
        boxOwnerId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoxRequestDetailedQueryVariables,
  APITypes.ListBoxRequestDetailedQuery
>;
export const listBoxRequests = /* GraphQL */ `query ListBoxRequests(
  $filter: ModelBoxRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listBoxRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
        boxOwnerId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoxRequestsQueryVariables,
  APITypes.ListBoxRequestsQuery
>;
export const listBoxUserDetailed = /* GraphQL */ `query ListBoxUserDetailed(
  $filter: BoxUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listBoxUserDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      box {
        boxOwnerId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoxUserDetailedQueryVariables,
  APITypes.ListBoxUserDetailedQuery
>;
export const listBoxUsers = /* GraphQL */ `query ListBoxUsers(
  $filter: ModelBoxUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listBoxUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      box {
        boxOwnerId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoxUsersQueryVariables,
  APITypes.ListBoxUsersQuery
>;
export const listBoxes = /* GraphQL */ `query ListBoxes($filter: ModelBoxFilterInput, $limit: Int, $nextToken: String) {
  listBoxes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      boxOwnerId
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListBoxesQueryVariables, APITypes.ListBoxesQuery>;
export const listCollectionDetailed = /* GraphQL */ `query ListCollectionDetailed(
  $filter: CollectionFilterInput
  $limit: Int
  $nextToken: String
) {
  listCollectionDetailed(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCollectionDetailedQueryVariables,
  APITypes.ListCollectionDetailedQuery
>;
export const listCollectionItemDetailed = /* GraphQL */ `query ListCollectionItemDetailed(
  $filter: CollectionItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listCollectionItemDetailed(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      childCollection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
          nextToken
          __typename
        }
        updated
        updatedAt
        __typename
      }
      collection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
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
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        contentOwner {
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
        created
        createdAt
        documentAuthorId
        documentBoxBoxId
        documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCollectionItemDetailedQueryVariables,
  APITypes.ListCollectionItemDetailedQuery
>;
export const listCollectionItems = /* GraphQL */ `query ListCollectionItems(
  $filter: ModelCollectionItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listCollectionItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      childCollection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
          nextToken
          __typename
        }
        updated
        updatedAt
        __typename
      }
      collection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
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
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        contentOwner {
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
        created
        createdAt
        documentAuthorId
        documentBoxBoxId
        documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCollectionItemsQueryVariables,
  APITypes.ListCollectionItemsQuery
>;
export const listCollections = /* GraphQL */ `query ListCollections(
  $filter: ModelCollectionFilterInput
  $limit: Int
  $nextToken: String
) {
  listCollections(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ak {
        description
        title
        __typename
      }
      bc {
        description
        title
        __typename
      }
      box {
        boxOwnerId
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
        __typename
      }
      collectionBoxId
      collectionContentOwnerId
      collectionContentOwnerUserId
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
      eng {
        description
        title
        __typename
      }
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCollectionsQueryVariables,
  APITypes.ListCollectionsQuery
>;
export const listDocumentDetailed = /* GraphQL */ `query ListDocumentDetailed(
  $filter: DocumentFilterInput
  $limit: Int
  $nextToken: String
) {
  listDocumentDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDocumentDetailedQueryVariables,
  APITypes.ListDocumentDetailedQuery
>;
export const listDocuments = /* GraphQL */ `query ListDocuments(
  $filter: ModelDocumentFilterInput
  $limit: Int
  $nextToken: String
) {
  listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
        boxOwnerId
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
      documentBoxBoxId
      documentBoxId
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDocumentsQueryVariables,
  APITypes.ListDocumentsQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const search = /* GraphQL */ `query Search(
  $boxIds: [ID!]
  $field: String
  $from: Int
  $limit: Int
  $query: String!
  $sortDirection: SortDirection
  $sortField: String
) {
  search(
    boxIds: $boxIds
    field: $field
    from: $from
    limit: $limit
    query: $query
    sortDirection: $sortDirection
    sortField: $sortField
  ) {
    from
    items {
      collection {
        ak {
          description
          title
          __typename
        }
        bc {
          description
          title
          __typename
        }
        box {
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        collectionBoxId
        collectionContentOwnerId
        collectionContentOwnerUserId
        contentOwner {
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
        created
        createdAt
        eng {
          description
          title
          __typename
        }
        id
        items {
          nextToken
          __typename
        }
        updated
        updatedAt
        __typename
      }
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
          boxOwnerId
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          __typename
        }
        contentOwner {
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
        created
        createdAt
        documentAuthorId
        documentBoxBoxId
        documentBoxId
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
      score
      type
      __typename
    }
    limit
    nextToken
    total
    __typename
  }
}
` as GeneratedQuery<APITypes.SearchQueryVariables, APITypes.SearchQuery>;
