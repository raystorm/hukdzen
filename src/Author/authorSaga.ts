import {call, put, takeLatest, takeLeading} from 'redux-saga/effects'
import { generateClient } from '@aws-amplify/api';

import { CreateAuthorInput, UpdateAuthorInput, } from "../types/AmplifyTypes";
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
   const createMe : CreateAuthorInput = {
     id:    author.id,
     email: author.email,
     name:  author.name,
     waa:   author.waa,
     clan:  author.clan
   };

   return client.graphql({
     query: mutations.createAuthor,
     variables: { input: createMe }
   });
}

export const updateAuthor = (author: Author) =>
{
  const updateTo: UpdateAuthorInput = {
    id:    author.id,
    name:  author.name,
    email: author.email,
    waa:   author.waa,
    clan:  author.clan,
  }

  return client.graphql({
    query: mutations.updateAuthor,
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
    console.log('handleCreateAuthor', action);
    const response = yield call(createAuthor, action.payload);
    yield put(authorActions.setAuthor(response.data.createAuthor));
    message = buildSuccessAlert('Author Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Create Author: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateAuthor(action: any): any
{
  let message:Alert;
  try 
  {
    console.log('handleUpdateAuthor', action);
    const response = yield call(updateAuthor, action.payload);
    yield put(authorActions.setAuthor(response.data.updateAuthor));
    message = buildSuccessAlert('Author Updated');
    console.log('author updated with:', response.data.updateAuthor);
  }
  catch(error)
  {
    message = buildErrorAlert(`Error Updating Author: ${JSON.stringify(error)}`);
    console.log(error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}


export function* watchAuthorSaga()
{
   yield takeLatest(authorActions.getAuthorById.type,  handleGetAuthorById);
   yield takeLeading(authorActions.createAuthor.type,  handleCreateAuthor);
   yield takeLatest(authorActions.updateAuthor.type,   handleUpdateAuthor);
}