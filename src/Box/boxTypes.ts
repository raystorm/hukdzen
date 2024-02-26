import {Role} from '../Role/roleTypes';
import {emptyUser} from '../User/userType';
import {Xbiis as box} from "../types/AmplifyTypes";
import {printName} from "../types";
import {Environments, getEnv} from "../components/shared/location";

/**
 * Box Type (container for grouping content items/permissions)
 */
export type Xbiis = box;
/*export interface Xbiis {
   id:           string,
   name:         string,
   owner:        Gyet,
   defaultRole?: RoleType,
} */

export const emptyXbiis: Xbiis = {
   __typename:   'Xbiis',
   id:           '',
   name:         '',
   owner:        emptyUser,
   xbiisOwnerId: emptyUser.id,
   defaultRole:  Role.Write,
   createdAt:    '',
   updatedAt:    '',
};

//prod owner:
const ProdBoxOwner: string = '4756fb61-ce77-40cb-8076-226c438d0dc6';

const DevBoxOwner: string = '6703dc53-6a3f-4631-9775-30b8d2c01289';

const getBoxOwner = () : string => {
   const env: Environments = getEnv();
   switch (env)
   {
      case Environments.dev:
      case Environments.local:
         return DevBoxOwner;
      case Environments.prod:
      case Environments.published:
      default: //default to prod (or should this throw an error?)
         return ProdBoxOwner;
   }
}


export const initialXbiis: Xbiis = {
   __typename:   'Xbiis',
   id:           '75ca183f-a199-4d3d-9ac3-e10432965276',
   name:         'Public', //belongs to everyone
   waa:          'Nlip \'gynnm', //belongs to everyone
   owner:        emptyUser,
   xbiisOwnerId: getBoxOwner(),
   defaultRole:  Role.Write,
   createdAt:    '2023-06-23T01:13:51.459Z',
   updatedAt:    '2023-07-23T19:37:01.255Z',
};

export const printXbiis = (box: Xbiis) => { return printName(box); }
export const printBox = (box: Xbiis) => { return printName(box); }

export const DefaultBox = initialXbiis;