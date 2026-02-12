import { describe, it, expect } from 'vitest';
import { browseReducer, browseActions } from '../browseSlice';
import { SortDirection } from '../../Search/searchTypes';
import { emptyXbiis } from '../../Box/boxTypes';

const initialState = {
   selectedBox: null,
   visibleFields: ['eng_title', 'bc_title', 'ak_title'],
   sort: {
      field: 'eng_title',
      direction: SortDirection.ASC,
   },
   filters: {
      authors: [],
      docOwners: [],
      types: [],
      created: {},
      updated: {},
      keywords: [],
      eng_titles: [],
      bc_titles: [],
      ak_titles: [],
      eng_descriptions: [],
      bc_descriptions: [],
      ak_descriptions: [],
      fileKeys: [],
      versions: [],
      ids: [],
   },
};

const mockBox = {
   ...emptyXbiis,
   id: 'test-box-id',
   eng_name: 'Test Box',
};

describe('browseSlice', () => {
   it('should return the initial state', () => {
      expect(browseReducer(undefined, { type: 'unknown' })).toEqual(initialState);
   });

   it('should handle setSelectedBox', () => {
      const actual = browseReducer(initialState, browseActions.setSelectedBox(mockBox));
      expect(actual.selectedBox).toEqual(mockBox);
   });

   it('should handle setVisibleFields', () => {
      const newFields = ['eng_title', 'author'];
      const actual = browseReducer(initialState, browseActions.setVisibleFields(newFields));
      expect(actual.visibleFields).toEqual(newFields);
   });

   it('should handle setSort', () => {
      const newSort = { field: 'author', direction: SortDirection.DESC };
      const actual = browseReducer(initialState, browseActions.setSort(newSort));
      expect(actual.sort).toEqual(newSort);
   });

   it('should handle setFilters', () => {
      const newFilters = { authors: ['author-1'], types: ['pdf'] };
      const actual = browseReducer(initialState, browseActions.setFilters(newFilters));
      expect(actual.filters.authors).toEqual(['author-1']);
      expect(actual.filters.types).toEqual(['pdf']);
      expect(actual.filters.docOwners).toEqual([]); // unchanged
   });

   it('should handle clearFilters', () => {
      const stateWithFilters = {
         ...initialState,
         filters: {
            ...initialState.filters,
            authors: ['author-1'],
            types: ['pdf'],
         },
      };
      const actual = browseReducer(stateWithFilters, browseActions.clearFilters());
      expect(actual.filters).toEqual(initialState.filters);
   });
});