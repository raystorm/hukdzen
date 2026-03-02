import { describe, test, expect } from 'vitest';
import boxUserSlice, { boxUserActions, boxUserReducer } from '../BoxUserSlice';
import { emptyBoxUser, initialBoxUserState, buildBoxUser } from '../BoxUserType';
import type { BoxUser } from '../BoxUserType';
import { emptyUser } from '../../User/userType';
import { emptyXbiis } from '../../Box/boxTypes';
import { Role } from '../../Role/roleTypes';

const mockBoxUser: BoxUser = buildBoxUser(
   { ...emptyUser, id: 'user-123' },
   { ...emptyXbiis, id: 'box-456' },
   Role.Read
);
mockBoxUser.id = 'boxuser-789';

describe('boxUserSlice', () => {
   test('has correct name', () => {
      expect(boxUserSlice.name).toBe('boxUser');
   });

   test('has correct initial state', () => {
      expect(boxUserSlice.getInitialState()).toEqual(initialBoxUserState);
   });

   describe('setBoxUser', () => {
      test('updates item and clears error', () => {
         const stateWithError = { ...initialBoxUserState, error: 'Previous error' };
         const state = boxUserReducer(stateWithError, boxUserActions.setBoxUser(mockBoxUser));
         expect(state.item).toEqual(mockBoxUser);
         expect(state.error).toBeNull();
      });
   });

   describe('createBoxUser', () => {
      test('clears error', () => {
         const stateWithError = { ...initialBoxUserState, error: 'Previous error' };
         const state = boxUserReducer(stateWithError, boxUserActions.createBoxUser(mockBoxUser));
         expect(state.error).toBeNull();
      });
   });

   describe('createBoxUserSuccess', () => {
      test('updates item and clears error', () => {
         const state = boxUserReducer(initialBoxUserState, boxUserActions.createBoxUserSuccess(mockBoxUser));
         expect(state.item).toEqual(mockBoxUser);
         expect(state.error).toBeNull();
      });
   });

   describe('createBoxUserFailure', () => {
      test('sets error', () => {
         const errorMessage = 'Creation failed';
         const state = boxUserReducer(initialBoxUserState, boxUserActions.createBoxUserFailure(errorMessage));
         expect(state.error).toBe(errorMessage);
      });
   });

   describe('updateBoxUser', () => {
      test('clears error', () => {
         const stateWithError = { ...initialBoxUserState, error: 'Previous error' };
         const state = boxUserReducer(stateWithError, boxUserActions.updateBoxUser(mockBoxUser));
         expect(state.error).toBeNull();
      });
   });

   describe('updateBoxUserSuccess', () => {
      test('updates item and clears error', () => {
         const updatedBoxUser = { ...mockBoxUser, role: Role.Write };
         const state = boxUserReducer(initialBoxUserState, boxUserActions.updateBoxUserSuccess(updatedBoxUser));
         expect(state.item).toEqual(updatedBoxUser);
         expect(state.error).toBeNull();
      });
   });

   describe('updateBoxUserFailure', () => {
      test('sets error', () => {
         const errorMessage = 'Update failed';
         const state = boxUserReducer(initialBoxUserState, boxUserActions.updateBoxUserFailure(errorMessage));
         expect(state.error).toBe(errorMessage);
      });
   });

   describe('removeBoxUser', () => {
      test('clears error', () => {
         const stateWithError = { ...initialBoxUserState, error: 'Previous error' };
         const state = boxUserReducer(stateWithError, boxUserActions.removeBoxUser(mockBoxUser));
         expect(state.error).toBeNull();
      });
   });

   describe('removeBoxUserSuccess', () => {
      test('resets item to empty and clears error', () => {
         const stateWithData = { item: mockBoxUser, error: null };
         const state = boxUserReducer(stateWithData, boxUserActions.removeBoxUserSuccess());
         expect(state.item).toEqual(emptyBoxUser);
         expect(state.error).toBeNull();
      });
   });

   describe('removeBoxUserFailure', () => {
      test('sets error', () => {
         const errorMessage = 'Removal failed';
         const state = boxUserReducer(initialBoxUserState, boxUserActions.removeBoxUserFailure(errorMessage));
         expect(state.error).toBe(errorMessage);
      });
   });

   describe('removeBoxUserById', () => {
      test('clears error', () => {
         const stateWithError = { ...initialBoxUserState, error: 'Previous error' };
         const state = boxUserReducer(stateWithError, boxUserActions.removeBoxUserById('boxuser-789'));
         expect(state.error).toBeNull();
      });
   });

   describe('removeBoxUserByIdSuccess', () => {
      test('resets item to empty and clears error', () => {
         const stateWithData = { item: mockBoxUser, error: null };
         const state = boxUserReducer(stateWithData, boxUserActions.removeBoxUserByIdSuccess());
         expect(state.item).toEqual(emptyBoxUser);
         expect(state.error).toBeNull();
      });
   });

   describe('removeBoxUserByIdFailure', () => {
      test('sets error', () => {
         const errorMessage = 'Removal by ID failed';
         const state = boxUserReducer(initialBoxUserState, boxUserActions.removeBoxUserByIdFailure(errorMessage));
         expect(state.error).toBe(errorMessage);
      });
   });
});
