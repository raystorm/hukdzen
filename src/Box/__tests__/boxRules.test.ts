import { isReadable, isWritable, isOwner, isDefaultBox } from "../boxRules";
import { buildBoxUser } from "../../BoxUser/BoxUserType";
import { AccessLevel, BoxPurpose, emptyXbiis, DefaultBox } from "../boxTypes";
import { emptyUser } from "../../User/userType";
import { Role } from "../../Role/roleTypes";

describe('BoxRules Permissions Helpers', () =>
{
   describe('Owner Permission Tests', () =>
   {
      test('isReadable returns true for box owner regardless of role', () =>
      {
         const owner = { ...emptyUser, id: 'owner-id' };
         const box = { ...emptyXbiis, xbiisOwnerId: 'owner-id' };
         const boxUser = buildBoxUser(owner, box, AccessLevel.NONE);

         expect(isReadable(boxUser)).toBe(true);
      });

      test('isWritable returns true for box owner regardless of role', () =>
      {
         const owner = { ...emptyUser, id: 'owner-id' };
         const box = { ...emptyXbiis, xbiisOwnerId: 'owner-id' };
         const boxUser = buildBoxUser(owner, box, AccessLevel.NONE);

         expect(isWritable(boxUser)).toBe(true);
      });

      test('isOwner returns true when user is box owner', () =>
      {
         const owner = { ...emptyUser, id: 'owner-id' };
         const box = { ...emptyXbiis, xbiisOwnerId: 'owner-id' };
         const boxUser = buildBoxUser(owner, box, Role.Read);

         expect(isOwner(boxUser)).toBe(true);
      });

      test('isOwner returns false when user is not box owner', () =>
      {
         const user = { ...emptyUser, id: 'user-id' };
         const box = { ...emptyXbiis, xbiisOwnerId: 'owner-id' };
         const boxUser = buildBoxUser(user, box, Role.Write);

         expect(isOwner(boxUser)).toBe(false);
      });

      test('isReadable returns false for non-owner with None role', () =>
      {
         const user = { ...emptyUser, id: 'user-id' };
         const box = { ...emptyXbiis, xbiisOwnerId: 'owner-id' };
         const boxUser = buildBoxUser(user, box, Role.None);

         expect(isReadable(boxUser)).toBe(false);
      });

      test('isWritable returns false for non-owner with Read role', () =>
      {
         const user = { ...emptyUser, id: 'user-id' };
         const box = { ...emptyXbiis, xbiisOwnerId: 'owner-id' };
         const boxUser = buildBoxUser(user, box, Role.Read);

         expect(isWritable(boxUser)).toBe(false);
      });
   });

   describe('DEFAULT Box Permission Tests', () =>
   {
      test('isReadable returns true for DEFAULT box regardless of role', () =>
      {
         const user = { ...emptyUser, id: 'user-id' };
         const defaultBox = { ...DefaultBox };
         const boxUser = buildBoxUser(user, defaultBox, Role.None);

         expect(isReadable(boxUser)).toBe(true);
      });

      test('isWritable returns true for DEFAULT box regardless of role', () =>
      {
         const user = { ...emptyUser, id: 'user-id' };
         const defaultBox = { ...DefaultBox };
         const boxUser = buildBoxUser(user, defaultBox, Role.None);

         expect(isWritable(boxUser)).toBe(true);
      });

      test('isDefaultBox returns true for DEFAULT box', () =>
      { expect(isDefaultBox(DefaultBox)).toBe(true); });

      test('isDefaultBox returns false for non-DEFAULT box', () =>
      {
         const userBox = { ...emptyXbiis, purpose: BoxPurpose.USER };
         expect(isDefaultBox(userBox)).toBe(false);
      });

      test('isDefaultBox returns false when purpose.DEFAULT but ID is wrong', () =>
      {
         const fakeDefaultBox = { ...emptyXbiis, id: 'not-the-default-id',
                                  purpose: BoxPurpose.DEFAULT };
         expect(isDefaultBox(fakeDefaultBox)).toBe(false);
      });

   });
});
