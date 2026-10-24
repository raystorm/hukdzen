import {describe, expect, test} from 'vitest';
import {updateForeignKeys, validateMapping} from '../update-foreign-keys.js';

describe('update-foreign-keys', () => {
   describe('Update User Table IDs', () => {
      // Scenario 2.1
      test('updates User.id to Gen2 sub', () => {
         const data = {
            User: [
               { __typename: 'User', id: 'gen1-id-1', name: 'User 1', email: 'user1@example.com' },
               { __typename: 'User', id: 'gen1-id-2', name: 'User 2', email: 'user2@example.com' },
               { __typename: 'User', id: 'gen1-id-3', name: 'User 3', email: 'user3@example.com' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-id-1', 'gen2-sub-1'],
            ['gen1-id-2', 'gen2-sub-2'],
            ['gen1-id-3', 'gen2-sub-3']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.User[0].id).toBe('gen2-sub-1');
         expect(updated.User[0].name).toBe('User 1');
         expect(updated.User[1].id).toBe('gen2-sub-2');
         expect(updated.User[2].id).toBe('gen2-sub-3');
      });
   });
   
   describe('Duplicate Users sharing one sub', () => {
      test('keeps the User with the earliest createdAt', () => {
         const data = {
            User: [
               { __typename: 'User', id: 'gen1-b', name: 'Later', email: 'a@example.com', createdAt: '2024-03-10T02:19:33.254Z' },
               { __typename: 'User', id: 'gen1-a', name: 'Earliest', email: 'a@example.com', createdAt: '2024-03-09T22:12:21.516Z' },
               { __typename: 'User', id: 'gen1-c', name: 'Middle', email: 'a@example.com', createdAt: '2024-03-09T22:14:09.189Z' },
               { __typename: 'User', id: 'gen1-d', name: 'Other', email: 'b@example.com', createdAt: '2024-01-01T00:00:00.000Z' }
            ]
         };
         const mapping = new Map([
            ['gen1-a', 'sub-1'], ['gen1-b', 'sub-1'], ['gen1-c', 'sub-1'], ['gen1-d', 'sub-2']
         ]);
         
         const result = updateForeignKeys(data, mapping);
         
         expect(result.User).toHaveLength(2);
         expect(result.User.find(u => 'sub-1' === u.id).name).toBe('Earliest');
         expect(result.User.find(u => 'sub-2' === u.id).name).toBe('Other');
      });
   });
   
   describe('Duplicate Users edge cases', () => {
      const mapping = new Map([['a', 'sub-1'], ['b', 'sub-1'], ['c', 'sub-2'], ['d', 'sub-3']]);

      test('leaves Users untouched, in order, when no ids collide', () => {
         const data = { User: [
            { __typename: 'User', id: 'c', name: 'C', createdAt: '2024-01-03T00:00:00.000Z' },
            { __typename: 'User', id: 'd', name: 'D', createdAt: '2024-01-01T00:00:00.000Z' }
         ] };

         const result = updateForeignKeys(data, mapping);

         expect(result.User.map(u => u.id)).toEqual(['sub-2', 'sub-3']);
         expect(result.User.map(u => u.name)).toEqual(['C', 'D']);
      });

      test('keeps the first record when createdAt values are equal', () => {
         const same = '2024-01-01T00:00:00.000Z';
         const data = { User: [
            { __typename: 'User', id: 'a', name: 'First', createdAt: same },
            { __typename: 'User', id: 'b', name: 'Second', createdAt: same }
         ] };

         expect(updateForeignKeys(data, mapping).User.map(u => u.name)).toEqual(['First']);
      });

      test.each([
         ['undated first', [{ id: 'a', name: 'Undated' }, { id: 'b', name: 'Dated', createdAt: '2024-01-01T00:00:00.000Z' }]],
         ['dated first',   [{ id: 'b', name: 'Dated', createdAt: '2024-01-01T00:00:00.000Z' }, { id: 'a', name: 'Undated' }]]
      ])('keeps the dated record over an undated one (%s)', (_label, users) => {
         const data = { User: users.map(u => ({ __typename: 'User', ...u })) };

         const result = updateForeignKeys(data, mapping);

         expect(result.User).toHaveLength(1);
         expect(result.User[0].name).toBe('Dated');
      });

      test('does not change other tables when Users collapse', () => {
         const data = {
            User: [
               { __typename: 'User', id: 'a', name: 'A', createdAt: '2024-01-02T00:00:00.000Z' },
               { __typename: 'User', id: 'b', name: 'B', createdAt: '2024-01-01T00:00:00.000Z' }
            ],
            Box: [{ __typename: 'Box', id: 'box-1', ownerUserId: 'b' }],
            BoxUser: [
               { __typename: 'BoxUser', id: 'bu-1', userUserId: 'a', boxUserUserId: 'b', boxUserBoxId: 'box-1' }
            ]
         };

         const result = updateForeignKeys(data, mapping);

         expect(result.User).toHaveLength(1);
         expect(result.Box[0].ownerUserId).toBe('sub-1');
         expect(result.BoxUser).toHaveLength(1);
         expect(result.BoxUser[0].userUserId).toBe('sub-1');
         expect(result.BoxUser[0].boxUserUserId).toBe('sub-1');
      });
   });

   describe('Update Document Foreign Keys', () => {
      // Scenario 2.2
      test('updates documentContentOwnerUserId to Gen2 sub', () => {
         const data = {
            Document: [
               { id: 'doc-1', documentContentOwnerUserId: 'gen1-user-1', eng: { title: 'Doc 1' } },
               { id: 'doc-2', documentContentOwnerUserId: 'gen1-user-2', eng: { title: 'Doc 2' } },
               { id: 'doc-3', documentContentOwnerUserId: 'gen1-user-1', eng: { title: 'Doc 3' } }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Document[0].documentContentOwnerUserId).toBe('gen2-sub-1');
         expect(updated.Document[0].eng.title).toBe('Doc 1');
         expect(updated.Document[1].documentContentOwnerUserId).toBe('gen2-sub-2');
         expect(updated.Document[2].documentContentOwnerUserId).toBe('gen2-sub-1');
      });
   });
   
   describe('Update Box Foreign Keys', () => {
      // Scenario 2.3
      test('updates ownerUserId to Gen2 sub', () => {
         const data = {
            Box: [
               { id: 'box-1', name: 'Box 1', ownerUserId: 'gen1-user-1' },
               { id: 'box-2', name: 'Box 2', ownerUserId: 'gen1-user-2' },
               { id: 'box-3', name: 'Box 3', ownerUserId: 'gen1-user-3' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2'],
            ['gen1-user-3', 'gen2-sub-3']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Box[0].ownerUserId).toBe('gen2-sub-1');
         expect(updated.Box[0].name).toBe('Box 1');
         expect(updated.Box[1].ownerUserId).toBe('gen2-sub-2');
         expect(updated.Box[2].ownerUserId).toBe('gen2-sub-3');
      });
   });
   
   describe('Update BoxUser Foreign Keys (Both Fields)', () => {
      // Scenario 2.4
      test('updates both userUserId and boxUserUserId to Gen2 sub', () => {
         const data = {
            BoxUser: [
               { id: 'bu-1', userUserId: 'gen1-user-1', boxUserUserId: 'gen1-user-1', boxUserBoxId: 'box-1', role: 'OWNER' },
               { id: 'bu-2', userUserId: 'gen1-user-2', boxUserUserId: 'gen1-user-2', boxUserBoxId: 'box-1', role: 'EDITOR' },
               { id: 'bu-3', userUserId: 'gen1-user-3', boxUserUserId: 'gen1-user-3', boxUserBoxId: 'box-2', role: 'VIEWER' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2'],
            ['gen1-user-3', 'gen2-sub-3']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.BoxUser[0].userUserId).toBe('gen2-sub-1');
         expect(updated.BoxUser[0].boxUserUserId).toBe('gen2-sub-1');
         expect(updated.BoxUser[0].role).toBe('OWNER');
         expect(updated.BoxUser[1].userUserId).toBe('gen2-sub-2');
         expect(updated.BoxUser[1].boxUserUserId).toBe('gen2-sub-2');
         expect(updated.BoxUser[2].userUserId).toBe('gen2-sub-3');
         expect(updated.BoxUser[2].boxUserUserId).toBe('gen2-sub-3');
      });
   });
   
   describe('Update Collection Foreign Keys', () => {
      // Scenario 2.5
      test('updates collectionContentOwnerUserId to Gen2 sub', () => {
         const data = {
            Collection: [
               { id: 'coll-1', collectionContentOwnerUserId: 'gen1-user-1', eng: { title: 'Collection 1' } },
               { id: 'coll-2', collectionContentOwnerUserId: 'gen1-user-2', eng: { title: 'Collection 2' } }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Collection[0].collectionContentOwnerUserId).toBe('gen2-sub-1');
         expect(updated.Collection[0].eng.title).toBe('Collection 1');
         expect(updated.Collection[1].collectionContentOwnerUserId).toBe('gen2-sub-2');
      });
   });
   
   describe('Handle Missing Mapping (Fallback)', () => {
      // Scenario 2.6
      test('leaves ID unchanged when not in mapping', () => {
         const data = {
            Document: [
               { id: 'doc-1', documentContentOwnerUserId: 'gen1-user-1' },
               { id: 'doc-2', documentContentOwnerUserId: 'gen1-user-missing' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Document[0].documentContentOwnerUserId).toBe('gen2-sub-1');
         expect(updated.Document[1].documentContentOwnerUserId).toBe('gen1-user-missing');
      });
   });
   
   describe('Validate Mapping Completeness', () => {
      // Scenario 2.7
      test('fails validation when mapping is incomplete', () => {
         const users = [
            { id: 'gen1-1', email: 'user1@example.com' },
            { id: 'gen1-2', email: 'user2@example.com' },
            { id: 'gen1-3', email: 'user3@example.com' }
         ];
         
         const mapping = new Map([
            ['gen1-1', 'gen2-sub-1']
         ]);
         
         const result = validateMapping(users, mapping);
         
         expect(result.valid).toBe(false);
         expect(result.missingUsers).toHaveLength(2);
         expect(result.missingUsers[0].id).toBe('gen1-2');
         expect(result.missingUsers[1].id).toBe('gen1-3');
      });
   });
   
   describe('Validate Mapping Completeness (Success)', () => {
      // Scenario 2.8
      test('passes validation when mapping is complete', () => {
         const users = [
            { id: 'gen1-1', email: 'user1@example.com' },
            { id: 'gen1-2', email: 'user2@example.com' },
            { id: 'gen1-3', email: 'user3@example.com' }
         ];
         
         const mapping = new Map([
            ['gen1-1', 'gen2-sub-1'],
            ['gen1-2', 'gen2-sub-2'],
            ['gen1-3', 'gen2-sub-3']
         ]);
         
         const result = validateMapping(users, mapping);
         
         expect(result.valid).toBe(true);
         expect(result.missingUsers).toHaveLength(0);
      });
   });
});
