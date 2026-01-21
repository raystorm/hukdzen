import { describe, test, expect } from 'vitest';
import BoxRequestListSlice,
      {
         boxRequestListActions, boxRequestListReducer,
      } from '../BoxRequestListSlice';
import { emptyBoxRequestList } from '../BoxRequestListType';
import type { BoxRequestList } from '../BoxRequestListType';
import { boxRequestActions } from '../../boxRequestSlice';
import { BoxRequestStatus } from '../../boxRequestType';
import type { BoxRequest } from '../../boxRequestType';
import type { User } from '../../../User/userType';
import mockUsers from '../../../data/userList.json';
import mockBRL from '../../../data/boxRequestList.json';

const mockBoxRequests = mockBRL as BoxRequestList;

const testUser = mockUsers.items[0] as User;
const adminUser = mockUsers.items[2] as User;

const mockBoxRequestList: BoxRequestList = {
   ...emptyBoxRequestList,
   items: mockBoxRequests.items,
};

const newRequest: BoxRequest = {
   __typename: 'BoxRequest',
   id: 'new-request',
   requestedName: 'New Box',
   requestReason: 'Testing',
   status: BoxRequestStatus.PENDING,
   createdBy: testUser,
   boxRequestCreatedById: testUser.id,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

describe('BoxRequestListSlice', () => {
   test('has correct name', () => {
      expect(BoxRequestListSlice.name).toBe('boxRequestList');
   });

   test('has correct initial state', () => {
      expect(BoxRequestListSlice.getInitialState()).toEqual(emptyBoxRequestList);
   });

   describe('reducers', () => {
      test('getAllBoxRequests returns current state', () => {
         const state = boxRequestListReducer(
            mockBoxRequestList,
            boxRequestListActions.getAllPendingBoxRequests(testUser)
         );
         expect(state).toEqual(mockBoxRequestList);
      });

      test('setAllBoxRequests updates state', () => {
         const state = boxRequestListReducer(
            emptyBoxRequestList,
            boxRequestListActions.setAllBoxRequests(mockBoxRequestList)
         );
         expect(state).toEqual(mockBoxRequestList);
      });
   });

   describe('extraReducers', () => {
      test('createBoxRequest adds item to list', () => {
         const state = boxRequestListReducer(
            mockBoxRequestList,
            boxRequestActions.createBoxRequest(newRequest)
         );
         expect(state.items).toHaveLength(mockBoxRequestList.items.length + 1);
         expect(state.items).toContain(newRequest);
      });

      test('updateBoxRequest updates existing item', () => {
         const updatedRequest = {
            ...mockBoxRequests.items[0],
            requestedName: 'Updated Name',
         } as BoxRequest;
         const state = boxRequestListReducer(
            mockBoxRequestList,
            boxRequestActions.updateBoxRequest(updatedRequest)
         );
         const found = state.items.find(br => br?.id === updatedRequest.id);
         expect(found?.requestedName).toBe('Updated Name');
      });

      test('updateBoxRequest does nothing if item not found', () => {
         const nonExistent = { ...newRequest, id: 'does-not-exist' };
         const state = boxRequestListReducer(
            mockBoxRequestList,
            boxRequestActions.updateBoxRequest(nonExistent)
         );
         expect(state.items).toHaveLength(mockBoxRequestList.items.length);
      });

      test('approveBoxRequest removes item from list', () => {
         const approvedRequest = {
            ...mockBoxRequests.items[0],
            status: BoxRequestStatus.APPROVED,
         } as BoxRequest;
         const state = boxRequestListReducer(
            mockBoxRequestList,
            boxRequestActions.approveBoxRequest(approvedRequest)
         );
         expect(state.items).toHaveLength(mockBoxRequestList.items.length - 1);
         expect(state.items.find(br => br?.id === approvedRequest.id)).toBeUndefined();
      });

      test('denyBoxRequest removes item from list', () => {
         const deniedRequest = {
            ...mockBoxRequests.items[0],
            status: BoxRequestStatus.DENIED,
         } as BoxRequest;
         const state = boxRequestListReducer(
            mockBoxRequestList,
            boxRequestActions.denyBoxRequest(deniedRequest)
         );
         expect(state.items).toHaveLength(mockBoxRequestList.items.length - 1);
         expect(state.items.find(br => br?.id === deniedRequest.id)).toBeUndefined();
      });
   });
});
