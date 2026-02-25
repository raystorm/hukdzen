import * as APITypes from "../../graphql/API";
import { GeneratedQuery } from "../../types/graphql";

export const listBoxUserDetailed = /* GraphQL */ `
  query ListBoxUserDetailed(
    $filter: BoxUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
     listBoxUserDetailed(filter: $filter, limit: $limit, nextToken: $nextToken) {
       items {
         __typename
         id
         role
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
         createdAt
         updatedAt
       }
       nextToken
     }
   }
` as GeneratedQuery<
   APITypes.ListBoxUserDetailedQueryVariables,
   APITypes.ListBoxUserDetailedQuery
>;
