import {BoxRole} from "../BoxRoleType";
import {emptyXbiis, Xbiis} from "../../Box/boxTypes";
import {DefaultRole, Role} from "../../Role/roleTypes";
import {buildBoxRole, printBoxRole, compareBoxRole} from "../BoxRoleType";

const box:Xbiis = {
   ...emptyXbiis,
   id: 'TEST ID',
   name: 'TEST Box',
}

describe('BoxRole and helper functions', () => {

   test('BoxRoleBuilder works', () => {
      const br = buildBoxRole(box, Role.Write);

      expect(br.box).toBe(box);
      expect(br.role).toBe(Role.Write);
   });

   test('BoxRoleBuilder works for empty role', () => {
      const br = buildBoxRole(box);

      expect(br.box).toBe(box);
      expect(br.role).toBe(DefaultRole);
   });

   test('BoxRoleBuilder works for empty', () => {
      const br = buildBoxRole();

      expect(br.box).toBe(emptyXbiis);
      expect(br.role).toBe(DefaultRole);
   });

   test('BoxRoleBuilder works for null', () => {
      const br = buildBoxRole(null);

      expect(br.box).toBe(emptyXbiis);
      expect(br.role).toBe(DefaultRole);
   });

   test('printBoxRole works', () => {
      const br = buildBoxRole(box, Role.Read);
      const printed = printBoxRole(br);

      expect(printed).toBe(`${box.name} (READ)`);
   });

   test('compareBoxRole returns equality', () => {
      const br = buildBoxRole(box, Role.Read);

      expect(compareBoxRole(br, br)).toBeTruthy();
   });

   test('compareBoxRole returns false when Role is different', () => {
      const read = buildBoxRole(box, Role.Read);
      const write = buildBoxRole(box, Role.Write);

      expect(compareBoxRole(read, write)).toBeFalsy();
   });

   test('compareBoxRole returns false when box is different', () => {
      const hasBox = buildBoxRole(box);
      const empty  = buildBoxRole();

      expect(compareBoxRole(hasBox, empty)).toBeFalsy();
   });

   test('compareBoxRole returns false when box id is different', () => {
      const box2 = { ...box, id: 'DIFFERENT ID' };

      const hasBox1 = buildBoxRole(box);
      const hasBox2 = buildBoxRole(box2);

      expect(compareBoxRole(hasBox1, hasBox2)).toBeFalsy();
   });
});

