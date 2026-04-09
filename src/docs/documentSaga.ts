import {call, delay, put, takeEvery, takeLatest, takeLeading,} from 'redux-saga/effects'
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';
import { copy, remove } from '@aws-amplify/storage';

import { DocumentInput, ModelDocumentFilterInput } from "../graphql/API";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations"

import { appSelect } from "../app/hooks";
import { logger } from "../utils/logger";
import { printErrorMessage } from "../error";
import { validateResponse, validateResponseList } from "../utils/saga.utilities";

import { Document, MoveDocument } from './DocumentTypes';
import { documentActions } from './documentSlice';
import { emptyDocument } from "./initialDocumentDetails";
import { buildBoxListFilterForBoxUsers } from "./docList/documentListSaga";

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import { Alert, buildFriendlyErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";
import { uiActions } from "../UI/uiSlice";

import { User } from "../User/userType";
import { BoxUserList } from "../BoxUser/BoxUserList/BoxUserListType";
import { getAllBoxUsersForUserId } from "../BoxUser/BoxUserList/BoxUserListSaga";
import { clearFiles, UploadAccessLevel } from "../components/widgets/AWSFileUploader";

import { printTitles } from "../Content/ContentType";


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
    query: queries.getDocument,
    variables: {id: id}
  });
}

/**
 *  Retrieves a given document by its FileKey
 *  *Only Called by Admin users*, so no need for security checks.
 *  @param key - Key / path in S3 to the file
 */
