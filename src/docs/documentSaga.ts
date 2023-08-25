import { call, put, takeEvery, takeLatest, } from 'redux-saga/effects'
import {API, Storage} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {
  CreateDocumentDetailsInput,
  GetDocumentDetailsQuery,
  CreateDocumentDetailsMutation,
  UpdateDocumentDetailsInput,
  UpdateDocumentDetailsMutation,
  DeleteDocumentDetailsMutation,
  ListDocumentDetailsQuery,
  ModelDocumentDetailsFilterInput
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations"
import {DocumentDetails, MoveDocument} from './DocumentTypes';
import { documentActions } from './documentSlice';
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";
import {PayloadAction} from "@reduxjs/toolkit";
import {appSelect} from "../app/hooks";
import {User} from "../User/userType";
import {BoxUserList} from "../BoxUser/BoxUserList/BoxUserListType";
import {getAllBoxUsersForUserId} from "../BoxUser/BoxUserList/BoxUserListSaga";
import {buildBoxListFilterForBoxUsers} from "./docList/documentListSaga";

/**
 *  Retrieves a given document by its ID
 *  *Only Called by Admin users*, so no need for security checks.
 *  @param id
 */
export function getDocumentById(id: string) 
{
  console.log(`Loading document: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetDocumentDetailsQuery>>({
    query: queries.getDocumentDetails,
    variables: {id: id}
  });
}

/**
 *  Retrieved the given document by ID,
 *  if the user has permission to the box the document is in.
 *  @param id ID of the document to find
 *  @param boxUsers list of BoxUsers for the current user
 */
export function getDocumentByIdIfAllowed(id: string, boxUsers: BoxUserList)
{
  console.log(`Loading document: ${id} (if allowed)`);
  const filter: ModelDocumentDetailsFilterInput = {
    and: [{id: {eq: id}}, buildBoxListFilterForBoxUsers(boxUsers)],
  };

  return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
    query: queries.listDocumentDetails,
    variables: { filter: filter }
  });
}

export function createDocument(document: DocumentDetails) 
{
  //error checks
  if ( document.version < 0 )
  { throw new Error('Document version cannot be negative!'); }

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

export function removeDocumentById(id: string)
{
  return API.graphql<GraphQLQuery<DeleteDocumentDetailsMutation>>(
         {
           query: mutations.deleteDocumentDetails,
           variables: { input: { id: id} }
         });
}

export function copyFileInS3(action: MoveDocument)
{
  const src = { key: action.source, level: 'protected' };
  const dest = { key: action.destination, level: 'protected' };

  return Storage.copy(src, dest);
}

export function deleteFileFromS3(fileKey: string)
{
  return Storage.remove(fileKey, { level: 'protected' });
}

//TODO: check response for error.

export function* handleGetDocumentById(action: PayloadAction<string>): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleGetDocumentById ${JSON.stringify(action)}`);

    const user: User = yield appSelect(state => state.currentUser);

    let document: DocumentDetails;
    if ( user.isAdmin )
    {
      const response = yield call(getDocumentById, action.payload);
      document = response.data.getDocumentDetails;
    }
    else
    {
      const buResponse = yield call(getAllBoxUsersForUserId, user.id);
      const boxUsers = buResponse.data.listBoxUsers;
      const response = yield call(getDocumentByIdIfAllowed, action.payload, boxUsers);
      document = response.data.listDocumentDetails.items[0];
    }
    console.log(`Selected Document: ${JSON.stringify(document, null, 2)}`);
    yield put(documentActions.setDocument(document));
  }
  catch (error) {
    console.log(error);
    message = buildErrorAlert(`Failed to GET Document: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateDocument(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleCreateDocument ${JSON.stringify(action)}`);
    const response = yield call(createDocument, action.payload);
    yield put(documentActions.setDocument(response));
    message = buildSuccessAlert('Document Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Create Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateDocumentMetadata(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleUpdateDocumentMetadata ${JSON.stringify(action)}`);
    const response = yield call(updateDocument, action.payload);
    yield put(documentActions.setDocument(response.data.updateDocumentDetails));
    message = buildSuccessAlert('Document Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateDocumentVersion(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try 
  {
    console.log(`handleUpdateDocumentVersion ${JSON.stringify(action)}`);
    const response = yield call(updateDocument, action.payload);
    yield put(documentActions.setDocument(response.data.updateDocumentDetails));
    message = buildSuccessAlert('Document Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveDocument(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try
  {
    console.log(`handleRemoveDocument ${JSON.stringify(action)}`);
    yield call(deleteFileFromS3, action.payload.fileKey);
    const response = yield call(removeDocumentById, action.payload.id);
    message = buildSuccessAlert('Document Deleted');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleMoveDocument(action: PayloadAction<MoveDocument>): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleMoveDocument: ${JSON.stringify(action)}`);
    const copyResponse = yield call(copyFileInS3, action.payload);
    console.log('handleMoveDocument: copied');
    yield call(deleteFileFromS3, action.payload.source);
    console.log('handleMoveDocument: deleted');
    const doc = yield appSelect(state => state.document);
    const updateMe = { ...doc, fileKey: copyResponse.fileKey };
    yield put(documentActions.updateDocumentMetadata(updateMe));
    console.log('handleMoveDocument: updated');
    message = buildSuccessAlert('Document Moved');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* watchDocumentSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(documentActions.getDocumentById.type,
                    handleGetDocumentById);
   yield takeEvery(documentActions.createDocument.type,
                  handleCreateDocument);
   //TODO: should this be takeLatest?
   yield takeEvery(documentActions.updateDocumentMetadata.type,
                   handleUpdateDocumentMetadata);
   yield takeEvery(documentActions.updateDocumentVersion.type,
                   handleUpdateDocumentVersion);

   yield takeLatest(documentActions.removeDocument, handleRemoveDocument);

   yield takeLatest(documentActions.moveDocument, handleMoveDocument);
}