import * as APITypes from "../graphql/API";
import { GeneratedQuery } from "../types/graphql";

export const getBoxUserDetailed = /* GraphQL */ `
  query GetBoxUserDetailed($id: ID!) {
    getBoxUserDetailed(id: $id) {
        __typename
        id
        box {
           __typename
           id
           name
           waa
           defaultRole
           purpose
           owner {
              __typename
              id
              email
              name
              waa
              clan
              isAdmin
              createdAt
              updatedAt
           }
           xbiisOwnerId
           ownerUserId
           createdAt
           updatedAt
        }
        boxUserBoxId
        user {
           __typename
           id
           email
           name
           waa
           clan
           isAdmin
           createdAt
           updatedAt
        }
        boxUserUserId
        userUserId
        role
        createdAt
        updatedAt
    }
}
` as GeneratedQuery<
   APITypes.GetBoxUserDetailedQueryVariables,
   APITypes.GetBoxUserDetailedQuery
>;