export function getDocumentByFileKey(key: string)
{
  logger.log('Loading document:', key, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({
    query: queries.search,
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
  const filter: ModelDocumentFilterInput = {
    and: [{id: {eq: id}}, buildBoxListFilterForBoxUsers(boxUsers)],
  };

  return client.graphql({
    query: queries.listDocuments,
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
  const filter: ModelDocumentFilterInput = {
    and: [{fileKey: {eq: key}}, buildBoxListFilterForBoxUsers(boxUsers)],
  };

  return client.graphql({ query: queries.listDocuments,
                          variables: { filter: filter } });
}

/**
 *  Helper Function to create populate Searchable keywords,
 *  without document contents.
 *  @param document
 */
function buildBaseKeywords(document: Document): string[]
{
  const keywords: string[] = [];

  keywords.push(document.id);
  keywords.push(document.fileKey);

  if ( document.eng?.title )       { keywords.push(document.eng.title); }
  if ( document.eng?.description ) { keywords.push(document.eng.description); }

  if ( document.bc?.title )       { keywords.push(document.bc.title); }
  if ( document.bc?.description ) { keywords.push(document.bc.description); }

  if ( document.ak?.title )       { keywords.push(document.ak.title); }
  if ( document.ak?.description ) { keywords.push(document.ak.description); }

  if (document.type && 'undefined' !== document.type)
  { keywords.push(document.type); }

  keywords.push(document.documentContentOwnerUserId);
  keywords.push(document.documentAuthorId);
  keywords.push(document.documentBoxBoxId);

  return keywords;
}

/**
 *  Helper Function to build DocumentInput for create/update operations
 *  @param document
 */
function buildDocumentInput(document: Document): DocumentInput {
   return {
      id: document.id,
      eng: {
         title: document.eng?.title || '',
         description: document.eng?.description || null,
      },
      bc: document.bc,
      ak: document.ak,
      authorId: document.author?.id || document.documentAuthorId,
      docOwnerUserId: document.contentOwner?.id || document.documentContentOwnerUserId,
      boxBoxId: document.box?.id || document.documentBoxBoxId,
      fileKey: document.fileKey,
      fileHash: document.fileHash,
      type: document.type,
      version: document.version,
      keywords: buildBaseKeywords(document),
   };
}

export function createDocumentGuarded(document: Document) 
{
  if ( document.version < 0 )
  { throw new Error('Document version cannot be negative!'); }

  return client.graphql({
    query: mutations.createDocumentGuarded,
    variables: { input: buildDocumentInput(document) }
  })
}

export function updateDocumentGuarded(document: Document) 
{
   return client.graphql({
     query: mutations.updateDocumentGuarded,
     variables: { input: buildDocumentInput(document) }
   })
}

//TODO: move *collectionItem* functions to Collections Saga

// New helper: list collection items for a document
export function listCollectionItemsByDocumentId(documentId: string)
{
   return client.graphql({
      query: queries.listCollectionItems,
      variables: { filter: { documentId: { eq: documentId } } }
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
           query: mutations.deleteDocument,
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
  let message : Alert;
  try
  {
    logger.log('handleGetDocumentById', action);
    yield put(uiActions.setProcessing(true));

    const user: User = yield appSelect(state => state.currentUser);

    let document: Document;
    if ( user.isAdmin )
    {
      const response = yield call(getDocumentById, action.payload);
      document = validateResponse(response, r => r.data.getDocument, 'Document');
    }
    else
    {
      const buResponse = yield call(getAllBoxUsersForUserId, user.id);
      const boxUsers   = buResponse.data.listBoxUsers;
      logger.log('BoxUsers for current user:', boxUsers);
      const response   = yield call(getDocumentByIdIfAllowed,
                                    action.payload, boxUsers);
      const docList = validateResponseList(response, r => r.data.listDocuments, 'Document');
      document = docList.items[0];
    }
    logger.log(`Selected Document: ${JSON.stringify(document, null, 2)}`);
    yield put(documentActions.setDocument(document));
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('Failed to GET Document', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleGetDocumentByFileKey(action: PayloadAction<string>): any
{
  let message : Alert;
  try
  {
    logger.log('handleGetDocumentByFileKey', action);
    yield put(uiActions.setProcessing(true));

    const user: User = yield appSelect(state => state.currentUser);

    let document: Document;
    if ( user.isAdmin )
    {
      const response = yield call(getDocumentByFileKey, action.payload);
      const searchResults = validateResponseList(response, r => r.data.search, 'SearchResults');
      document = searchResults.items[0]?.document as Document;
    }
    else
    {
      const buResponse = yield call(getAllBoxUsersForUserId, user.id);
      const boxUsers = buResponse.data.listBoxUsers;
      const response = yield call(getDocumentByFileKeyIfAllowed, action.payload, boxUsers);
      const docList = validateResponseList(response, r => r.data.listDocuments, 'Document');
      document = docList.items[0];
    }
    logger.log('Selected Document: ', document);
    yield put(documentActions.setDocument(document));
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('Failed to GET Document', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

const newDocumentGenerator = (original: Document) => {
  return {
    ...emptyDocument,
    id: randomUUID(),
    contentOwner: original.contentOwner,
    documentContentOwnerUserId: original.documentContentOwnerUserId,
    box: original.box,
    documentBoxBoxId: original.documentBoxBoxId,
  };
}

export function* handleCreateDocument(action: PayloadAction<Document>): any
{
  try
  {
    logger.log('handleCreateDocument', action);
    yield put(uiActions.setProcessing(true));

    const response = yield call(createDocumentGuarded, action.payload);
    const created = response.data.createDocumentGuarded;
    
    yield put(documentActions.setDocument(newDocumentGenerator(action.payload)));
    yield call(clearFiles);
    
    const message = buildSuccessAlert('Document Created');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to Create Document', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* clearDocumentCollections(document: Document)
{
  let removedCount = 0;
  const colItemsResp: any = yield call(listCollectionItemsByDocumentId, document.id);
  const items = colItemsResp.data.listCollectionItems.items || [];

  // delete collection items that reference collections in the original box
  for (const item of items)
  {
     const parentCollection = item.collection;
     if ( parentCollection
       && parentCollection.collectionBoxId === document.documentBoxBoxId)
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

export function* handleUpdateDocumentMetadata(action: PayloadAction<Document>): any
{
   const isProcessing = yield appSelect(state => state.ui.isProcessing);
   if (isProcessing) { return; }

   try
   {
     logger.log('handleUpdateDocumentMetadata', action);
     yield put(uiActions.setProcessing(true));
     
     const original: Document = yield appSelect(state => state.document.item);
     const payload = action.payload;
     
     // 1. Update document metadata in DB
     const response = yield call(updateDocumentGuarded, payload);
     const updated = response.data.updateDocumentGuarded;
     
     // 2. If box changed, clear collections from old box
     if (payload.documentBoxBoxId !== original.documentBoxBoxId) {
        yield call(clearDocumentCollections, payload);
     }
     
     // 3. Update state
     yield put(documentActions.setDocument(updated));
     yield put(documentActions.updateDocumentMetadataSuccess(updated));
     
     yield call(clearFiles);
     
     const message = buildSuccessAlert('Document Updated');
     yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
     logger.error(error);
     yield put(documentActions.updateDocumentMetadataFailure(printErrorMessage(error)));
     const message = buildFriendlyErrorAlert('Failed to Update Document', error);
     yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleUpdateDocumentVersion(action: PayloadAction<Document>): any
{
  try 
  {
    logger.log('handleUpdateDocumentVersion', action);
    yield put(uiActions.setProcessing(true));
    
    const response = yield call(updateDocumentGuarded, action.payload);
    const updated = response.data.updateDocumentGuarded;
    
    yield put(documentActions.setDocument(updated));
    yield call(clearFiles);
    
    const message = buildSuccessAlert('Document Updated');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to Update Document', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleRemoveDocument(action: PayloadAction<Document>): any
{
  let message : Alert;
  try
  {
    logger.log('handleRemoveDocument', action);
    yield put(uiActions.setProcessing(true));
    yield call(deleteFileFromS3, action.payload.fileKey);
    yield call(removeDocumentById, action.payload.id);
    yield put(documentActions.removeDocumentSuccess());
    message = buildSuccessAlert('Document Deleted');
  }
  catch (error)
  {
    logger.error(error);
    yield put(documentActions.removeDocumentFailure(printErrorMessage(error)));
    message = buildFriendlyErrorAlert('Failed to Delete Document', error)
  }
  finally { yield put(uiActions.setProcessing(false)); }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleMoveDocument(action: PayloadAction<MoveDocument>): any
{
  try
  {
    logger.log('handleMoveDocument:', action);
    yield put(uiActions.setProcessing(true));
    
    const doc: Document = yield appSelect(state => state.document.item);
    
    // 1. Copy S3 file
    const copyResponse = yield call(copyFileInS3, action.payload);
    
    // 2. Delete original S3 file
    yield call(deleteFileFromS3, action.payload.source);
    
    // 3. Clear collections from old box
    yield call(clearDocumentCollections, doc);
    
    // 4. Update DB with new fileKey and box
    const updateMe: Document = {
       ...doc,
       fileKey: copyResponse.key,
       box: action.payload.targetBox,
       documentBoxBoxId: action.payload.targetBox.id,
    };
    const response = yield call(updateDocumentGuarded, updateMe);
    const updated = response.data.updateDocumentGuarded;
    
    // 5. Update state
    yield put(documentActions.setDocument(updated));
    yield put(documentActions.moveDocumentSuccess());
    
    const message = buildSuccessAlert('Document Moved');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    yield put(documentActions.moveDocumentFailure(printErrorMessage(error)));
    const message = buildFriendlyErrorAlert('Failed to Move Document', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
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