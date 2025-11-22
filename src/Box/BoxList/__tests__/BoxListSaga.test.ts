import { vi } from 'vitest';
import { when } from 'vitest-when';
import { expectSaga } from 'redux-saga-test-plan';
import { call, put } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetBoxList,
  handleGetWritableBoxList,
  getAllBoxes,
  getAllOwnedBoxesForUserId
} from '../BoxListSaga';

import { boxListActions } from '../BoxListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../../AlertBar/AlertBarTypes';
import { BoxList, emptyBoxList } from '../BoxListType';
import {Xbiis, emptyXbiis, DefaultBox} from '../../boxTypes';
import { User, emptyUser } from '../../../User/userType';
import { Role } from '../../../Role/roleTypes';
import { getAllBoxUsersForUserId } from '../../../BoxUser/BoxUserList/BoxUserListSaga';
import { buildBoxUser } from '../../../BoxUser/BoxUserType';

const client = generateClient();

const mockBoxes: Xbiis[] = [
  { ...emptyXbiis, id: 'box-1', name: 'Box One', xbiisOwnerId: 'user-1' },
  { ...emptyXbiis, id: 'box-2', name: 'Box Two', xbiisOwnerId: 'user-2' },
  DefaultBox
];

const mockBoxList: BoxList = {
  items: mockBoxes,
  nextToken: null
};

const mockUser: User = {
  ...emptyUser,
  id: 'user-1',
  isAdmin: false
};

const mockAdminUser: User = {
  ...emptyUser,
  id: 'admin-1',
  isAdmin: true
};

