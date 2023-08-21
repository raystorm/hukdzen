import { call, put, takeLatest } from 'redux-saga/effects'
import { API } from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {
  CreateAuthorInput,
  CreateAuthorMutation,
  GetAuthorQuery,
  UpdateAuthorInput,
  UpdateAuthorMutation,
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { Author } from './AuthorType';
import { authorActions } from './authorSlice';
import {AlertBarProps} from "../AlertBar/AlertBar";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";

export const getAuthorById = (id: string) =>
{
  //console.log(`Loading Author: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetAuthorQuery>>({
    query: queries.getAuthor,
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

   return API.graphql<GraphQLQuery<CreateAuthorMutation>>({
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

  return API.graphql<GraphQLQuery<UpdateAuthorMutation>>({
    query: mutations.updateAuthor,
    variables: { input: updateTo }
  });
}

export function* handleGetAuthorById(action: any): any
{
  try 
  {
    //console.log(`handleGetAuthorById ${JSON.stringify(action)}`);
    const response = yield call(getAuthorById, action.payload);
    yield put(authorActions.setAuthor(response.data.getAuthor));
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
  let message:AlertBarProps;
  try 
  {
    console.log(`handleUpdateAuthor ${JSON.stringify(action)}`);
    const response = yield call(updateAuthor, action.payload);
    yield put(authorActions.setAuthor(response.data.updateAuthor));
    message = buildSuccessAlert('Author Updated');
    console.log(`author updated with: ${JSON.stringify(response.data.updateAuthor,
                                                       null, 2)}`);
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
   // findAll, findMostRecent, findOwned
   yield takeLatest(authorActions.getAuthorById.type, handleGetAuthorById);
   yield takeLatest(authorActions.createAuthor.type,  handleCreateAuthor);
   yield takeLatest(authorActions.updateAuthor.type,  handleUpdateAuthor);
}