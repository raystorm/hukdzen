import {vi} from 'vitest';
import { when } from "vitest-when";
import { generateClient } from "@aws-amplify/api";

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import boxRequestList from "../__fixtures__/boxRequestList.json";
import { BoxRequest, emptyBoxRequest } from "../../BoxRequest/boxRequestType";

const client = generateClient();

export const setupBoxRequestListMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.listBoxRequests}))
      .thenResolve({data: { listBoxRequests: boxRequestList }});
};

export const defaultCreatedBoxRequest: BoxRequest = {
   ...emptyBoxRequest,
   id: 'Newly Generated GUID',
   requestedName: 'Test Box Request',
   requestReason: 'Testing purposes',
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

let getBoxRequest = boxRequestList.items[0] as BoxRequest;
export const setGetBoxRequest = (br: BoxRequest) => { getBoxRequest = br; };

let newBoxRequest = defaultCreatedBoxRequest;
export const setCreatedBoxRequest = (br: BoxRequest) => { newBoxRequest = br; };

let updatedBoxRequest = boxRequestList.items[0] as BoxRequest;
export const setUpdatedBoxRequest = (br: BoxRequest) => { updatedBoxRequest = br; };

export const setupBoxRequestMocking = () => {
   when(client.graphql)
      .calledWith(expect.objectContaining({query: queries.getBoxRequest}))
      .thenResolve({data: { getBoxRequest: getBoxRequest }});

   when(client.graphql)
      .calledWith(expect.objectContaining({query: mutations.createBoxRequestGuarded}))
      .thenResolve({data: { createBoxRequestGuarded: newBoxRequest }});

   when(client.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateBoxRequestGuarded}))
      .thenResolve({data: { updateBoxRequestGuarded: updatedBoxRequest }});
};
