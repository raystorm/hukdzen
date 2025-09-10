import {vi} from 'vitest';
import {when} from "vitest-when";
import {v4 as randomUUID} from "uuid";
import {generateClient} from "@aws-amplify/api";

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import userList from "../../data/userList.json";
import boxList from "../../data/boxList.json";

import {User} from "../../User/userType";
import {BoxUser, buildBoxUser} from "../../BoxUser/BoxUserType";
import {BoxUserList, emptyBoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {Xbiis} from "../../Box/boxTypes";
import {Role} from "../../Role/roleTypes";
import {defaultCreatedBox} from "./BoxAPI.helper";
import {defaultCreatedUser} from "./UserAPI.helper";

const client = generateClient();

export const buildBoxUserList = (): BoxUserList => {
   let items: BoxUser[] = [];
   for(let b of boxList.items )
   {
      const box = b as Xbiis;
      for (let u of userList.items)
      {
         const user = u as User;
         items.push({ ...buildBoxUser(user, box, Role.Write), id: randomUUID(), });
      }
   }
   return { ...emptyBoxUserList, items: items };
}

let boxUserList: BoxUserList = buildBoxUserList();
export const setBoxUserList = (list: BoxUserList) => { boxUserList = list; }

export const setupBoxUserListMocking = () => {
   when(client.graphql)
     .calledWith(expect.objectContaining({query: queries.listBoxUsers} ))
     .thenResolve({data: { listBoxUsers: boxUserList } });
}

export const defaultCreatedBoxUser: BoxUser = {
   ...buildBoxUser(defaultCreatedUser, defaultCreatedBox, Role.Write),
   id:    'Newly Generated GUID',
};

let getBoxUser: BoxUser = boxUserList.items[0]!;
export const setGetBoxUser = (boxUser: BoxUser) => { getBoxUser = boxUser; }

let newBoxUser = defaultCreatedBoxUser;
export const setCreatedBoxUser = (boxUser: BoxUser) => { newBoxUser = boxUser; }

let updatedBoxUser: BoxUser = boxUserList.items[0]!;
export const setUpdatedBoxUser = (boxUser: BoxUser) => { updatedBoxUser = boxUser; }

export const setupBoxUserMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.getBoxUser} ))
      .thenResolve({data: { getBoxUser: getBoxUser } });

   when(client.graphql)
      .calledWith(expect.objectContaining({query: mutations.createBoxUser} ))
      .thenResolve({data: { createBoxUser: newBoxUser } });

   when(client.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateBoxUser} ))
      .thenResolve({data: { updateBoxUser: updatedBoxUser } });
};
