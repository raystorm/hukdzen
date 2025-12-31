import { vi } from 'vitest';
import { when } from 'vitest-when';
import { expectSaga } from 'redux-saga-test-plan';
import { call, put } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';

import {
   handleGetReadableBoxList,
   handleGetWritableBoxList,
   getAllBoxes,
   getAllOwnedBoxesForUserId,
} from '../BoxListSaga';

import { boxListActions } from '../BoxListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildFriendlyErrorAlert } from '../../../AlertBar/AlertBarTypes';

import { BoxList, emptyBoxList } from '../BoxListType';
import { Xbiis, emptyXbiis, DefaultBox } from '../../boxTypes';
import { User, emptyUser } from '../../../User/userType';
import { Role } from '../../../Role/roleTypes';
import { getAllBoxUsersForUserId } from '../../../BoxUser/BoxUserList/BoxUserListSaga';
import { buildBoxUser } from '../../../BoxUser/BoxUserType';

const client = generateClient();

const mockBoxes: Xbiis[] = [
   { ...emptyXbiis, id: 'box-1', name: 'Box One', xbiisOwnerId: 'user-1' },
   { ...emptyXbiis, id: 'box-2', name: 'Box Two', xbiisOwnerId: 'user-2' },
   DefaultBox,
];

const mockBoxList: BoxList = {
   ...emptyBoxList,
   items: mockBoxes,
   nextToken: null,
};

const mockUser: User = {
   ...emptyUser,
   id: 'user-1',
   isAdmin: false,
};

const mockAdminUser: User = {
   ...emptyUser,
   id: 'admin-1',
   isAdmin: true,
};

