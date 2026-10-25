import {describe, expect, test} from 'vitest';
import {SYSTEM_USER, SYSTEM_USER_ID, UNKNOWN_AUTHOR} from '../config.js';
import {isUnknownAuthor, mergeUnknownAuthors, updateForeignKeys, validateMapping} from '../update-foreign-keys.js';

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

      // The @hasOne resolver for Document.contentOwner reads documentContentOwnerId
      test('updates documentContentOwnerId to Gen2 sub, and leaves it absent when not set', () => {
         const data = {
            Document: [
               { id: 'doc-1', documentContentOwnerUserId: 'gen1-user-1', documentContentOwnerId: 'gen1-user-1' },
               { id: 'doc-2', documentContentOwnerUserId: 'gen1-user-2' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Document[0].documentContentOwnerId).toBe('gen2-sub-1');
         expect(updated.Document[0].documentContentOwnerUserId).toBe('gen2-sub-1');
         expect(updated.Document[1]).not.toHaveProperty('documentContentOwnerId');
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
      
      // The @hasOne resolver for Box.owner reads boxOwnerId, and boxRules.isOwner compares it
      test('updates boxOwnerId to Gen2 sub, and leaves it absent when not set', () => {
         const data = {
            Box: [
               { id: 'box-1', ownerUserId: 'gen1-user-1', boxOwnerId: 'gen1-user-1' },
               { id: 'box-2', ownerUserId: 'gen1-user-2' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Box[0].boxOwnerId).toBe('gen2-sub-1');
         expect(updated.Box[0].ownerUserId).toBe('gen2-sub-1');
         expect(updated.Box[1]).not.toHaveProperty('boxOwnerId');
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
      
      // The @hasOne resolver for Collection.contentOwner reads collectionContentOwnerId
      test('updates collectionContentOwnerId to Gen2 sub, and leaves it absent when not set', () => {
         const data = {
            Collection: [
               { id: 'coll-1', collectionContentOwnerUserId: 'gen1-user-1', collectionContentOwnerId: 'gen1-user-1' },
               { id: 'coll-2', collectionContentOwnerUserId: 'gen1-user-2' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1'],
            ['gen1-user-2', 'gen2-sub-2']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Collection[0].collectionContentOwnerId).toBe('gen2-sub-1');
         expect(updated.Collection[0].collectionContentOwnerUserId).toBe('gen2-sub-1');
         expect(updated.Collection[1]).not.toHaveProperty('collectionContentOwnerId');
      });
   });
   
   describe('Handle Missing Mapping (Fallback)', () => {
      // Scenario 2.6
      test('assigns an owner with no mapping to the System User', () => {
         const data = {
            Document: [
               { id: 'doc-1', documentContentOwnerUserId: 'gen1-user-1', documentContentOwnerId: 'gen1-user-1' },
               { id: 'doc-2', documentContentOwnerUserId: 'gen1-user-missing', documentContentOwnerId: 'gen1-user-missing' }
            ]
         };
         
         const mapping = new Map([
            ['gen1-user-1', 'gen2-sub-1']
         ]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Document[0].documentContentOwnerUserId).toBe('gen2-sub-1');
         expect(updated.Document[0].documentContentOwnerId).toBe('gen2-sub-1');
         expect(updated.Document[1].documentContentOwnerUserId).toBe(SYSTEM_USER_ID);
         expect(updated.Document[1].documentContentOwnerId).toBe(SYSTEM_USER_ID);
      });
      
      test('assigns Box and Collection owners with no mapping to the System User', () => {
         const data = {
            Box: [{ id: 'box-1', ownerUserId: 'gen1-missing', boxOwnerId: 'gen1-missing' }],
            Collection: [{ id: 'coll-1', collectionContentOwnerUserId: 'gen1-missing',
                           collectionContentOwnerId: 'gen1-missing' }]
         };
         
         const updated = updateForeignKeys(data, new Map());
         
         expect(updated.Box[0].ownerUserId).toBe(SYSTEM_USER_ID);
         expect(updated.Box[0].boxOwnerId).toBe(SYSTEM_USER_ID);
         expect(updated.Collection[0].collectionContentOwnerUserId).toBe(SYSTEM_USER_ID);
         expect(updated.Collection[0].collectionContentOwnerId).toBe(SYSTEM_USER_ID);
      });
      
      test('keeps System User ownership, even if the mapping has an entry for it', () => {
         const data = { Box: [{ id: 'box-1', ownerUserId: SYSTEM_USER_ID, boxOwnerId: SYSTEM_USER_ID }] };
         
         const updated = updateForeignKeys(data, new Map([[SYSTEM_USER_ID, 'some-sub']]));
         
         expect(updated.Box[0].ownerUserId).toBe(SYSTEM_USER_ID);
         expect(updated.Box[0].boxOwnerId).toBe(SYSTEM_USER_ID);
      });
      
      test('keeps ownership for accounts that share an email (they map to one Gen2 account)', () => {
         const data = {
            Box: [
               { id: 'box-1', ownerUserId: 'facebook_1', boxOwnerId: 'facebook_1' },
               { id: 'box-2', ownerUserId: 'local-1', boxOwnerId: 'local-1' }
            ]
         };
         
         const mapping = new Map([['facebook_1', 'sub-shared'], ['local-1', 'sub-shared']]);
         
         const updated = updateForeignKeys(data, mapping);
         
         expect(updated.Box.map(b => b.ownerUserId)).toEqual(['sub-shared', 'sub-shared']);
         expect(updated.Box.map(b => b.boxOwnerId)).toEqual(['sub-shared', 'sub-shared']);
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
   
   describe('Unknown Author merge', () => {
      const empty = new Map();
      const author = (id, name, extra = {}) => ({ __typename: 'Author', id, name, ...extra });
      
      test.each([
         ['Unknown', true], ['Unkown', true], ['  unknown ', true], ['UNKNOWN', true],
         ['Unknown Person', false], ['Alex', false], ['', false], [undefined, false]
      ])('isUnknownAuthor(%j) is %s', (name, expected) => {
         expect(isUnknownAuthor({ name })).toBe(expected);
      });
      
      test('gives the Gen1 Unknown author the forced Gen2 id', () => {
         const data = { Author: [
            author('a-1', 'Alex'),
            author('gen1-unknown', 'Unknown', { waa: 'something else', createdAt: '2024-04-14T20:11:10.501Z' }),
            author('a-2', 'Test')
         ] };
         
         const result = updateForeignKeys(data, empty);
         
         expect(result.Author.map(a => a.id)).toEqual(['a-1', UNKNOWN_AUTHOR.id, 'a-2']);
         const unknown = result.Author.find(a => UNKNOWN_AUTHOR.id === a.id);
         expect(unknown.name).toBe(UNKNOWN_AUTHOR.name);
         expect(unknown.waa).toBe(UNKNOWN_AUTHOR.waa);
         expect(unknown.createdAt).toBe('2024-04-14T20:11:10.501Z');
      });
      
      test('re-points Document.documentAuthorId to the forced id', () => {
         const data = {
            Author: [author('a-1', 'Alex'), author('gen1-unknown', 'Unknown')],
            Document: [
               { id: 'd-1', documentAuthorId: 'gen1-unknown' },
               { id: 'd-2', documentAuthorId: 'a-1' },
               { id: 'd-3', documentAuthorId: 'gen1-unknown' }
            ]
         };
         
         const result = updateForeignKeys(data, empty);
         
         expect(result.Document.map(d => d.documentAuthorId))
            .toEqual([UNKNOWN_AUTHOR.id, 'a-1', UNKNOWN_AUTHOR.id]);
      });
      
      test('collapses several Unknown authors (including the typo) into one', () => {
         const data = {
            Author: [
               author('u-2', 'Unkown', { createdAt: '2024-05-01T00:00:00.000Z' }),
               author('a-1', 'Alex'),
               author('u-1', 'Unknown', { createdAt: '2024-04-01T00:00:00.000Z' })
            ],
            Document: [{ id: 'd-1', documentAuthorId: 'u-1' }, { id: 'd-2', documentAuthorId: 'u-2' }]
         };
         
         const result = updateForeignKeys(data, empty);
         
         expect(result.Author).toHaveLength(2);
         expect(result.Author.filter(a => UNKNOWN_AUTHOR.id === a.id)).toHaveLength(1);
         expect(result.Author.find(a => UNKNOWN_AUTHOR.id === a.id).createdAt).toBe('2024-04-01T00:00:00.000Z');
         expect(result.Document.map(d => d.documentAuthorId)).toEqual([UNKNOWN_AUTHOR.id, UNKNOWN_AUTHOR.id]);
      });
      
      test('does not change Authors or Documents when there is no Unknown author', () => {
         const data = {
            Author: [author('a-1', 'Alex')],
            Document: [
               { id: 'd-1', documentAuthorId: 'a-1', documentContentOwnerUserId: SYSTEM_USER_ID },
               { id: 'd-2', documentContentOwnerUserId: SYSTEM_USER_ID }
            ]
         };
         
         const result = updateForeignKeys(data, empty);
         
         expect(result.Author).toEqual(data.Author);
         expect(result.Document).toEqual(data.Document);
         expect(result.Document[1]).not.toHaveProperty('documentAuthorId');
      });
      
      test('is idempotent when the Unknown author already has the forced id', () => {
         const authors = [author(UNKNOWN_AUTHOR.id, 'Unknown')];
         
         const { authors: merged, replacedIds } = mergeUnknownAuthors(authors);
         
         expect(merged).toHaveLength(1);
         expect(merged[0].id).toBe(UNKNOWN_AUTHOR.id);
         expect(replacedIds.size).toBe(0);
      });
      
      test('still updates User foreign keys alongside the merge', () => {
         const data = {
            Author: [author('gen1-unknown', 'Unknown')],
            Document: [{ id: 'd-1', documentAuthorId: 'gen1-unknown', documentContentOwnerUserId: 'g1' }]
         };
         
         const result = updateForeignKeys(data, new Map([['g1', 'sub-1']]));
         
         expect(result.Document[0].documentContentOwnerUserId).toBe('sub-1');
         expect(result.Document[0].documentAuthorId).toBe(UNKNOWN_AUTHOR.id);
      });
   });
   
   describe('System User keeps its fixed id', () => {
      const data = () => ({
         User: [
            { __typename: 'User', id: SYSTEM_USER_ID, name: 'Sys', email: 'old@example.com', isAdmin: true,
              createdAt: '2023-06-23T01:13:51.459Z' },
            { __typename: 'User', id: 'gen1-a', name: 'A', email: 'a@example.com' }
         ],
         Box: [{ __typename: 'Box', id: 'box-1', ownerUserId: SYSTEM_USER_ID }],
         BoxUser: [
            { __typename: 'BoxUser', id: 'bu-1', userUserId: SYSTEM_USER_ID, boxUserUserId: SYSTEM_USER_ID, boxUserBoxId: 'box-1' }
         ],
         Document: [{ id: 'd-1', documentContentOwnerUserId: SYSTEM_USER_ID }]
      });
      
      test('leaves System User references unchanged when the mapping has no entry', () => {
         const result = updateForeignKeys(data(), new Map([['gen1-a', 'sub-a']]));
         
         expect(result.User.map(u => u.id)).toEqual([SYSTEM_USER_ID, 'sub-a']);
         expect(result.Box[0].ownerUserId).toBe(SYSTEM_USER_ID);
         expect(result.BoxUser[0].userUserId).toBe(SYSTEM_USER_ID);
         expect(result.BoxUser[0].boxUserUserId).toBe(SYSTEM_USER_ID);
         expect(result.Document[0].documentContentOwnerUserId).toBe(SYSTEM_USER_ID);
      });
      
      test('ignores a stale mapping entry for the System User', () => {
         const stale = new Map([['gen1-a', 'sub-a'], [SYSTEM_USER_ID, 'b4d8b498-3051-705e-4891-52dcd12bd99b']]);
         
         const result = updateForeignKeys(data(), stale);
         
         expect(result.User[0].id).toBe(SYSTEM_USER_ID);
         expect(result.Box[0].ownerUserId).toBe(SYSTEM_USER_ID);
         expect(result.BoxUser[0].boxUserUserId).toBe(SYSTEM_USER_ID);
      });
      
      test('forces the canonical System User values and keeps createdAt', () => {
         const result = updateForeignKeys(data(), new Map([['gen1-a', 'sub-a']]));
         const system = result.User[0];
         
         expect(system.name).toBe(SYSTEM_USER.name);
         expect(system.email).toBe(SYSTEM_USER.email);
         expect(system.isAdmin).toBe(false);
         expect(system.createdAt).toBe('2023-06-23T01:13:51.459Z');
      });
      
      test('does not mutate the mapping passed in', () => {
         const mapping = new Map([[SYSTEM_USER_ID, 'x']]);
         
         updateForeignKeys(data(), mapping);
         
         expect(mapping.has(SYSTEM_USER_ID)).toBe(true);
      });
      
      test('validateMapping does not require a mapping for the System User', () => {
         const users = [{ id: SYSTEM_USER_ID, email: SYSTEM_USER.email }, { id: 'gen1-a', email: 'a@example.com' }];
         
         expect(validateMapping(users, new Map([['gen1-a', 'sub-a']])).valid).toBe(true);
         expect(validateMapping(users, new Map()).missingUsers.map(u => u.id)).toEqual(['gen1-a']);
      });
   });
});
