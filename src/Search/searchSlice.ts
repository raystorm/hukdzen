import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResults, SearchQueryVariables, emptySearchResults } from './searchTypes';

interface SearchState
{
   results: SearchResults;
   params: SearchQueryVariables | null;
   error: string | Error | null;
}

const initialState: SearchState =
{
   results: emptySearchResults,
   params: null,
   error: null,
};

const searchSlice = createSlice({
   name: 'search',
   initialState,
   reducers:
   {
      searchDocuments(state, action: PayloadAction<SearchQueryVariables>)
      {
         state.error = null;
         state.params = action.payload;
      },
      setSearchResults(state, action: PayloadAction<SearchResults>)
      {
         state.results = action.payload;
         state.error = null;
      },
      setSearchError(state, action: PayloadAction<string | Error>)
      { state.error = action.payload; },
      clearSearch(state)
      {
         state.results = emptySearchResults;
         state.params = null;
         state.error = null;
      },
   },
});

export const searchActions = searchSlice.actions;
export default searchSlice.reducer;
