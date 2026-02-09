import { User } from '../../../../src/types/AmplifyTypes'

export type { User };

export interface AppSyncEvent<TArguments>
{
   arguments:  TArguments;
   identity?:  { sub: string };
   [key: string]: any;
}

export interface SearchArguments
{
   query:          string;
   boxIds?:        string[];
   field?:         string;
   sortField?:     string;
   sortDirection?: string;
   limit?:         number;
   from?:          number;
}

export interface SearchResultItem
{
   type:     'DOCUMENT';
   document: Record<string, any>;
   score:    number;
}

export interface SearchResults
{
   items:     SearchResultItem[];
   total:     number;
   from:      number;
   limit:     number;
   nextToken: string | null;
}

/*
export interface User
{
   id:      string;
   isAdmin: boolean;
}
 */