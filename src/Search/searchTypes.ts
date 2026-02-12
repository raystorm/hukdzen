import type { SearchResults, SearchResultItem} from '../graphql/API';
import { SearchResultType } from '../graphql/API';

export { SortDirection } from '../graphql/API';
export type {
              SearchResults, SearchResultItem, SearchResultType,
              SearchQueryVariables,
            } from '../graphql/API'

export const emptySearchResults: SearchResults =
{
   __typename: "SearchResults",
   items: [],
   total: 0,
   from: 0,
   limit: 10,
   nextToken: undefined,
};

export const emptySearchResultItem: SearchResultItem =
{
  __typename: "SearchResultItem",
  //collection?: Collection | null,
  //document?: DocumentDetails | null,
  //score?: number | null,
  type: SearchResultType.DOCUMENT, //assume Document since we only search documents for now
}

