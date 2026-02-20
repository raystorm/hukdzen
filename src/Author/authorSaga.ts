import {call, put, takeLatest, takeLeading} from 'redux-saga/effects'
import { generateClient } from '@aws-amplify/api';

import { AuthorInput } from "../graphql/API";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { Author } from './AuthorType';
import { authorActions } from './authorSlice';
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import { Alert, buildErrorAlert, buildFriendlyErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";
import { validateResponse } from "../utils/saga.utilities";
import { logger } from "../utils/logger";

const client = generateClient();

export const getAuthorById = (id: string) =>
{
  //console.log(`Loading Author: ${id} from DynamoDB via Appsync (GraphQL)`);
  return client.graphql({
    query: queries.getAuthorDetailed,
    variables: {id: id}
  });
}

export const createAuthor = (author: Author) =>
{
   const createMe : AuthorInput = {
     id:    author.id,
     email: author.email,
     name:  author.name,
     waa:   author.waa,
     clan:  author.clan
   };

   return client.graphql({
     query: mutations.createAuthorGuarded,
     variables: { input: createMe }
   });
}

export const updateAuthor = (author: Author) =>
{
  const updateTo: AuthorInput = {
    id:    author.id,
    name:  author.name,
    email: author.email,
    waa:   author.waa,
    clan:  author.clan,
  }

  return client.graphql({
    query: mutations.updateAuthorGuarded,
    variables: { input: updateTo }
  });
}

export function* handleGetAuthorById(action: any): any
{
  try 
  {
    //console.log('handleGetAuthorById', action);
    const response = yield call(getAuthorById, action.payload);
    const author = validateResponse(response, r => r.data.getAuthorDetailed, 'Author');
    yield put(authorActions.setAuthor(author));
  }
  catch (error)
  {
    logger.log(error);
    const message = buildFriendlyErrorAlert('Failed to GET Author:', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateAuthor(action: any): any
{
  let message: Alert;
  try
  {
    logger.log('handleCreateAuthor', action);
    const response = yield call(createAuthor, action.payload);
    const author = validateResponse(response, r => r.data.createAuthorGuarded, 'Author');
    yield put(authorActions.setAuthor(author));
    message = buildSuccessAlert('Author Created');
  }
  catch (error)
  {
    logger.log(error);
    message = buildFriendlyErrorAlert('Failed to Create Author:', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateAuthor(action: any): any
{
  let message:Alert;
  try 
  {
    logger.log('handleUpdateAuthor', action);
    const response = yield call(updateAuthor, action.payload);
    const author = validateResponse(response, r => r.data.updateAuthorGuarded, 'Author');
    yield put(authorActions.setAuthor(author));
    message = buildSuccessAlert('Author Updated');
    logger.log('author updated with:', author);
  }
  catch(error)
  {
    logger.log(error);
    message = buildFriendlyErrorAlert('Error Updating Author:', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}


export function* watchAuthorSaga()
{
   yield takeLatest(authorActions.getAuthorById.type,  handleGetAuthorById);
   yield takeLeading(authorActions.createAuthor.type,  handleCreateAuthor);
   yield takeLatest(authorActions.updateAuthor.type,   handleUpdateAuthor);
}