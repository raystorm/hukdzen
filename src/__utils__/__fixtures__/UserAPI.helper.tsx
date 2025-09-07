import { vi } from 'vitest';
import {when} from "vitest-when";
import { generateClient } from '@aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import userList from "../../data/userList.json";
import {emptyUser, User} from "../../User/userType";
import {useAppSelector} from "../../app/hooks";
import {printBoxUser} from "../../BoxUser/BoxUserType";

vi.mock('aws-amplify/auth');

const client = generateClient();

export const setupUserListMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listUsers} ))
      .thenResolve({data: { listUsers: userList } });
}

export const defaultCreatedUser: User = {
   ...emptyUser,
   id:    'Newly Generated GUID',
   name:  'Newly Created Box Name',
   email: 'NewUser@Example.com',

   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}

let getUser = userList.items[0] as User;
export const setGetUser = (user: User) => { getUser = user; }

let newUser = defaultCreatedUser;
export const setCreatedUser = (user: User) => { newUser = user; }

let updatedUser: User = userList.items[0] as User;
export const setUpdatedUser = (user: User) => { updatedUser = user; }

export const setupUserMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.getUser} ))
      .thenResolve({data: { getUser: getUser } });

   when(client.graphql)
      .calledWith(expect.objectContaining({query: mutations.createUser} ))
      .thenResolve({data: { createUser: newUser } });

   when(client.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateUser} ))
      .thenResolve({data: { updateUser: updatedUser } });
}

export const setupAmplifyUserMocking = () => {
   const mockAmplifyUser = { username: 'TEST-GUID-HERE',
                             userId: 'TEST-GUID-HERE',
                             getUsername: () => 'TEST-GUID-HERE' };
   when(getCurrentUser).calledWith().thenResolve(mockAmplifyUser);
}

const boxRemover = (k,v) => {
   if ( 'box' === k ) { return undefined; }
   return v;
}

export const UserPrinter = () => {
   const user = useAppSelector(state => state.user);
   const current = useAppSelector(state => state.currentUser);

   return (
     <div data-testid='user-info-dumps' >
       <hr />
       <div data-testid='user-info-dump'>
         <h2>User:</h2>
          <pre><code>{JSON.stringify(user, null,2)}</code></pre>
       </div>
       <div data-testid='currrent-user-info-dump'>
         <h2>Current:</h2>
          <pre><code>{JSON.stringify(current, null,2)}</code></pre>
       </div>
     </div>
   );
}

export const BoxUserPrinter = () => {
   const userList = useAppSelector(state => state.boxUserList);

   return (
      <div data-testid='boxUserList-dump'>
        <hr />
        <h2>BoxUserList info:</h2>
        <ul>
          {userList.items.map(boxUser => <li>{printBoxUser(boxUser)}</li>)}
        </ul>
      </div>
   );
}