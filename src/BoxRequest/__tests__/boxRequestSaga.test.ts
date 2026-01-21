import { vi } from 'vitest';
import { when } from 'vitest-when';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';

import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildFriendlyErrorAlert, buildSuccessAlert, buildWarningAlert } from '../../AlertBar/AlertBarTypes';
import { uiActions } from '../../UI/uiSlice';

import {
   getBoxRequestById, createBoxRequest, updateBoxRequest,
   approveBoxRequest, denyBoxRequest,
   handleGetBoxRequestById, handleCreateBoxRequest, handleUpdateBoxRequest,
   handleApproveBoxRequest, handleDenyBoxRequest,
   sendBoxRequestSubmittedNotification, sendTemplatedEmail,
} from '../boxRequestSaga';

import { getAdminUsers } from '../../User/UserList/userListSaga';

import type { User } from '../../User/userType';

import { boxRequestActions } from '../boxRequestSlice';
import type { BoxRequest } from '../boxRequestType';
import { BoxRequestStatus, emptyBoxRequest } from '../boxRequestType';
import { createBox } from '../../Box/boxSaga';
import { AccessLevel, BoxPurpose } from '../../types/AmplifyTypes';
import { emptyXbiis } from '../../Box/boxTypes';
import mockUsers from '../../data/userList.json';

const client = generateClient();

const testUser = mockUsers.items[0] as User;
const adminUser = mockUsers.items[2] as User;
const adminUserNoEmail = { ...adminUser, email: null };

const mockBoxRequest: BoxRequest = {
   ...emptyBoxRequest,
   id: 'request-123',
   requestedName: 'Test Group Box',
   requestReason: 'Need a box for testing',
   status: BoxRequestStatus.PENDING,
   createdBy: testUser,
   boxRequestCreatedById: testUser.id,
};

const mockBox = {
   ...emptyXbiis,
   id: 'box-456',
   name: 'Test Group Box',
   purpose: BoxPurpose.GROUP,
   defaultRole: AccessLevel.NONE,
   owner: testUser,
   xbiisOwnerId: testUser.id,
};

