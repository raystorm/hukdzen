import {when} from "jest-when";
import {API} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import boxList from "../../data/boxList.json";
import userList from "../../data/userList.json";
import {put} from "redux-saga/effects";
import {boxActions} from "../../Box/boxSlice";
import {emptyXbiis, Xbiis} from "../../Box/boxTypes";
import {Role} from "../../Role/roleTypes";
import {Gyet} from "../../User/userType";


export const setupBoxListMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.listXbiis} ))
      .mockReturnValue(Promise.resolve({data: { listXbiis: boxList } }));
}

export const defaultCreatedBox: Xbiis = {
   ...emptyXbiis,
   id:    'Newly Generated GUID',
   name:  'Newly Created Box Name',
   owner: userList.items[0] as Gyet,
   xbiisOwnerId: userList.items[0].id,
}

let newBox = defaultCreatedBox;
export const setCreatedBox = (box: Xbiis) => { newBox = box; }

let updatedBox: Xbiis = boxList.items[0] as Xbiis;
export const setUpdatedBox = (box: Xbiis) => { updatedBox = box; }

export const setupBoxMocking = () => {

   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.getXbiis} ))
      .mockReturnValue(Promise.resolve({data: { getXbiis: boxList.items[0] } }));

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.createXbiis} ))
      .mockReturnValue(Promise.resolve({data: { createXbiis: newBox } }));

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateXbiis} ))
      .mockReturnValue(Promise.resolve({data: { updateXbiis: updatedBox } }));
}
