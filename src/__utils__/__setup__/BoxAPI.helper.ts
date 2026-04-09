import {vi} from 'vitest';
import {when} from "vitest-when";
import {generateClient} from "@aws-amplify/api";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import boxList from "../__fixtures__/boxList.json";
import userList from "../__fixtures__/userList.json";
import { emptyBox, Box } from "../../Box/boxTypes";
import {User} from "../../User/userType";
import {BoxList} from "../../Box/BoxList/BoxListType";
import {emptyBoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";

const client = generateClient();

let allBoxes = boxList as BoxList;
export const setBoxList = (list) => { allBoxes = list; }

export const setupBoxListMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listBoxes} ))
      .thenResolve({data: { listBoxes: allBoxes } });
}

export const defaultCreatedBox: Box = {
   ...emptyBox,
   id:    'Newly Generated GUID',
   name:  'Newly Created Box Name',
   owner: userList.items[0] as User,
   boxOwnerId: userList.items[0].id,
}

let newBox = defaultCreatedBox;
export const setCreatedBox = (box: Box) => { newBox = box; }

let updatedBox: Box = boxList.items[0] as Box;
export const setUpdatedBox = (box: Box) => { updatedBox = box; }

export const setupBoxMocking = () => {

   when(client.graphql)
     .calledWith(expect.objectContaining({query: queries.getBox} ))
     .thenResolve({data: { getBox: boxList.items[0] } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.createBox} ))
     .thenResolve({data: { createBox: newBox } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.updateBox} ))
     .thenResolve({data: { updateBox: updatedBox } });

};
