import type { ModelDocumentConnection as DocList } from "../../graphql/API";
import type { Document } from "../DocumentTypes";
import { SortDirection } from '../../Search/searchTypes';


export interface DocumentList {
   __typename: string,
   items:      Document[],
   nextToken?: string | null,
}

export const emptyDocList: DocumentList = {
   __typename: 'EmptyDocList',
   items: [],
}

/*
 *  should this be in a new package "search"
 *  using docList for "historical" reasons.
 *  Move to search, processing is more robust
 */

export interface SearchParams
{
   keyword:         string,
   field?:          string, //TODO: list of fields instead of string

   sortField?:      string,
   sortDirection?:  SortDirection,

   page?:           number,
   resultsPerPage?: number,
}

export const emptySearchParams: SearchParams = {
   keyword: '',
   field:   'keywords',

   page:           0,
   resultsPerPage: 10,
}