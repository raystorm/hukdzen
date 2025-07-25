import { call, put } from 'redux-saga/effects';
import { when } from 'jest-when';
import { generateClient } from '@aws-amplify/api';
import { copy, remove } from '@aws-amplify/storage';

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
  createDocument,
  updateDocument,
  removeDocumentById,
  copyFileInS3,
  deleteFileFromS3
} from '../documentSaga';

import { documentActions } from '../documentSlice';
import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import { emptyDocumentDetails } from '../initialDocumentDetails';
import { DocumentDetails, MoveDocument } from '../DocumentTypes';
import { emptyUser, User } from '../../User/userType';
import { emptyAuthor } from '../../Author/AuthorType';
import { emptyXbiis } from '../../Box/boxTypes';
import { getAllBoxUsersForUserId } from '../../BoxUser/BoxUserList/BoxUserListSaga';
import { clearFiles } from '../../components/widgets/AWSFileUploader';

jest.mock('@aws-amplify/api');
jest.mock('@aws-amplify/storage');
jest.mock('../../BoxUser/BoxUserList/BoxUserListSaga');
jest.mock('../../components/widgets/AWSFileUploader');
jest.mock('../docList/documentListSaga');

const client = generateClient();

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
  box: { ...emptyXbiis, id: 'box-id' },
  version: 1
};

