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
        ak_description
        ak_title
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
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
        ak_description
        ak_title
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
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          xbiisOwnerId
          __typename
        }
        boxXbiisId
        created
        createdAt
        docOwner {
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
        docOwnerUserId
        documentDetailsAuthorId
        documentDetailsBoxId
        documentDetailsDocOwnerId
        eng_description
        eng_title
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
export const documentDetailsByBox = /* GraphQL */ `query DocumentDetailsByBox(
  $boxXbiisId: ID!
  $filter: ModelDocumentDetailsFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  documentDetailsByBox(
    boxXbiisId: $boxXbiisId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      ak_description
      ak_title
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
      boxXbiisId
      created
      createdAt
      docOwner {
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
      docOwnerUserId
      documentDetailsAuthorId
      documentDetailsBoxId
      documentDetailsDocOwnerId
      eng_description
      eng_title
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
  APITypes.DocumentDetailsByBoxQueryVariables,
  APITypes.DocumentDetailsByBoxQuery
>;
export const documentDetailsByOwner = /* GraphQL */ `query DocumentDetailsByOwner(
  $docOwnerUserId: ID!
  $filter: ModelDocumentDetailsFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  documentDetailsByOwner(
    docOwnerUserId: $docOwnerUserId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      ak_description
      ak_title
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
      boxXbiisId
      created
      createdAt
      docOwner {
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
      docOwnerUserId
      documentDetailsAuthorId
      documentDetailsBoxId
      documentDetailsDocOwnerId
      eng_description
      eng_title
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
  APITypes.DocumentDetailsByOwnerQueryVariables,
  APITypes.DocumentDetailsByOwnerQuery
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
export const getAuthorDetailed = /* GraphQL */ `query GetAuthorDetailed($id: ID!) {
  getAuthorDetailed(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAuthorDetailedQueryVariables,
  APITypes.GetAuthorDetailedQuery
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
` as GeneratedQuery<
  APITypes.GetBoxRequestDetailedQueryVariables,
  APITypes.GetBoxRequestDetailedQuery
>;
export const getBoxUser = /* GraphQL */ `query GetBoxUser($id: ID!) {
  getBoxUser(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBoxUserQueryVariables,
  APITypes.GetBoxUserQuery
>;
export const getBoxUserDetailed = /* GraphQL */ `query GetBoxUserDetailed($id: ID!) {
  getBoxUserDetailed(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBoxUserDetailedQueryVariables,
  APITypes.GetBoxUserDetailedQuery
>;
export const getCollection = /* GraphQL */ `query GetCollection($id: ID!) {
  getCollection(id: $id) {
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
          ak_description
          ak_title
          bc_description
          bc_title
          boxXbiisId
          created
          createdAt
          docOwnerUserId
          documentDetailsAuthorId
          documentDetailsBoxId
          documentDetailsDocOwnerId
          eng_description
          eng_title
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
          ak_description
          ak_title
          bc_description
          bc_title
          boxXbiisId
          created
          createdAt
          docOwnerUserId
          documentDetailsAuthorId
          documentDetailsBoxId
          documentDetailsDocOwnerId
          eng_description
          eng_title
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
      ak_description
      ak_title
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
      boxXbiisId
      created
      createdAt
      docOwner {
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
      docOwnerUserId
      documentDetailsAuthorId
      documentDetailsBoxId
      documentDetailsDocOwnerId
      eng_description
      eng_title
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
      ak_description
      ak_title
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
      boxXbiisId
      created
      createdAt
      docOwner {
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
      docOwnerUserId
      documentDetailsAuthorId
      documentDetailsBoxId
      documentDetailsDocOwnerId
      eng_description
      eng_title
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
export const getDocumentDetails = /* GraphQL */ `query GetDocumentDetails($id: ID!) {
  getDocumentDetails(id: $id) {
    ak_description
    ak_title
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
    boxXbiisId
    created
    createdAt
    docOwner {
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
    docOwnerUserId
    documentDetailsAuthorId
    documentDetailsBoxId
    documentDetailsDocOwnerId
    eng_description
    eng_title
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
  APITypes.GetDocumentDetailsQueryVariables,
  APITypes.GetDocumentDetailsQuery
>;
export const getDocumentDetailsDetailed = /* GraphQL */ `query GetDocumentDetailsDetailed($id: ID!) {
  getDocumentDetailsDetailed(id: $id) {
    ak_description
    ak_title
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
    boxXbiisId
    created
    createdAt
    docOwner {
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
    docOwnerUserId
    documentDetailsAuthorId
    documentDetailsBoxId
    documentDetailsDocOwnerId
    eng_description
    eng_title
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
  APITypes.GetDocumentDetailsDetailedQueryVariables,
  APITypes.GetDocumentDetailsDetailedQuery
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
export const getUserDetailed = /* GraphQL */ `query GetUserDetailed($id: ID!) {
  getUserDetailed(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserDetailedQueryVariables,
  APITypes.GetUserDetailedQuery
>;
export const getXbiis = /* GraphQL */ `query GetXbiis($id: ID!) {
  getXbiis(id: $id) {
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
` as GeneratedQuery<APITypes.GetXbiisQueryVariables, APITypes.GetXbiisQuery>;
export const getXbiisDetailed = /* GraphQL */ `query GetXbiisDetailed($id: ID!) {
  getXbiisDetailed(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetXbiisDetailedQueryVariables,
  APITypes.GetXbiisDetailedQuery
>;
export const listAuthorDetailed = /* GraphQL */ `query ListAuthorDetailed(
  $filter: AuthorFilterInput
  $limit: Int
  $nextToken: String
) {
  listAuthorDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  APITypes.ListAuthorDetailedQueryVariables,
  APITypes.ListAuthorDetailedQuery
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
        ak_description
        ak_title
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
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
        ak_description
        ak_title
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
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          xbiisOwnerId
          __typename
        }
        boxXbiisId
        created
        createdAt
        docOwner {
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
        docOwnerUserId
        documentDetailsAuthorId
        documentDetailsBoxId
        documentDetailsDocOwnerId
        eng_description
        eng_title
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
        ak_description
        ak_title
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
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
        ak_description
        ak_title
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
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          xbiisOwnerId
          __typename
        }
        boxXbiisId
        created
        createdAt
        docOwner {
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
        docOwnerUserId
        documentDetailsAuthorId
        documentDetailsBoxId
        documentDetailsDocOwnerId
        eng_description
        eng_title
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCollectionsQueryVariables,
  APITypes.ListCollectionsQuery
>;
export const listDocumentDetails = /* GraphQL */ `query ListDocumentDetails(
  $filter: ModelDocumentDetailsFilterInput
  $limit: Int
  $nextToken: String
) {
  listDocumentDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ak_description
      ak_title
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
      boxXbiisId
      created
      createdAt
      docOwner {
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
      docOwnerUserId
      documentDetailsAuthorId
      documentDetailsBoxId
      documentDetailsDocOwnerId
      eng_description
      eng_title
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
  APITypes.ListDocumentDetailsQueryVariables,
  APITypes.ListDocumentDetailsQuery
>;
export const listDocumentDetailsDetailed = /* GraphQL */ `query ListDocumentDetailsDetailed(
  $filter: DocumentDetailsFilterInput
  $limit: Int
  $nextToken: String
) {
  listDocumentDetailsDetailed(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ak_description
      ak_title
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
      boxXbiisId
      created
      createdAt
      docOwner {
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
      docOwnerUserId
      documentDetailsAuthorId
      documentDetailsBoxId
      documentDetailsDocOwnerId
      eng_description
      eng_title
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
  APITypes.ListDocumentDetailsDetailedQueryVariables,
  APITypes.ListDocumentDetailsDetailedQuery
>;
export const listUserDetailed = /* GraphQL */ `query ListUserDetailed(
  $filter: UserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  APITypes.ListUserDetailedQueryVariables,
  APITypes.ListUserDetailedQuery
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
export const listXbiis = /* GraphQL */ `query ListXbiis(
  $filter: ModelXbiisFilterInput
  $limit: Int
  $nextToken: String
) {
  listXbiis(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListXbiisQueryVariables, APITypes.ListXbiisQuery>;
export const listXbiisDetailed = /* GraphQL */ `query ListXbiisDetailed(
  $filter: XbiisFilterInput
  $limit: Int
  $nextToken: String
) {
  listXbiisDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListXbiisDetailedQueryVariables,
  APITypes.ListXbiisDetailedQuery
>;
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
        ak_description
        ak_title
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
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
          nextToken
          __typename
        }
        updated
        updatedAt
        __typename
      }
      document {
        ak_description
        ak_title
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
        bc_description
        bc_title
        box {
          createdAt
          defaultRole
          id
          name
          ownerUserId
          purpose
          updatedAt
          waa
          xbiisOwnerId
          __typename
        }
        boxXbiisId
        created
        createdAt
        docOwner {
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
        docOwnerUserId
        documentDetailsAuthorId
        documentDetailsBoxId
        documentDetailsDocOwnerId
        eng_description
        eng_title
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
export const xbiisByOwner = /* GraphQL */ `query XbiisByOwner(
  $filter: ModelXbiisFilterInput
  $limit: Int
  $nextToken: String
  $ownerUserId: ID!
  $sortDirection: ModelSortDirection
) {
  xbiisByOwner(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    ownerUserId: $ownerUserId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.XbiisByOwnerQueryVariables,
  APITypes.XbiisByOwnerQuery
>;
