/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAuthor = /* GraphQL */ `subscription OnCreateAuthor($filter: ModelSubscriptionAuthorFilterInput) {
  onCreateAuthor(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAuthorSubscriptionVariables,
  APITypes.OnCreateAuthorSubscription
>;
export const onCreateBoxRequest = /* GraphQL */ `subscription OnCreateBoxRequest(
  $filter: ModelSubscriptionBoxRequestFilterInput
) {
  onCreateBoxRequest(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBoxRequestSubscriptionVariables,
  APITypes.OnCreateBoxRequestSubscription
>;
export const onCreateBoxUser = /* GraphQL */ `subscription OnCreateBoxUser($filter: ModelSubscriptionBoxUserFilterInput) {
  onCreateBoxUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBoxUserSubscriptionVariables,
  APITypes.OnCreateBoxUserSubscription
>;
export const onCreateCollection = /* GraphQL */ `subscription OnCreateCollection(
  $filter: ModelSubscriptionCollectionFilterInput
) {
  onCreateCollection(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCollectionSubscriptionVariables,
  APITypes.OnCreateCollectionSubscription
>;
export const onCreateCollectionItem = /* GraphQL */ `subscription OnCreateCollectionItem(
  $filter: ModelSubscriptionCollectionItemFilterInput
) {
  onCreateCollectionItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCollectionItemSubscriptionVariables,
  APITypes.OnCreateCollectionItemSubscription
>;
export const onCreateDocumentDetails = /* GraphQL */ `subscription OnCreateDocumentDetails(
  $filter: ModelSubscriptionDocumentDetailsFilterInput
) {
  onCreateDocumentDetails(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDocumentDetailsSubscriptionVariables,
  APITypes.OnCreateDocumentDetailsSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onCreateXbiis = /* GraphQL */ `subscription OnCreateXbiis($filter: ModelSubscriptionXbiisFilterInput) {
  onCreateXbiis(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateXbiisSubscriptionVariables,
  APITypes.OnCreateXbiisSubscription
>;
export const onDeleteAuthor = /* GraphQL */ `subscription OnDeleteAuthor($filter: ModelSubscriptionAuthorFilterInput) {
  onDeleteAuthor(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAuthorSubscriptionVariables,
  APITypes.OnDeleteAuthorSubscription
>;
export const onDeleteBoxRequest = /* GraphQL */ `subscription OnDeleteBoxRequest(
  $filter: ModelSubscriptionBoxRequestFilterInput
) {
  onDeleteBoxRequest(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBoxRequestSubscriptionVariables,
  APITypes.OnDeleteBoxRequestSubscription
>;
export const onDeleteBoxUser = /* GraphQL */ `subscription OnDeleteBoxUser($filter: ModelSubscriptionBoxUserFilterInput) {
  onDeleteBoxUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBoxUserSubscriptionVariables,
  APITypes.OnDeleteBoxUserSubscription
>;
export const onDeleteCollection = /* GraphQL */ `subscription OnDeleteCollection(
  $filter: ModelSubscriptionCollectionFilterInput
) {
  onDeleteCollection(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCollectionSubscriptionVariables,
  APITypes.OnDeleteCollectionSubscription
>;
export const onDeleteCollectionItem = /* GraphQL */ `subscription OnDeleteCollectionItem(
  $filter: ModelSubscriptionCollectionItemFilterInput
) {
  onDeleteCollectionItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCollectionItemSubscriptionVariables,
  APITypes.OnDeleteCollectionItemSubscription
>;
export const onDeleteDocumentDetails = /* GraphQL */ `subscription OnDeleteDocumentDetails(
  $filter: ModelSubscriptionDocumentDetailsFilterInput
) {
  onDeleteDocumentDetails(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDocumentDetailsSubscriptionVariables,
  APITypes.OnDeleteDocumentDetailsSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onDeleteXbiis = /* GraphQL */ `subscription OnDeleteXbiis($filter: ModelSubscriptionXbiisFilterInput) {
  onDeleteXbiis(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteXbiisSubscriptionVariables,
  APITypes.OnDeleteXbiisSubscription
>;
export const onUpdateAuthor = /* GraphQL */ `subscription OnUpdateAuthor($filter: ModelSubscriptionAuthorFilterInput) {
  onUpdateAuthor(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAuthorSubscriptionVariables,
  APITypes.OnUpdateAuthorSubscription
>;
export const onUpdateBoxRequest = /* GraphQL */ `subscription OnUpdateBoxRequest(
  $filter: ModelSubscriptionBoxRequestFilterInput
) {
  onUpdateBoxRequest(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBoxRequestSubscriptionVariables,
  APITypes.OnUpdateBoxRequestSubscription
>;
export const onUpdateBoxUser = /* GraphQL */ `subscription OnUpdateBoxUser($filter: ModelSubscriptionBoxUserFilterInput) {
  onUpdateBoxUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBoxUserSubscriptionVariables,
  APITypes.OnUpdateBoxUserSubscription
>;
export const onUpdateCollection = /* GraphQL */ `subscription OnUpdateCollection(
  $filter: ModelSubscriptionCollectionFilterInput
) {
  onUpdateCollection(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCollectionSubscriptionVariables,
  APITypes.OnUpdateCollectionSubscription
>;
export const onUpdateCollectionItem = /* GraphQL */ `subscription OnUpdateCollectionItem(
  $filter: ModelSubscriptionCollectionItemFilterInput
) {
  onUpdateCollectionItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCollectionItemSubscriptionVariables,
  APITypes.OnUpdateCollectionItemSubscription
>;
export const onUpdateDocumentDetails = /* GraphQL */ `subscription OnUpdateDocumentDetails(
  $filter: ModelSubscriptionDocumentDetailsFilterInput
) {
  onUpdateDocumentDetails(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDocumentDetailsSubscriptionVariables,
  APITypes.OnUpdateDocumentDetailsSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onUpdateXbiis = /* GraphQL */ `subscription OnUpdateXbiis($filter: ModelSubscriptionXbiisFilterInput) {
  onUpdateXbiis(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateXbiisSubscriptionVariables,
  APITypes.OnUpdateXbiisSubscription
>;
