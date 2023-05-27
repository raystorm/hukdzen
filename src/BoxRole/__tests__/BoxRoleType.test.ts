import {BoxRole} from "../BoxRoleType";
import {emptyXbiis, Xbiis} from "../../Box/boxTypes";
import {DefaultRole, Role} from "../../Role/roleTypes";
import {BoxRoleBuilder, printBoxRole, compareBoxRole} from "../BoxRoleType";

const box:Xbiis = {
   ...emptyXbiis,
   id: 'TEST ID',
   name: 'TEST Box',
}

describe('BoxRole and helper functions', () => {

   test('BoxRoleBuilder works', () => {
      const br = BoxRoleBuilder(box, Role.Write);

      expect(br.box).toBe(box);
      expect(br.role).toBe(Role.Write);
   });

   test('BoxRoleBuilder works for empty role', () => {
      const br = BoxRoleBuilder(box);

      expect(br.box).toBe(box);
      expect(br.role).toBe(DefaultRole);
   });

   test('BoxRoleBuilder works for empty', () => {
      const br = BoxRoleBuilder();

      expect(br.box).toBe(emptyXbiis);
      expect(br.role).toBe(DefaultRole);
   });

   test('BoxRoleBuilder works for null', () => {
      const br = BoxRoleBuilder(null);

      expect(br.box).toBe(emptyXbiis);
      expect(br.role).toBe(DefaultRole);
   });

   test('printBoxRole works', () => {
      const br = BoxRoleBuilder(box, Role.Read);
      const printed = printBoxRole(br);

      expect(printed).toBe(`${box.name} (READ)`);
   });

   test('compareBoxRole returns equality', () => {
      const br = BoxRoleBuilder(box, Role.Read);

      expect(compareBoxRole(br, br)).toBeTruthy();
   });

   test('compareBoxRole returns false when Role is different', () => {
      const read = BoxRoleBuilder(box, Role.Read);
      const write = BoxRoleBuilder(box, Role.Write);

      expect(compareBoxRole(read, write)).toBeFalsy();
   });

   test('compareBoxRole returns false when box is different', () => {
      const hasBox = BoxRoleBuilder(box);
      const empty  = BoxRoleBuilder();

      expect(compareBoxRole(hasBox, empty)).toBeFalsy();
   });

   test('compareBoxRole returns false when box id is different', () => {
      const box2 = { ...box, id: 'DIFFERENT ID' };

      const hasBox1 = BoxRoleBuilder(box);
      const hasBox2 = BoxRoleBuilder(box2);

      expect(compareBoxRole(hasBox1, hasBox2)).toBeFalsy();
   });
});

