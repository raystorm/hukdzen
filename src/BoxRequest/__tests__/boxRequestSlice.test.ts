import { describe, test, expect } from 'vitest';
import boxRequestSlice, { boxRequestActions, boxRequestReducer } from '../boxRequestSlice';
import { emptyBoxRequest, BoxRequestStatus } from '../boxRequestType';
import type { BoxRequest } from '../boxRequestType';
import mockUsers from '../../data/userList.json';

const testUser = mockUsers.items[0];

const mockBoxRequest: BoxRequest = {
   ...emptyBoxRequest,
   id: 'request-123',
   requestedName: 'Test Box',
   requestReason: 'Testing',
   status: BoxRequestStatus.PENDING,
   createdBy: testUser,
   boxRequestCreatedById: testUser.id,
};

describe('boxRequestSlice', () => {
   test('has correct name', () => {
      expect(boxRequestSlice.name).toBe('boxRequest');
   });

   test('has correct initial state', () => {
      expect(boxRequestSlice.getInitialState()).toEqual(emptyBoxRequest);
   });

   describe('actions', () => {
      test('getBoxRequestById returns current state', () => {
         const state = boxRequestReducer(mockBoxRequest, boxRequestActions.getBoxRequestById('request-123'));
         expect(state).toEqual(mockBoxRequest);
      });

      test('setBoxRequest updates state', () => {
         const state = boxRequestReducer(emptyBoxRequest, boxRequestActions.setBoxRequest(mockBoxRequest));
         expect(state).toEqual(mockBoxRequest);
      });

      test('createBoxRequest updates state', () => {
         const state = boxRequestReducer(emptyBoxRequest, boxRequestActions.createBoxRequest(mockBoxRequest));
         expect(state).toEqual(mockBoxRequest);
      });

      test('updateBoxRequest updates state', () => {
         const updatedRequest = { ...mockBoxRequest, requestedName: 'Updated Name' };
         const state = boxRequestReducer(mockBoxRequest, boxRequestActions.updateBoxRequest(updatedRequest));
         expect(state).toEqual(updatedRequest);
      });

      test('approveBoxRequest updates state', () => {
         const approvedRequest = { ...mockBoxRequest, status: BoxRequestStatus.APPROVED };
         const state = boxRequestReducer(mockBoxRequest, boxRequestActions.approveBoxRequest(approvedRequest));
         expect(state).toEqual(approvedRequest);
      });

      test('denyBoxRequest updates state', () => {
         const deniedRequest = { ...mockBoxRequest, status: BoxRequestStatus.DENIED };
         const state = boxRequestReducer(mockBoxRequest, boxRequestActions.denyBoxRequest(deniedRequest));
         expect(state).toEqual(deniedRequest);
      });
   });
});
