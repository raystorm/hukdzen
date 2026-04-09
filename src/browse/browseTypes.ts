import { SortDirection } from "../graphql/API";
import { Box } from "../Box/boxTypes";

export interface sort
{
   field: string;
   direction: SortDirection;
}

export interface DateRangeFilter
{
   from?: string;
   to?: string;
}

export interface BrowseFilters
{
   authors: string[];
   contentOwners: string[];
   types: string[];
   created: DateRangeFilter;
   updated: DateRangeFilter;
   keywords: string[];
   eng_titles: string[];
   bc_titles: string[];
   ak_titles: string[];
   eng_descriptions: string[];
   bc_descriptions: string[];
   ak_descriptions: string[];
   fileKeys: string[];
   versions: number[];
   ids: string[];
}

interface BrowseState
{
   selectedBox: Box | null;
   visibleFields: string[];
   sort: sort;
   filters: BrowseFilters;
}

export const emptyBrowseState: BrowseState = {
   selectedBox:   null,
   visibleFields: ['eng_title', 'bc_title', 'ak_title'],
   sort:          {
      field:     'eng_title',
      direction: SortDirection.ASC,
   },
   filters:       {
      authors:          [],
      contentOwners:    [],
      types:            [],
      created:          {},
      updated:          {},
      keywords:         [],
      eng_titles:       [],
      bc_titles:        [],
      ak_titles:        [],
      eng_descriptions: [],
      bc_descriptions:  [],
      ak_descriptions:  [],
      fileKeys:         [],
      versions:         [],
      ids:              [],
   },
};