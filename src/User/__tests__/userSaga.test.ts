import { vi } from 'vitest';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from "redux-saga-test-plan";
import { call, put } from 'redux-saga/effects';
import { throwError } from "redux-saga-test-plan/providers";

import { generateClient } from '@aws-amplify/api';

import { setupStore, start } from "../../app/store";
import { alertBarActions } from "../../AlertBar/AlertBarSlice";
import {
         buildErrorAlert, buildInfoAlert, buildSuccessAlert
       } from "../../AlertBar/AlertBarTypes";

import { DefaultBox, Xbiis } from '../../Box/boxTypes';
import { AccessLevel, BoxPurpose } from '../../Box/boxTypes';
import type { BoxUser } from "../../BoxUser/BoxUserType";
import { boxActions } from '../../Box/boxSlice';
import { getUserBoxFor } from '../../Box/boxSaga';
import { boxUserActions } from '../../BoxUser/BoxUserSlice';
import { getAllOwnedBoxesForUserId } from "../../Box/BoxList/BoxListSaga";
import { getOwnedDocuments } from "../../docs/docList/documentListSaga";

import {
   getCurrentAmplifyUser, getUserById,
   createUser, createUserBox, updateUser, removeUserById,
   handleSignIn, handleGetUserById, handleGetCurrentUser,
   handleCreateUser, handleUpdateUser, handleRemoveUser,
   MISSING_NAME_ERROR,
} from "../userSaga";
import type { CreateUserInput, User } from "../userType";
import { emptyUser } from "../userType";

import { currentUserActions } from "../currentUserSlice";
import { userActions } from "../userSlice";
import { getAllBoxUsersForUserId } from "../../BoxUser/BoxUserList/BoxUserListSaga";
import { removeBoxUserbyId } from "../../BoxUser/boxUserSaga";
import { DefaultRole } from "../../Role/roleTypes";
import { endsWith } from "../../__utils__/testUtilities";


const client = generateClient();

let started = false;

const loadTestStore = (state: any) => {
   const store = setupStore(state);
   store.dispatch = vi.fn(store.dispatch);
   if (!started)
   {
      start(); //start running the sagas/store
      started = true;
   }
   return store;
}

