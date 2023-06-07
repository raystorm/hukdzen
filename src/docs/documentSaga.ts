import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {
  CreateDocumentDetailsInput,
  GetDocumentDetailsQuery,
  CreateDocumentDetailsMutation,
  UpdateDocumentDetailsInput, UpdateDocumentDetailsMutation
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations"
import { DocumentDetails } from './DocumentTypes';
import documentSlice, { documentActions } from './documentSlice';
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";


export const docListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';

export function getDocumentById(id: string) 
{
  console.log(`Loading document: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetDocumentDetailsQuery>>({
    query: queries.getDocumentDetails,
    variables: {id: id}
  });
}

export function createDocument(document: DocumentDetails) 
{
  //error checks
  if ( document.version < 0 )
  { throw new Error('Document version cannot be negative!'); }

  //

  const createMe: CreateDocumentDetailsInput = {
    id:              document.id,
    eng_title:       document.eng_title,
    eng_description: document.eng_description,
    fileKey:         document.fileKey,
    type:            document.type,
    version:         document.version,

    documentDetailsAuthorId:   document.author.id,
    documentDetailsDocOwnerId: document.docOwner.id,

    documentDetailsBoxId: document.box.id,

    bc_title:        document.bc_title,
    bc_description:  document.bc_description,

    ak_title:        document.ak_title,
    ak_description:  document.ak_description,

    created:     new Date().toISOString(),
    updated:     new Date().toISOString(),
  }

  return API.graphql<GraphQLQuery<CreateDocumentDetailsMutation>>({
    query: mutations.createDocumentDetails,
    variables: { input: createMe }
  })
}

export function updateDocument(document: DocumentDetails) 
{
  const updateMe: UpdateDocumentDetailsInput = {
    id:              document.id,
    eng_title:       document.eng_title,
    eng_description: document.eng_description,

    fileKey:         document.fileKey,
    type:            document.type,
    version:         document.version,

    documentDetailsAuthorId:   document.author.id,
    documentDetailsDocOwnerId: document.docOwner.id,

    documentDetailsBoxId: document.box.id,

    bc_title:        document.bc_title,
    bc_description:  document.bc_description,

    ak_title:        document.ak_title,
    ak_description:  document.ak_description,

    created:     document.created,
    updated:     new Date().toISOString(),
  }

  return API.graphql<GraphQLQuery<UpdateDocumentDetailsMutation>>({
    query: mutations.updateDocumentDetails,
    variables: { input: updateMe }
  })
}

//TODO: check response for error.

//TODO: find correct type for action
export function* handleGetDocumentById(action: any): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleGetDocumentById ${JSON.stringify(action)}`);
    const response = yield call(getDocumentById, action.payload);
    const document = response.data.getDocumentDetails;
    console.log(`Selected Document: ${JSON.stringify(document, null, 2)}`);
    yield put(documentActions.selectDocument(document));
  }
  catch (error) {
    console.log(error);
    message = buildErrorAlert(`Failed to GET Document: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateDocument(action: any): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleCreateDocument ${JSON.stringify(action)}`);
    const response = yield call(createDocument, action.payload);
    yield put(documentActions.selectDocument(response));
    message = buildSuccessAlert('Document Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Create Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateDocumentMetadata(action: any): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleUpdateDocumentMetadata ${JSON.stringify(action)}`);
    const response = yield call(updateDocument, action.payload);
    yield put(documentActions.selectDocument(response.data.updateDocumentDetails));
    message = buildSuccessAlert('Document Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateDocumentVersion(action: any): any
{
  let message : AlertBarProps;
  try 
  {
    console.log(`handleUpdateDocumentVersion ${JSON.stringify(action)}`);
    const response = yield call(updateDocument, action.payload);
    yield put(documentActions.selectDocument(response.data.updateDocumentDetails));
    message = buildSuccessAlert('Document Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* watchDocumentSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(documentActions.selectDocumentById.type, 
                    handleGetDocumentById);
   yield takeEvery(documentActions.createDocumentRequested.type,
                  handleCreateDocument);
   //TODO: should this be takeLatest?
   yield takeEvery(documentActions.updateDocumentMetadata.type,
                   handleUpdateDocumentMetadata);
   yield takeEvery(documentActions.updateDocumentVersion.type,
                   handleUpdateDocumentVersion);
}