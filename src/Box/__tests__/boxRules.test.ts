import { isReadable, isWritable, isOwner } from "../boxRules";
import { buildBoxUser } from "../../BoxUser/BoxUserType";
import { AccessLevel, emptyXbiis } from "../boxTypes";
import { emptyUser } from "../../User/userType";
import { Role } from "../../Role/roleTypes";

// src/Box/__tests__/boxRules.test.ts
describe('Owner Permission Tests', () =>
{
   test('isReadable returns true for box owner regardless of role', () => {
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
