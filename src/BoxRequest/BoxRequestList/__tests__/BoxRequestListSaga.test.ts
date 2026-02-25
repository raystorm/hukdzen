import { vi } from 'vitest';
import { when } from 'vitest-when';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';

import {
   getPendingBoxRequests,
   getPendingBoxRequestsForUserId, getPendingBoxRequestsForAdmin,
   handleGetPendingBoxRequestList,
} from '../BoxRequestListSaga';

import { boxRequestListActions } from '../BoxRequestListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';

import { emptyBoxRequestList } from '../BoxRequestListType';
import type { BoxRequestList } from '../BoxRequestListType';
import { emptyUser } from '../../../User/userType';
import type { User } from '../../../User/userType';
import mockBoxRequests from '../../../__utils__/__fixtures__/boxRequestList.json';
import { BoxRequest } from '../../../types/AmplifyTypes';

const client = generateClient();

const mockBoxRequestList: BoxRequestList = {
   ...emptyBoxRequestList,
   items: mockBoxRequests.items as BoxRequest[],
};

const mockUser: User = {
   ...emptyUser,
   id: 'e5b45f04-3b63-4140-bd81-f920185e0a61',
   isAdmin: false,
};

const mockAdminUser: User = {
   ...emptyUser,
   id: '99c73401-58b4-4298-859a-cfc9f969631c',
   isAdmin: true,
};

describe('BoxRequestListSaga', () =>
{
   afterEach(() => { vi.clearAllMocks(); });

   describe('getPendingBoxRequests', () => {
      test('calls GraphQL with PENDING filter', async () => {
         const mockResponse = { data: { listBoxRequests: mockBoxRequestList } };

         when(client.graphql).calledWith(expect.anything())
                             .thenResolve(mockResponse);

         const result = await getPendingBoxRequests();

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: { filter: { status: { eq: 'PENDING' } } },
         });
         expect(result).toEqual(mockResponse);
      });
   });

   describe('getPendingBoxRequestsForUserId', () => {
      test('calls GraphQL with user and PENDING filter', async () => {
         const mockResponse = { data: { listXbiis: mockBoxRequestList } };

         when(client.graphql).calledWith(expect.anything())
                             .thenResolve(mockResponse);

         const result = await getPendingBoxRequestsForUserId('user-123');

         expect(client.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
               filter: {
                  boxRequestCreatedById: { eq: 'user-123' },
                  status: { eq: 'PENDING' },
               },
            },
         });
         expect(result).toEqual(mockResponse);
      });
   });

   describe('getAllBoxRequestsForAdmin', () => {
      test('loads all pending box requests', async () => {
         const mockResponse = { data: { listBoxRequests: mockBoxRequestList } };

         await expectSaga(getPendingBoxRequestsForAdmin)
                 .provide([[call(getPendingBoxRequests), mockResponse]])
                 .put(boxRequestListActions.setAllBoxRequests(mockBoxRequestList))
                 .run();
      });

      test('handles error', async () => {
         const error = new Error('Failed to load');

         await expectSaga(getPendingBoxRequestsForAdmin)
                 .provide([[call(getPendingBoxRequests), Promise.reject(error)]])
                 .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
                 .run();
      });
   });

   describe('handleGetBoxRequestList', () => {
      test('admin user calls getAllBoxRequestsForAdmin', async () => {
         const action = boxRequestListActions.getAllPendingBoxRequests(mockAdminUser);
         const mockResponse = { data: { listBoxRequests: mockBoxRequestList } };

         await expectSaga(handleGetPendingBoxRequestList, action)
                 .provide([[call(getPendingBoxRequests), mockResponse]])
                 .put(boxRequestListActions.setAllBoxRequests(mockBoxRequestList))
                 .run();
      });

      test('non-admin user loads only their requests', async () => {
         const action = boxRequestListActions.getAllPendingBoxRequests(mockUser);
         const userRequests = {
            ...emptyBoxRequestList,
            items: [mockBoxRequests.items[0]],
         } as BoxRequestList;
         const mockResponse = { data: { listBoxRequests: userRequests } };

         await expectSaga(handleGetPendingBoxRequestList, action)
                 .provide([[call(getPendingBoxRequestsForUserId, mockUser.id),
                            mockResponse]])
                 .put(boxRequestListActions.setAllBoxRequests(userRequests))
                 .run();
      });

      test('handles error for non-admin user', async () => {
         const action = boxRequestListActions.getAllPendingBoxRequests(mockUser);
         const error = new Error('Failed to load user requests');

         await expectSaga(handleGetPendingBoxRequestList, action)
                 .provide([[call(getPendingBoxRequestsForUserId, mockUser.id),
                            Promise.reject(error)]])
                 .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
                 .run();
      });
   });
});
