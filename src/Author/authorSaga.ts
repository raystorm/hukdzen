import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { API, Auth } from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import { Author } from './AuthorType';
import { authorActions } from './authorSlice';
import {
  CreateAuthorInput,
  CreateAuthorMutation,
  GetAuthorQuery,
  UpdateAuthorInput,
  UpdateAuthorMutation,
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import config from "../aws-exports";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";

export const getAuthorById = (id: string) =>
{
  console.log(`Loading Author: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetAuthorQuery>>({
    query: queries.getAuthor,
    variables: {id: id}
  });
}

export const createAuthor = (author: Author) =>
{
   const createMe : CreateAuthorInput = {
     id:      author.id,
     email:   author.email,
     name:    author.name,
     waa:     author.waa,
     //clan:  author.clan,
   };

   return API.graphql<GraphQLQuery<CreateAuthorMutation>>({
     query: mutations.createAuthor,
     variables: { input: createMe }
   });
}

export const updateAuthor = (author: Author) =>
{
  const updateTo: UpdateAuthorInput = {
    id:      author.id,
    name:    author.name,
    email:   author.email,
    waa:     author.waa,
  }

  return API.graphql<GraphQLQuery<UpdateAuthorMutation>>({
    query: mutations.updateAuthor,
    variables: { input: updateTo }
  });
}

export function* handleGetAuthor(action: any): any
{
  try 
  {
    console.log(`handleGetAuthor ${JSON.stringify(action)}`);
    const response = yield call(getAuthorById, action.payload?.data?.getUser.id);
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET Author: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetAuthorById(action: any): any
{
  try 
  {
    console.log(`handleGetAuthorById ${JSON.stringify(action)}`);
    const response = yield call(getAuthorById, action.payload);
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET Author: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateAuthor(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleCreateAuthor ${JSON.stringify(action)}`);
    const response = yield call(createAuthor, action.payload);
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
  let message:AlertBarProps;
  let updateResponse;
  try 
  {
    //console.log(`handleUpdateAuthor ${JSON.stringify(action)}`);
    const response = yield call(updateAuthor, action.payload);
    message = buildSuccessAlert('Author Updated');
  }
  catch(error)
  {
    message = buildErrorAlert(`Error Updating Author: ${JSON.stringify(error)}`);
    console.log(error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
  //return updateResponse.data.updateGyet;
}


export function* watchAuthorSaga()
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(authorActions.getAuthor.type,     handleGetAuthor);
   yield takeLatest(authorActions.getAuthorById.type, handleGetAuthorById);
   yield takeLatest(authorActions.createAuthor.type,  handleCreateAuthor);
   yield takeLatest(authorActions.updateAuthor.type,  handleUpdateAuthor);
}