describe('boxRequestSaga', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   describe('getBoxRequestById', () => {
      test('calls GraphQL with correct parameters', async () => {
         const mockResponse = { data: { getBoxRequest: mockBoxRequest } };
         when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

         const result = await getBoxRequestById('request-123');

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: { id: 'request-123' }
         });
         expect(result).toEqual(mockResponse);
      });
   });

   describe('createBoxRequest', () => {
      test('calls GraphQL with correct parameters and generates UUID', async () => {
         const mockResponse = { data: { createBoxRequest: mockBoxRequest } };
         when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

         await createBoxRequest(mockBoxRequest);

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
               input: {
                  id: expect.any(String),
                  requestedName: mockBoxRequest.requestedName,
                  requestReason: mockBoxRequest.requestReason,
                  status: BoxRequestStatus.PENDING,
                  boxRequestCreatedById: mockBoxRequest.boxRequestCreatedById,
               }
            }
         });
      });
   });

   describe('updateBoxRequest', () => {
      test('calls GraphQL with updatable fields only', async () => {
         const mockResponse = { data: { updateBoxRequest: mockBoxRequest } };
         when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

         await updateBoxRequest(mockBoxRequest);

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
               input: {
                  id: mockBoxRequest.id,
                  requestedName: mockBoxRequest.requestedName,
                  requestReason: mockBoxRequest.requestReason,
                  denialReason: mockBoxRequest.denialReason,
               }
            }
         });
      });
   });

   describe('approveBoxRequest', () => {
      test('calls GraphQL with approval fields', async () => {
         const approvedRequest = {
            ...mockBoxRequest,
            status: BoxRequestStatus.APPROVED,
            boxRequestApprovedById: adminUser.id,
            boxRequestCreatedBoxId: mockBox.id,
         };
         const mockResponse = { data: { updateBoxRequest: approvedRequest } };
         when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

         await approveBoxRequest(approvedRequest);

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
               input: {
                  id: approvedRequest.id,
                  requestedName: approvedRequest.requestedName,
                  boxRequestApprovedById: approvedRequest.boxRequestApprovedById,
                  status: BoxRequestStatus.APPROVED,
                  boxRequestCreatedBoxId: approvedRequest.boxRequestCreatedBoxId,
               }
            }
         });
      });
   });

   describe('denyBoxRequest', () => {
      test('calls GraphQL with denial fields', async () => {
         const deniedRequest = {
            ...mockBoxRequest,
            status: BoxRequestStatus.DENIED,
            boxRequestApprovedById: adminUser.id,
            denialReason: 'Duplicate request',
         };
         const mockResponse = { data: { updateBoxRequest: deniedRequest } };
         when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

         await denyBoxRequest(deniedRequest);

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
               input: {
                  id: deniedRequest.id,
                  requestedName: deniedRequest.requestedName,
                  boxRequestApprovedById: deniedRequest.boxRequestApprovedById,
                  status: BoxRequestStatus.DENIED,
                  denialReason: deniedRequest.denialReason,
               }
            }
         });
      });
   });

   describe('handleGetBoxRequestById', () => {
      test('handles successful retrieval', async () => {
         const action = boxRequestActions.getBoxRequestById('request-123');
         const mockResponse = { data: { getBoxRequest: mockBoxRequest } };

         await expectSaga(handleGetBoxRequestById, action)
            .provide([[call(getBoxRequestById, 'request-123'), mockResponse]])
            .put(boxRequestActions.setBoxRequest(mockBoxRequest))
            .run();
      });

      test('handles error', async () => {
         const action = boxRequestActions.getBoxRequestById('request-123');
         const error = new Error('GraphQL Error');

         await expectSaga(handleGetBoxRequestById, action)
            .provide([[call(getBoxRequestById, 'request-123'), Promise.reject(error)]])
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });
   });

   describe('handleCreateBoxRequest', () => {
      test('handles successful creation with email notification', async () => {
         const action = boxRequestActions.createBoxRequest(mockBoxRequest);
         const mockResponse = { data: { createBoxRequest: mockBoxRequest } };
         const adminResponse = { data: { listUsers: { items: [adminUser] } } };

         await expectSaga(handleCreateBoxRequest, action)
            .provide([
               [call(createBoxRequest, mockBoxRequest), mockResponse],
               [call(getAdminUsers), adminResponse],
               [call(sendBoxRequestSubmittedNotification, mockBoxRequest), {}],
            ])
            .put(boxRequestActions.setBoxRequest(mockBoxRequest))
            .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxRequest Created')))
            .run();
      });

      test('handles creation with no admin emails', async () => {
         const action = boxRequestActions.createBoxRequest(mockBoxRequest);
         const mockResponse = { data: { createBoxRequest: mockBoxRequest } };
         const adminResponse = { data: { listUsers: { items: [] } } };

         await expectSaga(handleCreateBoxRequest, action)
            .provide([
               [call(createBoxRequest, mockBoxRequest), mockResponse],
               [call(getAdminUsers), adminResponse],
            ])
            .put(boxRequestActions.setBoxRequest(mockBoxRequest))
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxRequest Created')))
            .run();
      });

      test('handles creation error', async () => {
         const action = boxRequestActions.createBoxRequest(mockBoxRequest);
         const error = new Error('Creation failed');

         await expectSaga(handleCreateBoxRequest, action)
            .provide([[call(createBoxRequest, mockBoxRequest), Promise.reject(error)]])
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });
   });

   describe('handleUpdateBoxRequest', () => {
      test('handles successful update', async () => {
         const action = boxRequestActions.updateBoxRequest(mockBoxRequest);
         const mockResponse = { data: { updateBoxRequest: mockBoxRequest } };

         await expectSaga(handleUpdateBoxRequest, action)
            .provide([[call(updateBoxRequest, mockBoxRequest), mockResponse]])
            .put(boxRequestActions.setBoxRequest(mockBoxRequest))
            .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Updated')))
            .run();
      });

      test('handles update error', async () => {
         const action = boxRequestActions.updateBoxRequest(mockBoxRequest);
         const error = new Error('Update failed');

         await expectSaga(handleUpdateBoxRequest, action)
            .provide([[call(updateBoxRequest, mockBoxRequest), Promise.reject(error)]])
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });
   });

   describe('handleApproveBoxRequest', () => {
      test('handles successful approval with box creation', async () => {
         const action = boxRequestActions.approveBoxRequest(mockBoxRequest);
         const boxResponse = { data: { createXbiis: mockBox } };
         const approvedRequest = {
            ...mockBoxRequest,
            status: BoxRequestStatus.APPROVED,
            createdBox: mockBox,
            boxRequestCreatedBoxId: mockBox.id,
         };
         const approvalResponse = { data: { updateBoxRequest: approvedRequest } };

         const expectedBox = {
            ...emptyXbiis,
            name: mockBoxRequest.requestedName,
            purpose: BoxPurpose.GROUP,
            defaultRole: AccessLevel.NONE,
            owner: mockBoxRequest.createdBy,
            xbiisOwnerId: mockBoxRequest.boxRequestCreatedById,
         };

         await expectSaga(handleApproveBoxRequest, action)
            .provide([
               [call(createBox, expectedBox), boxResponse],
               [call(approveBoxRequest, approvedRequest), approvalResponse],
            ])
            .put(uiActions.setProcessing(true))
            .put(boxRequestActions.setBoxRequest(approvedRequest))
            .put(uiActions.setProcessing(false))
            .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Approved')))
            .run();
      });

      test('handles approval error', async () => {
         const action = boxRequestActions.approveBoxRequest(mockBoxRequest);
         const error = new Error('Approval failed');

         const expectedBox = {
            ...emptyXbiis,
            name: mockBoxRequest.requestedName,
            purpose: BoxPurpose.GROUP,
            defaultRole: AccessLevel.NONE,
            owner: mockBoxRequest.createdBy,
            xbiisOwnerId: mockBoxRequest.boxRequestCreatedById,
         };

         await expectSaga(handleApproveBoxRequest, action)
            .provide([[call(createBox, expectedBox), Promise.reject(error)]])
            .put(uiActions.setProcessing(true))
            .put(uiActions.setProcessing(false))
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });
   });

   describe('handleDenyBoxRequest', () => {
      test('handles successful denial', async () => {
         const deniedRequest = {
            ...mockBoxRequest,
            status: BoxRequestStatus.DENIED,
            denialReason: 'Duplicate request',
         };
         const action = boxRequestActions.denyBoxRequest(deniedRequest);
         const mockResponse = { data: { updateBoxRequest: deniedRequest } };

         await expectSaga(handleDenyBoxRequest, action)
            .provide([[call(denyBoxRequest, deniedRequest), mockResponse]])
            .put(boxRequestActions.setBoxRequest(deniedRequest))
            .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Denied')))
            .run();
      });

      test('handles denial error', async () => {
         const action = boxRequestActions.denyBoxRequest(mockBoxRequest);
         const error = new Error('Denial failed');

         await expectSaga(handleDenyBoxRequest, action)
            .provide([[call(denyBoxRequest, mockBoxRequest), Promise.reject(error)]])
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });
   });

   describe('sendBoxRequestSubmittedNotification', () => {
      test('sends email to admin users', async () => {
         const adminResponse = { data: { listUsers: { items: [adminUser] } } };

         await expectSaga(sendBoxRequestSubmittedNotification, mockBoxRequest)
            .provide([[call(getAdminUsers), adminResponse]])
            .call(sendTemplatedEmail, [adminUser.email], 'BOX_REQUEST_SUBMITTED', {
               requesterName: testUser.name,
               boxName: mockBoxRequest.requestedName,
               reason: mockBoxRequest.requestReason,
               requestListUrl: `${window.location.origin}/box/request/list`,
               requestDetailUrl: `${window.location.origin}/box/request/${mockBoxRequest.id}`
            })
            .run();
      });

      test('filters out admins without email addresses', async () => {
         const adminResponse = { data: { listUsers: { items: [adminUser, adminUserNoEmail] } } };

         await expectSaga(sendBoxRequestSubmittedNotification, mockBoxRequest)
            .provide([[call(getAdminUsers), adminResponse]])
            .call(sendTemplatedEmail, [adminUser.email], 'BOX_REQUEST_SUBMITTED', expect.any(Object))
            .run();
      });

      test('shows warning and returns early when no admin emails found', async () => {
         const adminResponse = { data: { listUsers: { items: [] } } };

         await expectSaga(sendBoxRequestSubmittedNotification, mockBoxRequest)
            .provide([[call(getAdminUsers), adminResponse]])
            .put(alertBarActions.DisplayAlertBox(
               buildWarningAlert('BoxRequest created but no admin emails found for notification')
            ))
            .not.call(sendTemplatedEmail)
            .run();
      });

      test('shows warning when all admins have no email', async () => {
         const adminResponse = { data: { listUsers: { items: [adminUserNoEmail] } } };

         await expectSaga(sendBoxRequestSubmittedNotification, mockBoxRequest)
            .provide([[call(getAdminUsers), adminResponse]])
            .put(alertBarActions.DisplayAlertBox(
               buildWarningAlert('BoxRequest created but no admin emails found for notification')
            ))
            .not.call(sendTemplatedEmail)
            .run();
      });
   });
});
