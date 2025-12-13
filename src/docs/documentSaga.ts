import {call, delay, put, takeEvery, takeLatest, takeLeading,} from 'redux-saga/effects'
import {PayloadAction} from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';
import { copy, remove } from '@aws-amplify/storage';

import {
  CreateDocumentDetailsInput, UpdateDocumentDetailsInput,
  ModelDocumentDetailsFilterInput
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations"

import { appSelect } from "../app/hooks";
import { logger } from "../utils/logger";

import {DocumentDetails, MoveDocument} from './DocumentTypes';
import { documentActions } from './documentSlice';
import {emptyDocumentDetails} from "./initialDocumentDetails";
import {buildBoxListFilterForBoxUsers} from "./docList/documentListSaga";

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import { AlertBarProps } from "../AlertBar/AlertBarNotifier";
import { buildErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";
import { uiActions } from "../UI/uiSlice";

import { User } from "../User/userType";
import {BoxUserList} from "../BoxUser/BoxUserList/BoxUserListType";
import {getAllBoxUsersForUserId} from "../BoxUser/BoxUserList/BoxUserListSaga";
import {clearFiles, UploadAccessLevel} from "../components/widgets/AWSFileUploader";
import {printTitles} from "../types";


const client = generateClient();

/**
 *  Retrieves a given document by its ID
 *  *Only Called by Admin users*, so no need for security checks.
 *  @param id
 */
export function getDocumentById(id: string) 
{
  logger.log('Loading document:', id, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({
    query: queries.getDocumentDetails,
    variables: {id: id}
  });
}

/**
 *  Retrieves a given document by its FileKey
 *  *Only Called by Admin users*, so no need for security checks.
 *  @param id
 */
export function getDocumentByFileKey(key: string)
{
  logger.log('Loading document:', key, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({
    query: queries.searchDocumentDetails,
    variables: { filter: { fileKey: { eq: key, } } },
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
  logger.log('Loading document:', id, '(if allowed)');
  const filter: ModelDocumentDetailsFilterInput = {
    and: [{id: {eq: id}}, buildBoxListFilterForBoxUsers(boxUsers)],
  };

  return client.graphql({
    query: queries.listDocumentDetails,
    variables: { filter: filter }
  });
}

/**
 *  Retrieved the given document by FileKey,
 *  if the user has permission to the box the document is in.
 *  @param key ID of the document to find
 *  @param boxUsers list of BoxUsers for the current user
 */
export function getDocumentByFileKeyIfAllowed(key: string, boxUsers: BoxUserList)
{
  logger.log('Loading document:', key, '(if allowed)');
  const filter: ModelDocumentDetailsFilterInput = {
    and: [{fileKey: {eq: key}}, buildBoxListFilterForBoxUsers(boxUsers)],
  };

  return client.graphql({ query: queries.listDocumentDetails,
                          variables: { filter: filter } });
}

/**
 *  Helper Function to create populate Searchable keywords,
 *  without document contents.
 *  @param document
 */
function buildBaseKeywords(document: DocumentDetails): string[]
{
  const keywords: string[] = [];

  keywords.push(document.id);
  keywords.push(document.fileKey);

  if ( document.eng_title )       { keywords.push(document.eng_title); }
  if ( document.eng_description ) { keywords.push(document.eng_description); }

  if ( document.bc_title )       { keywords.push(document.bc_title); }
  if ( document.bc_description ) { keywords.push(document.bc_description); }

  if ( document.ak_title )       { keywords.push(document.ak_title); }
  if ( document.ak_description ) { keywords.push(document.ak_description); }

  if (document.type && 'undefined' !== document.type)
  { keywords.push(document.type); }

  keywords.push(document.documentDetailsDocOwnerId);
  keywords.push(document.documentDetailsAuthorId);
  keywords.push(document.documentDetailsBoxId);

  return keywords;
}

/**
 *  Helper Function to build the Create or Update DocumentDetails object
 *  when performing a Create or Update operation.
 *  @param document
 *  @param isNew
 */
function buildDocumentForCreateOrUpdate(document: DocumentDetails, isNew: boolean)
         : CreateDocumentDetailsInput | UpdateDocumentDetailsInput
{
  //logger.log("building input for Update/Create doc.");
  const built: CreateDocumentDetailsInput | UpdateDocumentDetailsInput = {
    id:              isNew ? randomUUID() : document.id,

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

    created:     isNew ? new Date().toISOString() : document.created,
    updated:     new Date().toISOString(),

    keywords:    buildBaseKeywords(document),
  }
  return built;
}

export function createDocument(document: DocumentDetails) 
{
  //error checks
  if ( document.version < 0 )
  { throw new Error('Document version cannot be negative!'); }

  return client.graphql({
    query: mutations.createDocumentDetails,
    // @ts-ignore
    variables: { input: buildDocumentForCreateOrUpdate(document, true) }
  })
}

export function updateDocument(document: DocumentDetails) 
{
   return client.graphql({
     query: mutations.updateDocumentDetails,
     // @ts-ignore
     variables: { input: buildDocumentForCreateOrUpdate(document, false) }
   })
}

//TODO: move *collectionItem* functions to Collections Saga

// New helper: list collection items for a document
export function listCollectionItemsByDocumentId(documentId: string)
{
   return client.graphql({
      query: queries.listCollectionItems,
      variables: { filter: { documentID: { eq: documentId } } }
   });
}

// New helper: delete collection item
export function deleteCollectionItem(itemId: string)
{
   return client.graphql({ query: mutations.deleteCollectionItem,
                           variables: { input: { id: itemId } } });
}

export function removeDocumentById(id: string)
{
  return client.graphql({
           query: mutations.deleteDocumentDetails,
           variables: { input: { id: id} }
         });
}

export function copyFileInS3(action: MoveDocument)
{
  const source = { key: action.source, accessLevel: UploadAccessLevel.accessLevel };
  const destination = { key: action.destination, accessLevel: UploadAccessLevel.accessLevel };

  return copy({ source, destination});
}

export function deleteFileFromS3(key: string)
{ return remove({key, options: UploadAccessLevel }); }

export function* handleGetDocumentById(action: PayloadAction<string>): any
{
  let message : AlertBarProps;
  try
  {
    logger.log('handleGetDocumentById', action);
    yield put(uiActions.setProcessing(true));

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
      const boxUsers   = buResponse.data.listBoxUsers;
      const response   = yield call(getDocumentByIdIfAllowed,
                                         action.payload, boxUsers);
      document = response.data.listDocumentDetails.items[0];
    }
    logger.log(`Selected Document: ${JSON.stringify(document, null, 2)}`);
    yield put(documentActions.setDocument(document));
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Failed to GET Document: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleGetDocumentByFileKey(action: PayloadAction<string>): any
{
  let message : AlertBarProps;
  try
  {
    logger.log('handleGetDocumentByFileKey', action);
    yield put(uiActions.setProcessing(true));

    const user: User = yield appSelect(state => state.currentUser);

    let document: DocumentDetails;
    if ( user.isAdmin )
    {
      const response = yield call(getDocumentByFileKey, action.payload);
      document = response.data.searchDocumentDetails.items[0];
    }
    else
    {
      const buResponse = yield call(getAllBoxUsersForUserId, user.id);
      const boxUsers = buResponse.data.listBoxUsers;
      const response = yield call(getDocumentByIdIfAllowed, action.payload, boxUsers);
      document = response.data.listDocumentDetails.items[0];
    }
    logger.log('Selected Document: ', document);
    yield put(documentActions.setDocument(document));
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Failed to GET Document: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

const newDocumentGenerator = (original: DocumentDetails) => {
  return {
    ...emptyDocumentDetails,
    id: randomUUID(),
    docOwner: original.docOwner,
    documentDetailsDocOwnerId: original.documentDetailsDocOwnerId,
    box: original.box,
    documentDetailsBoxId: original.documentDetailsBoxId,
  };
}

export function* handleCreateDocument(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try
  {
    logger.log('handleCreateDocument', action);
    yield put(uiActions.setProcessing(true));

    const response = yield call(createDocument, action.payload);
    //yield put(documentActions.setDocument(response));
    //return blank document for creation of another one, assume same box/owner
    // amazonq-ignore-next-line
    yield put(documentActions.setDocument(newDocumentGenerator(action.payload)));
    message = buildSuccessAlert('Document Created');
    yield call(clearFiles); //clear the files from AWSFileUploader
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Failed to Create Document: ${JSON.stringify(error)}`);
  }
  finally { yield put(uiActions.setProcessing(false)); }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* clearDocumentCollections(document: DocumentDetails)
{
  let removedCount = 0;
  const colItemsResp: any = yield call(listCollectionItemsByDocumentId, document.id);
  const items = colItemsResp.data.listCollectionItems.items || [];

  // delete collection items that reference collections in the original box
  for (const item of items)
  {
     const parentCollection = item.collection;
     if ( parentCollection
       && parentCollection.collectionBoxId === document.documentDetailsBoxId)
     {
        yield call(deleteCollectionItem, item.id);
        ++removedCount;
     }
  }

  if (removedCount > 0)
  {
    const message = buildSuccessAlert(`Removed ${printTitles(document)} from ALL collection(s).`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleUpdateDocumentMetadata(action: PayloadAction<DocumentDetails>): any
{
   //logger.log('=== handleUpdateDocumentMetadata START ===', action.payload.id);
   //logger.trace(); // This will show you the call stack

    // Check if already processing
    const isProcessing = yield appSelect(state => state.ui.isProcessing);
    if (isProcessing)
    {
       //logger.log('Already processing, skipping duplicate request');
       return;
    }

   let message : AlertBarProps;
   try
   {
     logger.log('handleUpdateDocumentMetadata', action);
     yield put(uiActions.setProcessing(true));

     // const original: DocumentDetails = (yield appSelect(state => state.document)) || emptyDocumentDetails;
     // const payload: DocumentDetails = action.payload;

     // First, update the document metadata in DynamoDB
     const response = yield call(updateDocument, action.payload);
     yield put(documentActions.setDocument(response.data.updateDocumentDetails));

     // // If box changed, remove collection associations that were in the old box
     // if ( payload.documentDetailsBoxId && original.documentDetailsBoxId
     //   && payload.documentDetailsBoxId !== original.documentDetailsBoxId )
     // { yield call(clearDocumentCollections, payload); }

     message = buildSuccessAlert('Document Updated');

     yield call(clearFiles); //clear the files from AWSFileUploader
   }
   catch (error)
   {
     logger.error(error);
     message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`);
   }
   finally { yield put(uiActions.setProcessing(false)); }
   yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateDocumentVersion(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try 
  {
    logger.log('handleUpdateDocumentVersion', action);
    yield put(uiActions.setProcessing(true));
    const response = yield call(updateDocument, action.payload);
    //yield put(documentActions.setDocument(response.data.updateDocumentDetails));
    yield put(documentActions.setDocument(action.payload));
    yield call(clearFiles); //clear the files from AWSFileUploader
    message = buildSuccessAlert('Document Updated');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`);
  }
  finally { yield put(uiActions.setProcessing(false)); }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveDocument(action: PayloadAction<DocumentDetails>): any
{
  let message : AlertBarProps;
  try
  {
    logger.log('handleRemoveDocument', action);
    yield put(uiActions.setProcessing(true));
    yield call(deleteFileFromS3, action.payload.fileKey);
    const response = yield call(removeDocumentById, action.payload.id);
    message = buildSuccessAlert('Document Deleted');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(error)}`);
  }
  finally { yield put(uiActions.setProcessing(false)); }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleMoveDocument(action: PayloadAction<MoveDocument>): any
{
  let message: AlertBarProps;
  try
  {
    logger.log('handleMoveDocument:', action);
    yield put(uiActions.setProcessing(true));
    const copyResponse = yield call(copyFileInS3, action.payload);
    logger.log('handleMoveDocument: copied');
    yield call(deleteFileFromS3, action.payload.source);
    logger.log('handleMoveDocument: deleted');
    const doc = yield appSelect(state => state.document);
    yield call(clearDocumentCollections, doc);
    const updateMe = { ...doc, fileKey: copyResponse.fileKey,
                       box: action.payload.targetBox,
                       documentDetailsBoxId: action.payload.targetBox.id };
    yield put(documentActions.updateDocumentMetadata(updateMe));
    logger.log('handleMoveDocument: updated');
    message = buildSuccessAlert('Document Moved');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(error)}`);
  }
  finally { yield put(uiActions.setProcessing(false)); }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* watchDocumentSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLeading(documentActions.getDocumentById, handleGetDocumentById);
   yield takeLeading(documentActions.getDocumentByFileKey,
                    handleGetDocumentByFileKey);
   yield takeLeading(documentActions.createDocument, handleCreateDocument);
   //should this be takeLatest?
   yield takeLeading(documentActions.updateDocumentMetadata,
                    handleUpdateDocumentMetadata);
   yield takeLeading(documentActions.updateDocumentVersion,
                   handleUpdateDocumentVersion);

   yield takeLeading(documentActions.removeDocument, handleRemoveDocument);

   yield takeLeading(documentActions.moveDocument, handleMoveDocument);
}