describe('BoxListSaga', () => {

   afterEach(() => {
      vi.clearAllMocks();
   });

   // ------------------------------------------------------------
   // getAllBoxes
   // ------------------------------------------------------------
   describe('getAllBoxes', () => {
      test('calls GraphQL with correct parameters', async () => {
         const mockResponse = { data: { listXbiis: mockBoxList } };

         when(client.graphql)
            .calledWith(expect.anything())
            .thenResolve(mockResponse);

         const result = await getAllBoxes();

         expect(client.graphql).toHaveBeenCalledWith({
                                                        query: expect.any(String),
                                                     });
         expect(result).toEqual(mockResponse);
      });
   });

   // ------------------------------------------------------------
   // getAllOwnedBoxesForUserId
   // ------------------------------------------------------------
   describe('getAllOwnedBoxesForUserId', () => {
      test('calls GraphQL with user filter', async () => {
         const mockResponse = { data: { listXbiis: mockBoxList } };

         when(client.graphql)
            .calledWith(expect.anything())
            .thenResolve(mockResponse);

         const result = await getAllOwnedBoxesForUserId('user-1');

         expect(client.graphql).toHaveBeenCalledWith({
                                                        query: expect.any(String),
                                                        variables: {
                                                           filter: { xbiisOwnerId: { eq: 'user-1' } },
                                                        },
                                                     });
         expect(result).toEqual(mockResponse);
      });
   });

   // ------------------------------------------------------------
   // handleGetReadableBoxList
   // ------------------------------------------------------------
   describe('handleGetReadableBoxList', () => {

      test('admin user → calls getAllBoxesForAdmin', async () => {
         const action = boxListActions.getAllReadableBoxes(mockAdminUser);

         const mockResponse = { data: { listXbiis: mockBoxList } };

         await expectSaga(handleGetReadableBoxList, action)
            .provide([[call(getAllBoxes), mockResponse]])
            .put(boxListActions.setAllBoxes(mockBoxList))
            .run();
      });

      test('non-admin → returns readable boxes only', async () => {
         const action = boxListActions.getAllReadableBoxes(mockUser);

         const readableBox = mockBoxes[0];
         const writeBox = mockBoxes[1];

         const readableBU = buildBoxUser(mockUser, readableBox, Role.Read);
         const writeBU = buildBoxUser(mockUser, writeBox, Role.Write);

         const mockBUResponse = {
            data: {
               listBoxUsers: {
                  items: [
                     { ...readableBU, box: readableBox },
                     { ...writeBU, box: writeBox },
                  ],
               },
            },
         };

         const expectedPayload = {
            ...emptyBoxList,
            items: [DefaultBox, readableBox, writeBox],
         };

         await expectSaga(handleGetReadableBoxList, action)
            .provide([[call(getAllBoxUsersForUserId, mockUser.id), mockBUResponse]])
            .put(boxListActions.setAllBoxes(expectedPayload))
            .run();
      });

      test('non-admin → empty BoxUsers list', async () => {
         const action = boxListActions.getAllReadableBoxes(mockUser);

         const mockBUResponse = {
            data: { listBoxUsers: { items: [] } },
         };

         const expectedPayload = {
            ...emptyBoxList,
            items: [DefaultBox],
         };

         await expectSaga(handleGetReadableBoxList, action)
            .provide([[call(getAllBoxUsersForUserId, mockUser.id), mockBUResponse]])
            .put(boxListActions.setAllBoxes(expectedPayload))
            .run();
      });

      test('error → shows alert', async () => {
         const action = boxListActions.getAllReadableBoxes(mockUser);
         const error = new Error('Readable error');

         await expectSaga(handleGetReadableBoxList, action)
            .provide([[call(getAllBoxUsersForUserId, mockUser.id), Promise.reject(error)]])
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });

      test('malformed BoxUsers response → does not crash and returns DefaultBox',
           async () =>
      {
         const action = boxListActions.getAllReadableBoxes(mockUser);

         const malformed = { data: { listBoxUsers: null } };

         const expectedPayload = {
            ...emptyBoxList,
            items: [DefaultBox],
         };

         await expectSaga(handleGetReadableBoxList, action)
            .provide([[call(getAllBoxUsersForUserId, mockUser.id), malformed]])
            .put(boxListActions.setAllBoxes(expectedPayload))
            .run();
      });

   });

   // ------------------------------------------------------------
   // handleGetWritableBoxList
   // ------------------------------------------------------------
   describe('handleGetWritableBoxList', () => {

      test('admin user → calls getAllBoxesForAdmin', async () => {
         const action = boxListActions.getAllWritableBoxes(mockAdminUser);

         const mockResponse = { data: { listXbiis: mockBoxList } };

         await expectSaga(handleGetWritableBoxList, action)
            .provide([[call(getAllBoxes), mockResponse]])
            .put(boxListActions.setAllBoxes(mockBoxList))
            .run();
      });

      test('non-admin → writable only', async () => {
         const action = boxListActions.getAllWritableBoxes(mockUser);

         const writableBox = mockBoxes[0];
         const readOnlyBox = mockBoxes[1];

         const writableBU = buildBoxUser(mockUser, writableBox, Role.Write);
         const readBU = buildBoxUser(mockUser, readOnlyBox, Role.Read);

         const mockBUResponse = {
            data: {
               listBoxUsers: {
                  items: [
                     { ...writableBU, box: writableBox },
                     { ...readBU, box: readOnlyBox },
                  ],
               },
            },
         };

         const expectedPayload = {
            ...emptyBoxList,
            items: [DefaultBox, writableBox],
         };

         await expectSaga(handleGetWritableBoxList, action)
            .provide([[call(getAllBoxUsersForUserId, mockUser.id), mockBUResponse]])
            .put(boxListActions.setAllBoxes(expectedPayload))
            .run();
      });

      test('non-admin → no writable boxes', async () =>
      {
         const action = boxListActions.getAllWritableBoxes(mockUser);

         const readOnlyBox = mockBoxes[0];
         const readBU = buildBoxUser(mockUser, readOnlyBox, Role.Read);

         const mockBUResponse = {
            data: { listBoxUsers: { items: [{ ...readBU, box: readOnlyBox }] } },
         };

         const expectedPayload = {
            ...emptyBoxList,
            items: [DefaultBox],
         };

         await expectSaga(handleGetWritableBoxList, action)
                 .provide([[call(getAllBoxUsersForUserId, mockUser.id), mockBUResponse]])
                 .put.like({ action: boxListActions.setAllBoxes(expectedPayload) })
                 .run();
      });

      test('error → shows alert', async () => {
         const action = boxListActions.getAllWritableBoxes(mockUser);
         const error = new Error('Writable error');

         await expectSaga(handleGetWritableBoxList, action)
            .provide([[call(getAllBoxUsersForUserId, mockUser.id), Promise.reject(error)]])
            .put.like({ action: { type: alertBarActions.DisplayAlertBox.type } })
            .run();
      });
   });
});
