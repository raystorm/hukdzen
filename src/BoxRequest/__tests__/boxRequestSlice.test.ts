import { describe, test, expect } from 'vitest';
import boxRequestSlice, { boxRequestActions, boxRequestReducer } from '../boxRequestSlice';
import { emptyBoxRequest, BoxRequestStatus, initialBoxRequestState } from '../boxRequestType';
import type { BoxRequest } from '../boxRequestType';
import mockUsers from '../../__utils__/__fixtures__/userList.json';

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
      expect(boxRequestSlice.getInitialState()).toEqual(initialBoxRequestState);
   });

   describe('getBoxRequestById actions', () => {
      test('Request sets error to null', () => {
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: 'previous error' },
            boxRequestActions.getBoxRequestById('request-123')
         );
         expect(state.error).toBeNull();
      });

      test('Success sets item and clears error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.getBoxRequestByIdSuccess(mockBoxRequest)
         );
         expect(state.item).toEqual(mockBoxRequest);
         expect(state.error).toBeNull();
      });

      test('Failure sets error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.getBoxRequestByIdFailure('Failed to load')
         );
         expect(state.error).toBe('Failed to load');
      });
   });

   describe('createBoxRequest actions', () => {
      test('Request sets error to null', () => {
         const state = boxRequestReducer(
            { item: emptyBoxRequest, error: 'previous error' },
            boxRequestActions.createBoxRequest(mockBoxRequest)
         );
         expect(state.error).toBeNull();
      });

      test('Success sets item and clears error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.createBoxRequestSuccess(mockBoxRequest)
         );
         expect(state.item).toEqual(mockBoxRequest);
         expect(state.error).toBeNull();
      });

      test('Failure sets error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.createBoxRequestFailure('Creation failed')
         );
         expect(state.error).toBe('Creation failed');
      });
   });

   describe('updateBoxRequest actions', () => {
      test('Request sets error to null', () => {
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: 'previous error' },
            boxRequestActions.updateBoxRequest(mockBoxRequest)
         );
         expect(state.error).toBeNull();
      });

      test('Success sets item and clears error', () => {
         const updatedRequest = { ...mockBoxRequest, requestedName: 'Updated Name' };
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: null },
            boxRequestActions.updateBoxRequestSuccess(updatedRequest)
         );
         expect(state.item).toEqual(updatedRequest);
         expect(state.error).toBeNull();
      });

      test('Failure sets error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.updateBoxRequestFailure('Update failed')
         );
         expect(state.error).toBe('Update failed');
      });
   });

   describe('approveBoxRequest actions', () => {
      test('Request sets error to null', () => {
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: 'previous error' },
            boxRequestActions.approveBoxRequest(mockBoxRequest)
         );
         expect(state.error).toBeNull();
      });

      test('Success sets item and clears error', () => {
         const approvedRequest = { ...mockBoxRequest, status: BoxRequestStatus.APPROVED };
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: null },
            boxRequestActions.approveBoxRequestSuccess(approvedRequest)
         );
         expect(state.item).toEqual(approvedRequest);
         expect(state.error).toBeNull();
      });

      test('Failure sets error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.approveBoxRequestFailure('Approval failed')
         );
         expect(state.error).toBe('Approval failed');
      });
   });

   describe('denyBoxRequest actions', () => {
      test('Request sets error to null', () => {
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: 'previous error' },
            boxRequestActions.denyBoxRequest(mockBoxRequest)
         );
         expect(state.error).toBeNull();
      });

      test('Success sets item and clears error', () => {
         const deniedRequest = { ...mockBoxRequest, status: BoxRequestStatus.DENIED };
         const state = boxRequestReducer(
            { item: mockBoxRequest, error: null },
            boxRequestActions.denyBoxRequestSuccess(deniedRequest)
         );
         expect(state.item).toEqual(deniedRequest);
         expect(state.error).toBeNull();
      });

      test('Failure sets error', () => {
         const state = boxRequestReducer(
            initialBoxRequestState,
            boxRequestActions.denyBoxRequestFailure('Denial failed')
         );
         expect(state.error).toBe('Denial failed');
      });
   });
});
