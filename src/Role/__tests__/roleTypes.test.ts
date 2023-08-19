import {printRole, getPermissionsForRole, Role} from "../roleTypes";

describe('RoleTypes Helper functions', () =>{

   test('printRole works for undefined Role', () => {
      expect(printRole(undefined)).toBe(undefined);
   });

   test('printRole works for None', () =>{
      expect(printRole(Role.None)).toBe('NONE');
   });

   test('printRole works for Read', () =>{
      expect(printRole(Role.Read)).toBe('READ');
   });

   test('printRole works for Write', () =>{
      expect(printRole(Role.Write)).toBe('WRITE');
   });

   test('printRole throws an error for Unknown',  async() =>{
      //@ts-ignore //force illegal value
      expect(() => { printRole('BAD') } )
        .toThrowError('Unknown Role/AccessLevel: BAD');
   });

   test('getPermissionsForRole works for Undefined', () =>{
      //@ts-ignore //force illegal value
      expect(getPermissionsForRole(undefined)).toBe(undefined);
   });

   test('getPermissionsForRole works for None', () =>{
      expect(getPermissionsForRole(Role.None))
        .toEqual({name: 'NONE', read: false, write: false});
   });

   test('getPermissionsForRole works for Read', () =>{
      expect(getPermissionsForRole(Role.Read))
        .toEqual({name: 'READ', read: true, write: false});
   });

   test('getPermissionsForRole works for Write', () =>{
      expect(getPermissionsForRole(Role.Write))
        .toEqual({name: 'WRITE', read: true, write: true});
   });

   test('getPermissionsForRole throws an error for Unknown', () =>{
      //@ts-ignore //force illegal value
      expect(() => { getPermissionsForRole('BAD') })
         .toThrowError('Unknown RoleType (AccessLevel)');
   });
});