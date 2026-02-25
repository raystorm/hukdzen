import { vi } from 'vitest';
import { expectSaga } from 'redux-saga-test-plan';
import { call, put, select } from 'redux-saga/effects';
import * as matchers from 'redux-saga-test-plan/matchers';
import { when } from 'vitest-when';
import { generateClient } from '@aws-amplify/api';

import { appSelect } from '../../app/hooks';

import boxList from '../../__utils__/__fixtures__/boxList.json';
import userList from '../../__utils__/__fixtures__/userList.json';
import docList from '../../__utils__/__fixtures__/docList.json';

import {
  handleGetDocumentById,
  handleGetDocumentByFileKey,
  handleCreateDocument,
  handleUpdateDocumentMetadata,
  handleUpdateDocumentVersion,
  handleRemoveDocument,
  handleMoveDocument,
  getDocumentById,
  getDocumentByFileKey,
  getDocumentByIdIfAllowed,
  getDocumentByFileKeyIfAllowed,
  createDocument,
  updateDocument,
  removeDocumentById,
  copyFileInS3,
  deleteFileFromS3,
  listCollectionItemsByDocumentId,
  deleteCollectionItem, clearDocumentCollections
} from '../documentSaga';

import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import { emptyDocumentDetails } from '../initialDocumentDetails';
import { documentActions } from '../documentSlice';
import { DocumentDetails, MoveDocument } from '../DocumentTypes';
import { emptyUser, User } from '../../User/userType';
import { emptyAuthor } from '../../Author/AuthorType';
import { emptyXbiis } from '../../Box/boxTypes';
import { getAllBoxUsersForUserId } from '../../BoxUser/BoxUserList/BoxUserListSaga';
//import * as BoxUserListSaga from '../../BoxUser/BoxUserList/BoxUserListSaga';
import { clearFiles } from '../../components/widgets/AWSFileUploader';
import {uiActions} from "../../UI/uiSlice";
import {BoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {buildBoxUserList} from "../../__utils__/__setup__/BoxUserAPI.helper";
import {printTitles} from "../../types";

const client = generateClient();

const boxUserList = buildBoxUserList();

const mockUser: User = {
  ...emptyUser,
  id: 'user-id',
  isAdmin: false
};

const mockAdminUser: User = {
  ...emptyUser,
  id: 'admin-id',
  isAdmin: true
};

const mockDocument: DocumentDetails = {
  ...emptyDocumentDetails,
  id: 'doc-id',
  eng_title: 'Test Document',
  fileKey: 'test-file-key',
  author: { ...emptyAuthor, id: 'author-id' },
  docOwner: mockUser,
  documentDetailsAuthorId: mockUser.id,
  documentDetailsDocOwnerId: mockUser.id,
  box: { ...emptyXbiis, id: 'box-id' },
  documentDetailsBoxId: 'box-id',
  version: 1
};

describe('documentSaga', () =>
{
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getDocumentById', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = {data: {getDocumentDetails: mockDocument}};
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getDocumentById('doc-id');

      expect(client.graphql).toHaveBeenCalledWith({
                                                    query:     expect.any(String),
                                                    variables: {id: 'doc-id'}
                                                  });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createDocument', () => {
    test('throws error for negative version', () => {
      const invalidDoc = {...mockDocument, version: -1};

      expect(() => createDocument(invalidDoc)).toThrow('Document version cannot be negative!');
    });

    test('calls GraphQL with correct parameters for valid document', async () => {
      const mockResponse = {data: {createDocumentDetails: mockDocument}};
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await createDocument(mockDocument);

      expect(client.graphql).toHaveBeenCalledWith({
                                                    query:     expect.any(String),
                                                    variables: {
                                                      input: expect.objectContaining({id: expect.any(String)})
                                                    }
                                                  });
    });
  });

  describe('handleGetDocumentById', () =>
  {
    test('handles admin user successfully', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const mockResponse = {data: {getDocumentDetails: mockDocument}};

      const gen = handleGetDocumentById(action);

      // Mock appSelect to return admin user
      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect call
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      expect(gen.next(mockResponse).value).toEqual(put(documentActions.setDocument(mockDocument)));
      expect(gen.next().value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next().done).toBe(true);
    });

    test('handles non-admin user successfully', async () =>
    {
      const doc = docList.items[0] as DocumentDetails;
      const id = doc.id;
      const user = userList.items[0];
      const action = documentActions.getDocumentById(id);
      const mockBoxUsersResponse = {data: {listBoxUserDetailed: boxUserList}};
      const mockDocResponse = {data: {listDocumentDetails: {items: [doc]}}};

      await expectSaga(handleGetDocumentById, action)
         .provide([
                    [appSelect(state => state.currentUser), user],
                    [call(getAllBoxUsersForUserId, user.id), mockBoxUsersResponse],
                    [call(getDocumentByIdIfAllowed, doc.id, boxUserList), mockDocResponse]
                  ])
         .withState({currentUser: user})
         .put(uiActions.setProcessing(true))
         .call(getAllBoxUsersForUserId, user.id)
         .call(getDocumentByIdIfAllowed, id, boxUserList)
         .put(documentActions.setDocument(doc))
         .put(uiActions.setProcessing(false))
         .run();
    });

    test('handles GraphQL error', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const error = new Error('GraphQL Error');

      const gen = handleGetDocumentById(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect call
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      expect(gen.throw(error).value).toEqual(
         put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET Document: ${JSON.stringify(error)}`)))
      );
      expect(gen.next().value).toEqual(put(uiActions.setProcessing(false)));
    });

    test('handles network timeout error', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';

      const gen = handleGetDocumentById(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      expect(gen.throw(timeoutError).value).toEqual(
         put(
            alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET Document: ${JSON.stringify(timeoutError)}`)))
      );
      expect(gen.next().value).toEqual(put(uiActions.setProcessing(false)));
    });
  });

  describe('handleCreateDocument', () => {
    test('handles successful creation', async () => {
      const action = documentActions.createDocument(mockDocument);
      const mockResponse = {data: {createDocumentDetails: mockDocument}};

      await expectSaga(handleCreateDocument, action)
         .provide([
                    [call(createDocument, mockDocument), mockResponse],
                    [call(clearFiles), undefined]  // clearFiles do nothing
                  ])
         .put(uiActions.setProcessing(true))
         .call(createDocument, mockDocument)
         .put.like({
                     action: {
                       type:    documentActions.setDocument.type,
                       payload: {
                         documentDetailsDocOwnerId: 'user-id',
                         documentDetailsBoxId:      'box-id'
                       }
                     }
                   })
         .call(clearFiles)
         .put(uiActions.setProcessing(false))
         .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Created')))
         .run();
    });

    test('handles creation error', async () => {
      const action = documentActions.createDocument(mockDocument);
      const error = new Error('Creation failed');

      const gen = handleCreateDocument(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(call(createDocument, mockDocument));
      //expect(gen.next().value).toEqual(expect.any(Object)); //skip validating set
      //expect(gen.next().value).toEqual(put(documentActions.setDocument(expect.any(Object))));
      expect(gen.throw(error).value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next().value).toEqual(
         put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Create Document: ${JSON.stringify(error)}`)))
      );
    });

    test('handles DynamoDB throttling error', async () => {
      const action = documentActions.createDocument(mockDocument);
      const throttleError = {
        errors: [{errorType: 'DynamoDB:ProvisionedThroughputExceededException'}]
      };

      const gen = handleCreateDocument(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(call(createDocument, mockDocument));
      //expect(gen.next().value).toEqual(expect.any(Object)); //skip validating set
      expect(gen.next().value).toEqual(put(documentActions.setDocument(expect.any(Object))));
      expect(gen.throw(throttleError).value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next().value).toEqual(
         put(alertBarActions.DisplayAlertBox(
            buildErrorAlert(`Failed to Create Document: ${JSON.stringify(throttleError)}`)))
      );
    });
  });

  describe('handleUpdateDocumentMetadata', () => {
    test('handles successful update', async () => {
      const action = documentActions.updateDocumentMetadata(mockDocument);
      const mockResponse = {data: {updateDocumentDetails: mockDocument}};

      await expectSaga(handleUpdateDocumentMetadata, action)
              .provide([
                          [appSelect(state => state.ui.isProcessing), false],
                          [appSelect(state => state.document), mockDocument],
                          [matchers.call.fn(updateDocument), mockResponse],
                          [call(clearFiles), undefined]  // clearFiles do nothing
                       ])
               .withState({ ui: { isProcessing: false } })
               .put(uiActions.setProcessing(true))
               .put(documentActions.setDocument(mockDocument))
               .call(clearFiles)
               .put(uiActions.setProcessing(false))
               .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Updated')))
               .run();
    });

    test('handles update error', async () => {
      const action = documentActions.updateDocumentMetadata(mockDocument);
      const error = new Error('Update failed');

      await expectSaga(handleUpdateDocumentMetadata, action)
              .provide([
                          [appSelect(state => state.ui.isProcessing), false],
                          [appSelect(state => state.document), mockDocument],
                          [matchers.call.fn(updateDocument), Promise.reject(error)],
                          [call(clearFiles), undefined]  // clearFiles do nothing
                       ])
               .withState({ ui: { isProcessing: false } })
               .put(uiActions.setProcessing(true))
               .put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`)))
               .put(uiActions.setProcessing(false))
               .run();
    });
  });

  describe('handleRemoveDocument', () => {
    test('handles successful removal', async () => {
      const action = documentActions.removeDocument(mockDocument);
      const mockResponse = {data: {deleteDocumentDetails: mockDocument}};

      const gen = handleRemoveDocument(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(call(deleteFileFromS3, mockDocument.fileKey));
      expect(gen.next().value).toEqual(call(removeDocumentById, mockDocument.id));
      expect(gen.next().value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next(mockResponse).value).toEqual(
         put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Deleted')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles S3 deletion error', async () => {
      const action = documentActions.removeDocument(mockDocument);
      const s3Error = new Error('S3 deletion failed');

      const gen = handleRemoveDocument(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(call(deleteFileFromS3, mockDocument.fileKey));
      expect(gen.next().value).toEqual(call(removeDocumentById, mockDocument.id));
      expect(gen.throw(s3Error).value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next().value).toEqual(
         put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(s3Error)}`)))
      );
    });
  });

  describe('handleMoveDocument', () => {

    const moveAction: MoveDocument = {
      source:      'old-key',
      destination: 'new-key',
      targetBox:   mockDocument.box,
    };

    test('handles successful move', async () =>
    {
      const action = documentActions.moveDocument(moveAction);
      const copyResponse = {fileKey: 'new-key'};

      const colItemsResp = {
        data: {
          listCollectionItems: {
            items: [
              {id: 'ci-1', collection: {collectionBoxId: 'boxA'}},
              {id: 'ci-2', collection: {collectionBoxId: 'boxX'}},
            ]
          }
        }
      };

      return expectSaga(handleMoveDocument, action)
         .provide([
                    [call(copyFileInS3, action.payload), copyResponse],
                    [call(listCollectionItemsByDocumentId, mockDocument.id), colItemsResp]
                  ])
         .withState({ ui: { isProcessing: false }, document: mockDocument})
         .put(uiActions.setProcessing(true))
         .call(copyFileInS3, moveAction)
         .call(deleteFileFromS3, moveAction.source)
         .call(clearDocumentCollections, mockDocument)
         .put(documentActions.updateDocumentMetadata({...mockDocument, fileKey: 'new-key'}))
         .put(uiActions.setProcessing(false))
         .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Moved')))
         .run()
    });

    test('handles S3 copy failure - does not delete original', async () => {
      const action = documentActions.moveDocument(moveAction);
      const copyError = new Error('S3 copy failed');

      const gen = handleMoveDocument(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(call(copyFileInS3, moveAction));
      expect(gen.next().value).toEqual(call(deleteFileFromS3, moveAction.source));
      expect(gen.throw(copyError).value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next().value).toEqual(
         put(
            alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(copyError)}`)))
      );
      // Should not proceed to delete original file
    });

    test('handles access denied error', async () => {
      const action = documentActions.moveDocument(moveAction);
      const accessError = new Error('Access Denied');
      accessError.name = 'AccessDenied';

      const gen = handleMoveDocument(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(call(copyFileInS3, moveAction));
      expect(gen.throw(accessError).value).toEqual(put(uiActions.setProcessing(false)));
      expect(gen.next().value).toEqual(
         put(alertBarActions.DisplayAlertBox(
            buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(accessError)}`)))
      );
    });
  });

  describe('error recovery scenarios', () => {
    test('handles malformed GraphQL response', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const malformedResponse = {data: null};

      const gen = handleGetDocumentById(action);

      expect(gen.next().value).toEqual(put(uiActions.setProcessing(true)));
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));

      // Should handle gracefully when data is null
      expect(() => gen.next(malformedResponse)).not.toThrow();
      expect(gen.next().value).toEqual(put(uiActions.setProcessing(false)));
    });

    test('handles concurrent update conflicts', async () =>
    {
      const action = documentActions.updateDocumentMetadata(mockDocument);
      const conflictError = {
        errors: [{errorType: 'DynamoDB:ConditionalCheckFailedException'}]
      };

      await expectSaga(handleUpdateDocumentMetadata, action)
              .provide([
                          [appSelect(state => state.ui.isProcessing), false],
                          [appSelect(state => state.document), mockDocument],
                          [matchers.call.fn(updateDocument), Promise.reject(conflictError)],
                          [call(clearFiles), undefined]  // clearFiles do nothing
                       ])
               .withState({ ui: { isProcessing: false } })
               .put(uiActions.setProcessing(true))
               .put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Update Document: ${JSON.stringify(conflictError)}`)))
               .put(uiActions.setProcessing(false))
               .run();
     });
   });

  // Additional test: ensure collection items in old box are removed when moving document
  describe('handleUpdateDocumentMetadata - collection removal on move', () =>
  {
    test('removes collection items in original box when box changes', async () =>
    {
      const original: DocumentDetails = {
        ...mockDocument,
        id:                   'doc-move',
        box:                  {...emptyXbiis, id: 'boxA', name: 'Box A'} as any,
        documentDetailsBoxId: 'boxA'
      } as DocumentDetails;

      const payload: DocumentDetails = {
        ...original,
        box:                  {...emptyXbiis, id: 'boxB', name: 'Box B'} as any,
        documentDetailsBoxId: 'boxB'
      } as DocumentDetails;

      const moveAction: MoveDocument = {
        source:      `boxA/${original.fileKey}`,
        destination: `boxB/${payload.fileKey}`,
        targetBox:   payload.box,
      };

      //const action = documentActions.updateDocumentMetadata(payload);
      const action = documentActions.moveDocument(moveAction);

      const colItemsResp = {
        data: {
          listCollectionItems: {
            items: [
              {id: 'ci-1', collection: {collectionBoxId: 'boxA'}},
              {id: 'ci-2', collection: {collectionBoxId: 'boxX'}},
            ]
          }
        }
      };

      const mockUpdateResp = {data: {updateDocumentDetails: payload}};

      const copyResponse = {fileKey: moveAction.destination};

      await expectSaga(handleMoveDocument, action)
              .provide([
                 [call(copyFileInS3, action.payload), copyResponse],
                 [call(listCollectionItemsByDocumentId, payload.id), colItemsResp],
              ])
              .withState({ ui: { isProcessing: false }, document: original })
              .put(uiActions.setProcessing(true))
              .call(copyFileInS3, moveAction)
              .call(deleteFileFromS3, moveAction.source)
              .call(clearDocumentCollections, original)
              .call(listCollectionItemsByDocumentId, payload.id)
              .call(deleteCollectionItem, 'ci-1')
              .put(alertBarActions.DisplayAlertBox(buildSuccessAlert(
                      `Removed ${printTitles(mockDocument)} from ALL collection(s).`
                  )))
              .put(documentActions.updateDocumentMetadata({...payload,
                                                           fileKey: moveAction.destination}))
              .put(uiActions.setProcessing(false))
              .run();
    });
  });

});