describe('UserSaga', () =>
{
   beforeEach(() => {
      vi.clearAllMocks();
   });

   describe('SignIn Action', () =>
   {
      test('runs initialSignIn correctly for normal user', async () =>
      {
         const store = loadTestStore({});
         const GUID = 'TEST-GUID_HERE';
         const authData = {
            username: GUID,
            userId: GUID,
            tokens: { idToken: { payload: {'cognito:groups': ['foo']} } },
            attributes:
            {
               email: 'test@example.com',
               name:  'TEST',
               "custom:waa": 'WIE WA!',
            }
         };

         const userData = { data: { getUser: null, username: GUID, } };

         const user = {
            __typename: 'User',
            id:      authData.username,
            name:    authData.attributes.name,
            email:   authData.attributes.email,
            waa:     authData.attributes['custom:waa'],
            isAdmin: false,
            //createdAt: expect.anything(), //TODO: narrow to Date/Time range
            //updatedAt: expect.anything(),
         } as User;

         const payload = currentUserActions.signIn(authData);

         return expectSaga(handleSignIn, payload)
                  .provide([
                     [matchers.call.fn(getCurrentAmplifyUser), authData],
                     [matchers.call.fn(getUserById), userData],
                     [call(createUserBox, user), {}],
                  ])
                  .call(getUserById, authData.userId)
                  .put.like({ action: { type: userActions.setUser.type, payload: user }})
                  .put.like({ action: { type: currentUserActions.setCurrentUser.type, payload: user }})
                  .put.like({ action: { type: userActions.createUser.type, payload: user }})
                  .call.like({ fn: createUserBox, args: [user] })
                  .run()
      });

      test('runs initialSignIn correctly for admin', async () =>
      {
         const store = loadTestStore({});
         const GUID = 'TEST-GUID';
         const authData = {
            username: GUID,
            userId: GUID,
            signInUserSession: {
               idToken: { payload: {'cognito:groups': ['WebAppAdmin']} }
            },
            attributes: {
               email: 'test@example.com',
               name:  'TEST',
               "custom:waa": 'WIE WA!',
            }
         };

         const userData = { data: { getUser: null, username: GUID, } };

         const user: CreateUserInput = {
         id:    authData.username,
         name:  authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: true,
      };

         const payload = currentUserActions.signIn(authData);

         return expectSaga(handleSignIn, payload)
                  .provide([
                              [matchers.call.fn(getCurrentAmplifyUser), authData],
                              [matchers.call.fn(getUserById), userData],
                              [call(createUserBox, user as User), {}],
                           ])
                  .call(getUserById, authData.userId)
                  .put.like({ action: { type: userActions.setUser.type, payload: user }})
                  .put.like({ action: { type: currentUserActions.setCurrentUser.type, payload: user }})
                  .put.like({ action: { type: userActions.createUser.type, payload: user }})
                  .call.like({ fn: createUserBox, args: [user] })
                  .run()
      });

      /**
       *  Test the SignIn Action Directly,
       *  because side-effects like put(), don't seem to work properly in testing.
       */
      test('handles returning users correctly', async () =>
      {
         const GUID = 'TEST-GUID'
         const authData = {
            username: GUID,
            userId: GUID,
            //May need to change this line for accuracy
            tokens: { idToken: { payload: {'cognito:groups': ['foo']} } },
            attributes:
            {
               email: 'test@example.com',
               name:  'TEST',
               "custom:waa": 'WIE WA!',
            }
         };

         const user: User = {
            ...emptyUser,
            id: GUID,
            name: authData.attributes.name,
            email: authData.attributes.email,
            waa: authData.attributes["custom:waa"],
            isAdmin: false,
         };

         const userData = { data: { getUser: user, username: GUID, } };

         const payload = currentUserActions.signIn(authData);

         return expectSaga(handleSignIn, payload)
                  .provide([
                              [matchers.call.fn(getCurrentAmplifyUser), authData],
                              [matchers.call.fn(getUserById), userData],
                              [call(createUserBox, user), {}],
                           ])
                  .call(getUserById, authData.userId)
                  .put.like({ action: { type: userActions.setUser.type, payload: user }})
                  .put.like({ action: { type: currentUserActions.setCurrentUser.type, payload: user }})
                  .call.like({ fn: createUserBox, args: [user] })
                  .run()
      });

      test('stops processing on error', async () =>
      {
         const GUID = 'TEST-GUID';
         const authData= {
            username: GUID,
            userId: GUID,
            signInUserSession: { idToken: { payload: {'cognito:groups': ['foo']} } },
            attributes:
            {
              email: 'test@example.com',
              name:  'TEST',
              "custom:waa": 'WIE WA!',
            }
         };

         const user: User = {
            ...emptyUser,
            id: authData.username,
            name: authData.attributes.name,
            email: authData.attributes.email,
            waa: authData.attributes["custom:waa"],
         };

         const payload = currentUserActions.signIn(authData);

         return expectSaga(handleSignIn, payload)
            .provide([
                        [matchers.call.fn(getCurrentAmplifyUser), authData],
                        [ matchers.call.fn(getUserById),
                          throwError(new Error('FORCED TEST FAILURE')) ]
                     ])
            .call(getUserById, authData.userId)
            .not.put.like({ action: { type: userActions.setUser.type }})
            .not.put.like({ action: { type: currentUserActions.setCurrentUser.type }})
            .run()
      });

      test('prompts for user info when name is missing', () =>
      {
         const GUID = 'TEST-GUID';
         const authData = {
            username: GUID,
            userId: GUID,
            attributes: {
               email: 'test@example.com',
               name: null,                 // missing name triggers branch
               "custom:waa": 'WIE WA!',
            },
            signInDetails: { loginId: 'test@example.com' },
         };

         const expectedUser = {
            __typename: "User",
            id: GUID,
            email: 'test@example.com',
            name: MISSING_NAME_ERROR,
            waa: 'WIE WA!',
            isAdmin: false,
            clan: null,
         } as User;

         const userData = { data: { getUser: null } };

         const payload = currentUserActions.signIn(authData);

         return expectSaga(handleSignIn, payload)
            .provide([
                        [matchers.call.fn(getCurrentAmplifyUser), authData],
                        [matchers.call.fn(getUserById), userData],
                     ])
            .call(getUserById, GUID)
            .put.like({ action: userActions.setUser(expectedUser) })
            .put.like({ action: currentUserActions.setCurrentUser(expectedUser) })
            .put.like({ action: userActions.promptForUserInfo(expectedUser) })
            .not.put.actionType(userActions.createUser.type)
            .run();
      });

      test('retries when Amplify and payload both lack userId', () =>
      {
         const authData = {
            username: null,
            userId: null,
            signInDetails: { loginId: 'test@example.com' },
            attributes: {},
         };

         const payload = currentUserActions.signIn(authData);

         return expectSaga(handleSignIn, payload, 0)
            .provide([
                        [matchers.call.fn(getCurrentAmplifyUser), { username: null }],
                     ])
            .call(getCurrentAmplifyUser)
            .delay(500) //delay before recursion. recursion is invisible
            // .call.like({
            //               fn: handleSignIn,
            //               args: [payload, 1],   // recursive call with incremented count
            //            })
            .not.call(getUserById) // critical assertion
            .not.put.actionType(userActions.setUser.type)
            .not.put.actionType(currentUserActions.setCurrentUser.type)
            .run();
      });

      test('stops after exceeding MAX_RETRIES', () =>
      {
         const authData = {
            username: null,
            userId: null,
            signInDetails: { loginId: 'test@example.com' },
            attributes: {},
         };

         const payload = currentUserActions.signIn(authData);

         const errMsg = 'Unable to Sign In.  Redirecting to Home Page.';

         return expectSaga(handleSignIn, payload, 11)
                  .provide([
                              [matchers.call.fn(getCurrentAmplifyUser),
                               { username: null }],
                           ])
                  .call(getCurrentAmplifyUser)
                  .not.call(getUserById)
                  .not.put.actionType(userActions.setUser.type)
                  .not.put.actionType(currentUserActions.setCurrentUser.type)
                  .put(alertBarActions.DisplayAlertBox(buildErrorAlert(errMsg)))
                  .run()
                        // validate the URL path (end from href) matches.
                  .then(() => { expect(window.location.pathname).toBe('/') });
      });
   });

   describe('handleGetUserById', () =>
   {
      const user = { id: '123', name: 'Tom' } as User;

      test('successfully fetches user by id', () =>
      {
         return expectSaga(handleGetUserById, userActions.getUserById(user.id))
            .provide([
                        [call(getUserById, user.id), { data: { getUser: user } }],
                     ])
            .call(getUserById, user.id)
            .put(userActions.setUser(user))
            .run();
      });

      test('handles GraphQL error when fetching user by id', () =>
      {
         return expectSaga(handleGetUserById, userActions.getUserById(user.id))
            .provide([
                        [call(getUserById, user.id),
                         throwError(new Error('FORCED ERROR'))],
                     ])
            .call(getUserById, user.id)
            .put(alertBarActions.DisplayAlertBox(
               buildErrorAlert('Failed to GET User: "FORCED ERROR"')
            ))
            .run();
      });
   });

   describe('handleGetCurrentUser', () =>
   {
      const amplifyUser = { getUsername: () => '123', };

      test('successfully loads current user', () =>
      {
         return expectSaga(handleGetCurrentUser)
            .provide([
                        [call(getCurrentAmplifyUser), amplifyUser],
                        [call(getUserById, '123'), { data: { getUser: {} } }],
                     ])
            .call(getCurrentAmplifyUser)
            .call(getUserById, '123')
            .run();
      });

      test('handles error when loading current user', () =>
      {
         return expectSaga(handleGetCurrentUser)
            .provide([
                        [call(getCurrentAmplifyUser),
                         throwError(new Error('FORCED ERROR'))],
                     ])
            .call(getCurrentAmplifyUser)
            .put(alertBarActions.DisplayAlertBox(
               buildErrorAlert('Failed to GET Current User: "FORCED ERROR"')
            ))
            .run();
      });
   });

   describe('createUserBox', () =>
   {
      test('does nothing when user already has a personal box', () =>
      {
         const user = { ...emptyUser, id: '123', name: 'Tom' };

         const existingBox = {
            id: 'box-1',
            purpose: BoxPurpose.USER,
            items: [{}],
         };

         return expectSaga(createUserBox, user)
            .provide([
                        [call(getUserBoxFor, user.id),
                         { data: { listXbiis: { items: [existingBox] } } }],
                     ])
            .not.put(boxActions.createBox(expect.anything()))
            .not.put(boxUserActions.createBoxUser(expect.anything()))
            .put(alertBarActions.DisplayAlertBox(buildInfoAlert('UserBox Already Exists')))
            .run();
      });

      test('creates a personal box and attaches permissions', () =>
      {
         const user = { id: '123', name: 'Tom', } as User;

         const createdBox = {
            name:        'Personal: Tom',
            purpose:     BoxPurpose.USER,
            defaultRole: AccessLevel.NONE,
         } as Xbiis;

         const boxUserMock = {
            user:          user,       boxUserUserId: user.id,
            box:           createdBox, boxUserBoxId:  createdBox.id,
            role: AccessLevel.NONE,
         } as BoxUser;

         let getCount = 0;
         return expectSaga(createUserBox, user)
                  .provide([
                              {
                                 call(effect, next)
                                 {
                                    if (effect.fn === getUserBoxFor && 0 == getCount)
                                    {
                                       ++getCount;
                                       return { data: { listXbiis: { items: [] } } };
                                    }
                                    if (effect.fn === getUserBoxFor && 1 == getCount)
                                    {
                                       return { data: { listXbiis: { items: [createdBox] } } };
                                    }
                                    return next();
                                 },
                              },
                           ])
                  .put.like({ action: boxActions.createBox(createdBox) })
                  .put.like({ action: boxUserActions.createBoxUser(boxUserMock) })
                  //.put(alertBarActions.DisplayAlertBox(buildSuccessAlert('UserBox Created')))
                  .run();
      });

      test('shows an error when the box cannot be retrieved after creation', () =>
      {
         const user = { ...emptyUser, id: '123', name: 'Tom' };

         const createdBox = {
            id:          '', //ID created by saga
            purpose:     BoxPurpose.USER,
            defaultRole: AccessLevel.NONE,
         };


         const expectedError = buildErrorAlert(
             "Failure while to Creating the user's Personal Box: "
           + "Personal box created successfully, but we're unable to find it."
         );

         return expectSaga(createUserBox, user)
            .provide([
                        // First lookup: empty
                        [call(getUserBoxFor, user.id),
                         { data: { listXbiis: { items: [] } } }],
                        // Second lookup: still empty
                        // {
                        //    call(effect, next) {
                        //       if (effect.fn === getUserBoxFor) {
                        //          return { data: { listXbiis: { items: [] } } };
                        //       }
                        //       return next();
                        //    },
                        // },
                        [call(getUserBoxFor, user.id),
                         { data: { listXbiis: { items: [] } } }],
                     ])
            //@ts-expect-error partial box type, missing fields on purpose
            .put.like({ action: boxActions.createBox(createdBox) })
            .put(alertBarActions.DisplayAlertBox(
               expectedError
               //buildErrorAlert(expect.stringContaining('Unable to find'))
            ))
            .run();
      });

   })

   describe('handleCreateUser', () =>
   {
      const user = { id: '123', name: 'Tom' } as User;

      test('successfully creates non admin users', () =>
      {
         const boxUser = {
            user:          user,
            boxUserUserId: user.id,
            box:           DefaultBox,
            boxUserBoxId:  DefaultBox.id,
            role:          DefaultRole,
         } as BoxUser;

         return expectSaga(handleCreateUser, userActions.createUser(user))
                  .provide([
                              [call(createUser,    user), { data: { createUser: user } }],
                              [call(createUserBox, user), {}],
                           ])
                  .call(createUser, user)
                  .put.like({ action: boxUserActions.createBoxUser(boxUser) })
                  //.put(alertBarActions.DisplayAlertBox(buildSuccessAlert('User Created')))
                  .run();
      });

      test('successfully creates admin users', () =>
      {
         const admin = { ...user, isAdmin: true } as User;

         return expectSaga(handleCreateUser, userActions.createUser(admin))
            .provide([
                        [call(createUser,    admin), { data: { createUser: admin } }],
                        [call(createUserBox, admin), {}],
                     ])
            .call(createUser, admin)
            .not.put.actionType(boxUserActions.createBoxUser.type)
            //.put(alertBarActions.DisplayAlertBox(buildSuccessAlert('User Created')))
            .run();
      });

      test('handles GraphQL error when creating user', () =>
      {
         return expectSaga(handleCreateUser, userActions.createUser(user))
            .provide([
                        [call(createUser, user),
                         throwError(new Error('FORCED ERROR'))],
                     ])
            .call(createUser, user)
            .put(alertBarActions.DisplayAlertBox(
                      buildErrorAlert('Unable to create user: "FORCED ERROR"')
                 ))
            .run();
      });
   });

   describe('handleUpdateUser', () =>
   {
      const user = { id: '123', name: 'Tom' } as User;

      test('successfully updates user', () =>
      {
         return expectSaga(handleUpdateUser, userActions.updateUser(user))
            .provide([
                        [call(updateUser, user), { data: { updateUser: user } }],
                     ])
            .call(updateUser, user)
            .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('User Updated')))
            .run();
      });

      test('handles GraphQL error when updating user', () =>
      {
         return expectSaga(handleUpdateUser, userActions.updateUser(user))
            .provide([
                        [call(updateUser, user), throwError(new Error('FORCED ERROR'))],
                     ])
            .call(updateUser, user)
            .put(alertBarActions.DisplayAlertBox(
                   buildErrorAlert('Error updating user: "FORCED ERROR"')
            ))
            .run();
      });
   });

   describe('Remove User', () =>
   {
      const cases = [
         {
            name: 'fails when user owns boxes',
            provides: [
               [call(getAllOwnedBoxesForUserId, '123'),
                { data: { listXbiis: { items: [{}] } } }],
            ],
            expectedPuts: [
               alertBarActions.DisplayAlertBox(
                  buildErrorAlert('Unable To Delete: Tom, since they own boxes.')
               ),
            ],
         },

         {
            name: 'fails when user owns documents',
            provides: [
               [call(getAllOwnedBoxesForUserId, '123'),
                { data: { listXbiis: { items: [] } } }],
               [call(getOwnedDocuments, '123'),
                { data: { listDocumentDetails: { items: [{}] } } }],
            ],
            expectedPuts: [
               alertBarActions.DisplayAlertBox(
                  buildErrorAlert('Unable To Delete: Tom, since they own Items.')
               ),
            ],
         },

         {
            name: 'removes all boxUsers before deleting user',
            provides: [
               [call(getAllOwnedBoxesForUserId, '123'),
                { data: { listXbiis: { items: [] } } }],
               [call(getOwnedDocuments, '123'),
                { data: { listDocumentDetails: { items: [] } } }],
               [call(getAllBoxUsersForUserId, '123'),
                { data: { listBoxUsers: { items: [{ id: 'bu1' }, { id: 'bu2' }] } } }],
               [call(removeBoxUserbyId, 'bu1'), {}],
               [call(removeBoxUserbyId, 'bu2'), {}],
               [call(removeUserById, '123'), {}],
            ],
            expectedPuts: [
               alertBarActions.DisplayAlertBox(
                  buildSuccessAlert('Successfully removed user: Tom')
               ),
            ],
         },

         {
            name: 'handles GraphQL error',
            provides: [
               [call(getAllOwnedBoxesForUserId, '123'),
                { data: { listXbiis: { items: [] } } }],
               [call(getOwnedDocuments, '123'),
                { data: { listDocumentDetails: { items: [] } } }],
               [call(getAllBoxUsersForUserId, '123'),
                { data: { listBoxUsers: { items: [] } } }],
               [call(removeUserById, '123'), throwError(new Error('FORCED ERROR'))],
            ],
            expectedPuts: [
               alertBarActions.DisplayAlertBox(
                  buildErrorAlert('Unable to remove user: Tom: "FORCED ERROR"')
               ),
            ],
         },
      ];
      const user = { id: '123', name: 'Tom' } as User;

      cases.forEach(({ name, provides, expectedPuts }) => {
         test(name, () =>
         {
            let saga = expectSaga(handleRemoveUser, userActions.removeUser(user));
            saga = saga.provide(provides as any); //as any to silence TypeScript
            expectedPuts.forEach(expected => saga = saga.put.like({ action: expected }) );
            return saga.run();
         });
      });

   })
})