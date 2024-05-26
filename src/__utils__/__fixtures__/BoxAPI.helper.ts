import {when} from "jest-when";
import {generateClient} from "@aws-amplify/api";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import boxList from "../../data/boxList.json";
import userList from "../../data/userList.json";
import {emptyXbiis, Xbiis} from "../../Box/boxTypes";
import {User} from "../../User/userType";
import {BoxList} from "../../Box/BoxList/BoxListType";

jest.mock('@aws-amplify/api');
const client = generateClient();

let allBoxes = boxList as BoxList;
export const setBoxList = (list) => { allBoxes = list; }

export const setupBoxListMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listXbiis} ))
      .mockResolvedValue({data: { listXbiis: allBoxes } });
}

export const defaultCreatedBox: Xbiis = {
   ...emptyXbiis,
   id:    'Newly Generated GUID',
   name:  'Newly Created Box Name',
   owner: userList.items[0] as User,
   xbiisOwnerId: userList.items[0].id,
}

let newBox = defaultCreatedBox;
export const setCreatedBox = (box: Xbiis) => { newBox = box; }

let updatedBox: Xbiis = boxList.items[0] as Xbiis;
export const setUpdatedBox = (box: Xbiis) => { updatedBox = box; }

export const setupBoxMocking = () => {

   when(client.graphql)
     .calledWith(expect.objectContaining({query: queries.getXbiis} ))
     .mockResolvedValue({data: { getXbiis: boxList.items[0] } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.createXbiis} ))
     .mockResolvedValue({data: { createXbiis: newBox } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.updateXbiis} ))
     .mockResolvedValue({data: { updateXbiis: updatedBox } });

};