describe('BoxListSaga', () => {

  beforeEach(() => { });

  afterEach(() =>{
    vi.clearAllMocks();
  })

  describe('getAllBoxes', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listXbiis: mockBoxList } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllBoxes();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllOwnedBoxesForUserId', () => {
    test('calls GraphQL with user filter', async () => {
      const mockResponse = { data: { listXbiis: mockBoxList } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllOwnedBoxesForUserId('user-1');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { 
          filter: { xbiisOwnerId: { eq: 'user-1' } }
        }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleGetBoxList', () => {
    test('handles successful retrieval', async () => {
      const mockResponse = { data: { listXbiis: mockBoxList } };
      
      const gen = handleGetBoxList();
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.next(mockResponse).value).toEqual(put(boxListActions.setAllBoxes(mockBoxList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const error = new Error('GraphQL Error');
      
      const gen = handleGetBoxList();
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET List of Boxes: ${JSON.stringify(error)}`)))
      );
    });

    test('handles network timeout error', async () => {
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleGetBoxList();
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET List of Boxes: ${JSON.stringify(timeoutError)}`)))
      );
    });

    test('handles empty box list', async () => {
      const emptyResponse = { data: { listXbiis: { items: [], nextToken: null } } };
      
      const gen = handleGetBoxList();
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.next(emptyResponse).value).toEqual(put(boxListActions.setAllBoxes(emptyResponse.data.listXbiis)));
      expect(gen.next().done).toBe(true);
    });
  });

  describe('handleGetWritableBoxList', () =>
  {
    beforeEach(() => { });
    afterEach(() => { vi.clearAllMocks(); })

    test('handles admin user - gets all boxes', async () => {
      const action = { payload: mockAdminUser };
      const mockResponse = { data: { listXbiis: mockBoxList } };
      
      const gen = handleGetWritableBoxList(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.next(mockResponse).value).toEqual(put(boxListActions.setAllBoxes(mockBoxList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles non-admin user - filters by write permissions',
         async () =>
    {
      const action = boxListActions.getAllWritableBoxes(mockUser);
      const writableBox = mockBoxes[0];
      const boxUser = buildBoxUser(mockUser, writableBox, Role.Write);
      const mockBoxUsersResponse = { 
        data: { listBoxUsers: { items: [{ ...boxUser, box: DefaultBox },
                                        { ...boxUser, box: writableBox }] } }
      };

      const expectedPayload = { ...emptyBoxList, items: [DefaultBox, writableBox] };
      //console.log('Expected items:', JSON.stringify(expectedPayload, null, 2));

      await expectSaga(handleGetWritableBoxList, action)
              .provide([
                [call(getAllBoxUsersForUserId, mockUser.id), mockBoxUsersResponse],
              ])
              .call(getAllBoxUsersForUserId, mockUser.id)
              .put(boxListActions.setAllBoxes(expectedPayload))
              .run()
    });

    test('handles non-admin user with no write permissions', async () => {
      const action = { payload: mockUser };
      const readOnlyBox = mockBoxes[0];
      const boxUser = buildBoxUser(mockUser, readOnlyBox, Role.Read);
      const mockBoxUsersResponse = { 
        data: { 
          listBoxUsers: { 
            items: [{ ...boxUser, box: readOnlyBox }] 
          } 
        } 
      };
      
      const gen = handleGetWritableBoxList(action);

      const expectedPayload = { ...emptyBoxList, items: [DefaultBox] };
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, mockUser.id));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(
        put(boxListActions.setAllBoxes(expectedPayload))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles error during box user retrieval', async () => {
      const action = { payload: mockUser };
      const error = new Error('BoxUser retrieval failed');
      
      const gen = handleGetWritableBoxList(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, mockUser.id));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET List of Boxes: ${JSON.stringify(error)}`)))
      );
    });

    test('handles error during admin box retrieval', async () => {
      const action = { payload: mockAdminUser };
      const error = new Error('Admin box retrieval failed');
      
      const gen = handleGetWritableBoxList(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET List of Boxes: ${JSON.stringify(error)}`)))
      );
    });

    test('handles mixed read/write permissions correctly',
         async () =>
    {
      const action = { payload: mockUser };
      const writableBox = mockBoxes[0];
      const readOnlyBox = mockBoxes[1];
      const writeBoxUser = buildBoxUser(mockUser, writableBox, Role.Write);
      const readBoxUser = buildBoxUser(mockUser, readOnlyBox, Role.Read);
      
      const mockBoxUsersResponse = { 
        data: { 
          listBoxUsers: { 
            items: [
              { ...writeBoxUser, box: DefaultBox },
              { ...writeBoxUser, box: writableBox },
              { ...readBoxUser,  box: readOnlyBox }
            ] 
          } 
        } 
      };
      
      const gen = handleGetWritableBoxList(action);

      const expectedPayload = { ...emptyBoxList, items: [DefaultBox, writableBox] };
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, mockUser.id));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(
        put(boxListActions.setAllBoxes(expectedPayload))
      );
      expect(gen.next().done).toBe(true);
    });

    test('includes public box for non-admin users', async () => {
      const action = { payload: mockUser };
      const mockBoxUsersResponse = { 
        data: { listBoxUsers: { items: [] } }
      };
      
      await expectSaga(handleGetWritableBoxList, action)
              .provide([
                [call(getAllBoxUsersForUserId, mockUser.id), mockBoxUsersResponse],
              ])
              .call(getAllBoxUsersForUserId, mockUser.id)
              .put.like({ action: { type: boxListActions.setAllBoxes.type } })
              .run();
    });
  });

  describe('error recovery scenarios', () => {
    test('handles malformed response gracefully', async () => {
      const malformedResponse = { data: null };
      
      const gen = handleGetBoxList();
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });

    test('handles DynamoDB throttling error', async () => {
      const throttleError = {
        errors: [{ errorType: 'DynamoDB:ProvisionedThroughputExceededException' }]
      };
      
      const gen = handleGetBoxList();
      
      expect(gen.next().value).toEqual(call(getAllBoxes));
      expect(gen.throw(throttleError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET List of Boxes: ${JSON.stringify(throttleError)}`)))
      );
    });
  });
});