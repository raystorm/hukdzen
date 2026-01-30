export type {
   SearchResults, SearchResultItem,
   SearchResultType, SortDirection,
   SearchDocumentsQueryVariables as SearchParams,
} from '../types/AmplifyTypes';

export const emptySearchResults: SearchResults =
{
   items: [],
   total: 0,
   from: 0,
   limit: 10,
   nextToken: undefined,
};
