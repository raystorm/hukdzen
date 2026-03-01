import type { BoxRequest, BoxRequestInput } from "../graphql/API";
import { BoxRequestStatus } from "../graphql/API";
import { emptyUser } from '../User/userType';

export type { BoxRequest, BoxRequestInput };
export { BoxRequestStatus }

export const emptyBoxRequest: BoxRequest =
{
   __typename:            'BoxRequest',
   id:                    '',
   requestedName:         '',
   requestReason:         '',
   status:                BoxRequestStatus.PENDING,
   createdBy:             emptyUser,
   boxRequestCreatedById: emptyUser.id,
   createdAt:             new Date().toISOString(),
   updatedAt:             new Date().toISOString(),
};

export const printBoxRequest = (boxRequest: BoxRequest) =>
{ return `${boxRequest.requestedName ?? 'MISSING BoxRequest Name'}`; }
