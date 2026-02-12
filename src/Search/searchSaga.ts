import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from '@aws-amplify/api';

import { SearchQueryVariables } from './searchTypes';
import { searchActions } from './searchSlice';
import { uiActions } from '../UI/uiSlice';
import { logger } from '../utils/logger';
import { validateResponse } from '../utils/saga.utilities';
import * as queries from '../graphql/queries';

const client = generateClient();

export function searchDocuments(params: SearchQueryVariables)
{
   return client.graphql({
      query: queries.search,
      variables: params,
   });
}

export function* handleSearchDocuments(action: PayloadAction<SearchQueryVariables>): any
{
   try
   {
      yield put(uiActions.setProcessing(true));
      const params = action.payload;
      const response = yield call(searchDocuments, params);
      
      if (response.errors && 0 < response.errors.length)
      {
         const errorMsg = response.errors[0].message;
         logger.error('Search error:', errorMsg);
         yield put(searchActions.setSearchError(errorMsg));
         return;
      }
      
      const results = validateResponse(response, r => r.data.searchDocuments, 'Search results');
      yield put(searchActions.setSearchResults(results));
   }
   catch (error)
   {
      logger.error('Search failed:', error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      yield put(searchActions.setSearchError(errorObj));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* watchSearchSaga()
{ yield takeLatest(searchActions.searchDocuments.type, handleSearchDocuments); }
