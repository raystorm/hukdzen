import {when} from "jest-when";
import {API, Auth} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import boxList from "../../data/boxList.json";
import userList from "../../data/userList.json";
import {put} from "redux-saga/effects";
import {boxActions} from "../../Box/boxSlice";
import {emptyXbiis, Xbiis} from "../../Box/boxTypes";
import {Role} from "../../Role/roleTypes";
import {emptyGyet, Gyet} from "../../User/userType";
import {useAppSelector} from "../../app/hooks";
import {printBoxUser} from "../../BoxUser/BoxUserType";


export const setupUserListMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.listGyets} ))
      .mockReturnValue(Promise.resolve({data: { listGyets: userList } }));
}

export const defaultCreatedUser: Gyet = {
   ...emptyGyet,
   id:    'Newly Generated GUID',
   name:  'Newly Created Box Name',
   email: 'NewUser@Example.com',

   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}

let newUser = defaultCreatedUser;
export const setCreatedUser = (user: Gyet) => { newUser = user; }

let updatedUser: Gyet = userList.items[0] as Gyet;
export const setUpdatedUser = (user: Gyet) => { updatedUser = user; }

export const setupUserMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.getGyet} ))
      .mockReturnValue(Promise.resolve({data: { getGyet: userList.items[0] } }));

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.createGyet} ))
      .mockReturnValue(Promise.resolve({data: { createGyet: newUser } }));

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateGyet} ))
      .mockReturnValue(Promise.resolve({data: { updateGyet: updatedUser } }));
}

export const setupAmplifyUserMocking = () => {

   const mockAmplifyUser = {
      getUsername: 'TEST-GUID-HERE',
   }

   Auth.currentAuthenticatedUser = jest.fn();
   //@ts-ignore
   Auth.currentAuthenticatedUser.mockReturnValueOnce(mockAmplifyUser);
}

const boxRemover = (k,v) => {
   if ( 'box' === k ) { return undefined; }
   return v;
}

export const UserPrinter = () => {
   const user = useAppSelector(state => state.user);
   const current = useAppSelector(state => state.currentUser);

   //TODO: use code blocks
   return (
     <div data-testid='user-info-dumps' >
       <hr />
       <div data-testid='user-info-dump'>
         <h2>User:</h2>
         <pre>{JSON.stringify(user, null,2)}</pre>
       </div>
       <div data-testid='currrent-user-info-dump'>
         <h2>Current:</h2>
         <pre>{JSON.stringify(current, null,2)}</pre>
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