describe('documentSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocumentById', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { getDocumentDetails: mockDocument } };
      when(client.graphql).mockResolvedValue(mockResponse);

      const result = await getDocumentById('doc-id');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { id: 'doc-id' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createDocument', () => {
    test('throws error for negative version', () => {
      const invalidDoc = { ...mockDocument, version: -1 };
      
      expect(() => createDocument(invalidDoc)).toThrow('Document version cannot be negative!');
    });

    test('calls GraphQL with correct parameters for valid document', async () => {
      const mockResponse = { data: { createDocumentDetails: mockDocument } };
      when(client.graphql).mockResolvedValue(mockResponse);

      await createDocument(mockDocument);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { input: expect.objectContaining({ id: expect.any(String) }) }
      });
    });
  });

  describe('handleGetDocumentById', () => {
    test('handles admin user successfully', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const mockResponse = { data: { getDocumentDetails: mockDocument } };
      
      const gen = handleGetDocumentById(action);
      
      // Mock appSelect to return admin user
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect call
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      expect(gen.next(mockResponse).value).toEqual(put(documentActions.setDocument(mockDocument)));
      expect(gen.next().done).toBe(true);
    });

    test('handles non-admin user successfully', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const mockBoxUsersResponse = { data: { listBoxUsers: [] } };
      const mockDocResponse = { data: { listDocumentDetails: { items: [mockDocument] } } };
      
      const gen = handleGetDocumentById(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect call
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-id'));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(expect.any(Object)); // getDocumentByFileKeyIfAllowed call
      expect(gen.next(mockDocResponse).value).toEqual(put(documentActions.setDocument(mockDocument)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const error = new Error('GraphQL Error');
      
      const gen = handleGetDocumentById(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect call
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET Document: ${JSON.stringify(error)}`)))
      );
    });

    test('handles network timeout error', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleGetDocumentById(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET Document: ${JSON.stringify(timeoutError)}`)))
      );
    });
  });

  describe('handleCreateDocument', () => {
    test('handles successful creation', async () => {
      const action = documentActions.createDocument(mockDocument);
      const mockResponse = { data: { createDocumentDetails: mockDocument } };
      
      const gen = handleCreateDocument(action);
      
      expect(gen.next().value).toEqual(call(createDocument, mockDocument));
      expect(gen.next(mockResponse).value).toEqual(put(documentActions.setDocument(expect.objectContaining({
        docOwner: mockDocument.docOwner,
        box: mockDocument.box
      }))));
      expect(gen.next().value).toEqual(call(clearFiles));
      expect(gen.next().value).toEqual(put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Created'))));
      expect(gen.next().done).toBe(true);
    });

    test('handles creation error', async () => {
      const action = documentActions.createDocument(mockDocument);
      const error = new Error('Creation failed');
      
      const gen = handleCreateDocument(action);
      
      expect(gen.next().value).toEqual(call(createDocument, mockDocument));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Create Document: ${JSON.stringify(error)}`)))
      );
    });

    test('handles DynamoDB throttling error', async () => {
      const action = documentActions.createDocument(mockDocument);
      const throttleError = {
        errors: [{ errorType: 'DynamoDB:ProvisionedThroughputExceededException' }]
      };
      
      const gen = handleCreateDocument(action);
      
      expect(gen.next().value).toEqual(call(createDocument, mockDocument));
      expect(gen.throw(throttleError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Create Document: ${JSON.stringify(throttleError)}`)))
      );
    });
  });

  describe('handleUpdateDocumentMetadata', () => {
    test('handles successful update', async () => {
      const action = documentActions.updateDocumentMetadata(mockDocument);
      const mockResponse = { data: { updateDocumentDetails: mockDocument } };
      
      const gen = handleUpdateDocumentMetadata(action);
      
      expect(gen.next().value).toEqual(call(updateDocument, mockDocument));
      expect(gen.next(mockResponse).value).toEqual(put(documentActions.setDocument(mockDocument)));
      expect(gen.next().value).toEqual(call(clearFiles));
      expect(gen.next().value).toEqual(put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Updated'))));
      expect(gen.next().done).toBe(true);
    });

    test('handles update error', async () => {
      const action = documentActions.updateDocumentMetadata(mockDocument);
      const error = new Error('Update failed');
      
      const gen = handleUpdateDocumentMetadata(action);
      
      expect(gen.next().value).toEqual(call(updateDocument, mockDocument));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Update Document: ${JSON.stringify(error)}`)))
      );
    });
  });

  describe('handleRemoveDocument', () => {
    test('handles successful removal', async () => {
      const action = documentActions.removeDocument(mockDocument);
      const mockResponse = { data: { deleteDocumentDetails: mockDocument } };
      
      const gen = handleRemoveDocument(action);
      
      expect(gen.next().value).toEqual(call(deleteFileFromS3, mockDocument.fileKey));
      expect(gen.next().value).toEqual(call(removeDocumentById, mockDocument.id));
      expect(gen.next(mockResponse).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Deleted')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles S3 deletion error', async () => {
      const action = documentActions.removeDocument(mockDocument);
      const s3Error = new Error('S3 deletion failed');
      
      const gen = handleRemoveDocument(action);
      
      expect(gen.next().value).toEqual(call(deleteFileFromS3, mockDocument.fileKey));
      expect(gen.throw(s3Error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(s3Error)}`)))
      );
    });
  });

  describe('handleMoveDocument', () => {
    const moveAction: MoveDocument = {
      source: 'old-key',
      destination: 'new-key'
    };

    test('handles successful move', async () => {
      const action = documentActions.moveDocument(moveAction);
      const copyResponse = { fileKey: 'new-key' };
      
      const gen = handleMoveDocument(action);
      
      expect(gen.next().value).toEqual(call(copyFileInS3, moveAction));
      expect(gen.next(copyResponse).value).toEqual(call(deleteFileFromS3, moveAction.source));
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect
      expect(gen.next(mockDocument).value).toEqual(
        put(documentActions.updateDocumentMetadata({ ...mockDocument, fileKey: 'new-key' }))
      );
      expect(gen.next().value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Document Moved')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles S3 copy failure - does not delete original', async () => {
      const action = documentActions.moveDocument(moveAction);
      const copyError = new Error('S3 copy failed');
      
      const gen = handleMoveDocument(action);
      
      expect(gen.next().value).toEqual(call(copyFileInS3, moveAction));
      expect(gen.throw(copyError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(copyError)}`)))
      );
      // Should not proceed to delete original file
    });

    test('handles access denied error', async () => {
      const action = documentActions.moveDocument(moveAction);
      const accessError = new Error('Access Denied');
      accessError.name = 'AccessDenied';
      
      const gen = handleMoveDocument(action);
      
      expect(gen.next().value).toEqual(call(copyFileInS3, moveAction));
      expect(gen.throw(accessError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Delete Document: ${JSON.stringify(accessError)}`)))
      );
    });
  });

  describe('error recovery scenarios', () => {
    test('handles malformed GraphQL response', async () => {
      const action = documentActions.getDocumentById('doc-id');
      const malformedResponse = { data: null };
      
      const gen = handleGetDocumentById(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getDocumentById, 'doc-id'));
      
      // Should handle gracefully when data is null
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });

    test('handles concurrent update conflicts', async () => {
      const action = documentActions.updateDocumentMetadata(mockDocument);
      const conflictError = {
        errors: [{ errorType: 'DynamoDB:ConditionalCheckFailedException' }]
      };
      
      const gen = handleUpdateDocumentMetadata(action);
      
      expect(gen.next().value).toEqual(call(updateDocument, mockDocument));
      expect(gen.throw(conflictError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Update Document: ${JSON.stringify(conflictError)}`)))
      );
    });
  });
});