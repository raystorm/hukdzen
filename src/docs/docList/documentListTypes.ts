import { ModelDocumentDetailsConnection } from "../../types/AmplifyTypes";


export const emptyDocList: ModelDocumentDetailsConnection = {
   __typename: "ModelDocumentDetailsConnection",
   items: [],
}

/*
 *  should this be in a new package "search"
 *  using docList for "historical" reasons.
 *  TODO: move to search, when processing gets more robust
 */

/** Which direction to order results */
export enum sortDirection { ASC, DESC }

export interface SearchParams
{
   keyword:         string,
   field?:          string, //TODO: list of fields instead of string

   sortField?:      string,
   sortDirection?:  sortDirection,

   page?:           number,
   resultsPerPage?: number,
}

export const emptySearchParams: SearchParams = {
   keyword: '',
   field:   'keywords',

   page:           0,
   resultsPerPage: 10,
}