import { describe, it, expect, beforeEach } from 'vitest';
import {
   validateDocumentSchema,
   validateBoxSchema,
   validateCollectionSchema,
   validateBoxUserSchema,
   validateCollectionItemSchema,
   validateForeignKeys,
   validateCounts
} from '../validate-transformation.js';

describe('validate-transformation.js', () => {
   let errors;

   beforeEach(() => {
      errors = {
         schema: [],
         foreignKey: [],
         missingField: []
      };
   });

   describe('Group 1: Document Schema Validation', () => {
      it('1.1: should validate nested Summary structure (eng/bc/ak with title/description)', () => {
         const validDoc = {
            __typename: 'Document',
            id: 'doc-1',
            eng: { title: 'Title', description: 'Desc' },
            bc: { title: 'BC Title', description: 'BC Desc' },
            ak: { title: 'AK Title', description: 'AK Desc' },
            fileKey: 'file.pdf',
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(validDoc, 0, errors);

         expect(errors.schema).toHaveLength(0);
         expect(errors.missingField).toHaveLength(0);
      });

      it('1.2: should detect missing nested Summary objects', () => {
         const invalidDoc = {
            __typename: 'Document',
            id: 'doc-1',
            fileKey: 'file.pdf',
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(invalidDoc, 0, errors);

         expect(errors.schema.length).toBeGreaterThan(0);
         expect(errors.schema.some(e => e.field === 'eng')).toBe(true);
         expect(errors.schema.some(e => e.field === 'bc')).toBe(true);
         expect(errors.schema.some(e => e.field === 'ak')).toBe(true);
      });

      it('1.3: should validate foreign key renames', () => {
         const docWithOldFields = {
            __typename: 'Document',
            id: 'doc-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            fileKey: 'file.pdf',
            created: '2023-01-01',
            version: '1.0',
            documentDetailsAuthorId: 'author-1',
            documentDetailsDocOwnerId: 'user-1',
            documentDetailsBoxId: 'box-1'
         };

         validateDocumentSchema(docWithOldFields, 0, errors);

         expect(errors.schema.some(e => e.field === 'documentDetailsAuthorId')).toBe(true);
         expect(errors.schema.some(e => e.field === 'documentDetailsDocOwnerId')).toBe(true);
         expect(errors.schema.some(e => e.field === 'documentDetailsBoxId')).toBe(true);
         expect(errors.missingField.some(e => e.field === 'documentAuthorId')).toBe(true);
      });

      it('1.4: should validate __typename field equals "Document"', () => {
         const wrongTypename = {
            __typename: 'DocumentDetails',
            id: 'doc-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            fileKey: 'file.pdf',
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(wrongTypename, 0, errors);

         expect(errors.schema.some(e => e.field === '__typename')).toBe(true);
      });

      it('1.5: should detect missing required fields (fileKey)', () => {
         const missingFileKey = {
            __typename: 'Document',
            id: 'doc-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(missingFileKey, 0, errors);

         expect(errors.missingField.some(e => e.field === 'fileKey')).toBe(true);
      });
   });

   describe('Group 2: Box Schema Validation', () => {
      it('2.1: should validate foreign key rename (xbiisOwnerId → ownerUserId)', () => {
         const boxWithOldField = {
            __typename: 'Box',
            id: 'box-1',
            name: 'Test Box',
            xbiisOwnerId: 'user-1'
         };

         validateBoxSchema(boxWithOldField, 0, errors);

         expect(errors.schema.some(e => e.field === 'xbiisOwnerId')).toBe(true);
         expect(errors.missingField.some(e => e.field === 'ownerUserId')).toBe(true);
      });

      it('2.2: should validate __typename field equals "Box"', () => {
         const wrongTypename = {
            __typename: 'Xbiis',
            id: 'box-1',
            name: 'Test Box',
            ownerUserId: 'user-1'
         };

         validateBoxSchema(wrongTypename, 0, errors);

         expect(errors.schema.some(e => e.field === '__typename')).toBe(true);
      });
   });

   describe('Group 3: Collection Schema Validation', () => {
      it('3.1: should validate nested Summary structure', () => {
         const validCollection = {
            __typename: 'Collection',
            id: 'coll-1',
            eng: { title: 'Title', description: 'Desc' },
            bc: { title: 'BC Title', description: 'BC Desc' },
            ak: { title: 'AK Title', description: 'AK Desc' },
            created: '2023-01-01',
            collectionContentOwnerUserId: 'user-1',
            collectionBoxId: 'box-1'
         };

         validateCollectionSchema(validCollection, 0, errors);

         expect(errors.schema).toHaveLength(0);
         expect(errors.missingField).toHaveLength(0);
      });

      it('3.2: should validate foreign key renames', () => {
         const collectionWithOldField = {
            __typename: 'Collection',
            id: 'coll-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            created: '2023-01-01',
            collectionCollectionOwnerId: 'user-1',
            collectionBoxId: 'box-1'
         };

         validateCollectionSchema(collectionWithOldField, 0, errors);

         expect(errors.schema.some(e => e.field === 'collectionCollectionOwnerId')).toBe(true);
         expect(errors.missingField.some(e => e.field === 'collectionContentOwnerUserId')).toBe(true);
      });
   });

   describe('Group 4: Data Integrity Validation', () => {
      it('4.1: should validate no data loss (count match)', () => {
         const result = validateCounts(10, 10, 'Document.json');

         expect(result.hasError).toBe(false);
      });

      it('4.2: should detect count mismatch', () => {
         const result = validateCounts(10, 8, 'Document.json');

         expect(result.hasError).toBe(true);
         expect(result.error.message).toContain('Count mismatch');
      });

      it('4.3: should validate foreign key references exist', () => {
         const documents = [
            { id: 'doc-1', documentAuthorId: 'author-1', documentContentOwnerUserId: 'user-1', documentBoxBoxId: 'box-1' }
         ];
         const authors = [{ id: 'author-1' }];
         const users = [{ id: 'user-1' }];
         const boxes = [{ id: 'box-1' }];

         validateForeignKeys(documents, authors, users, boxes, errors);

         expect(errors.foreignKey).toHaveLength(0);
      });

      it('4.4: should detect orphaned foreign key references', () => {
         const documents = [
            { id: 'doc-1', documentAuthorId: 'author-999', documentContentOwnerUserId: 'user-1', documentBoxBoxId: 'box-1' }
         ];
         const authors = [{ id: 'author-1' }];
         const users = [{ id: 'user-1' }];
         const boxes = [{ id: 'box-1' }];

         validateForeignKeys(documents, authors, users, boxes, errors);

         expect(errors.foreignKey.some(e => e.field === 'documentAuthorId')).toBe(true);
      });
   });

   describe('Group 5: Null and Missing Field Handling', () => {
      it('5.1: should accept empty strings in Summary fields', () => {
         const docWithEmptyStrings = {
            __typename: 'Document',
            id: 'doc-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            fileKey: 'file.pdf',
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(docWithEmptyStrings, 0, errors);

         expect(errors.schema).toHaveLength(0);
      });

      it('5.2: should accept null for optional fields (fileHash)', () => {
         const docWithNullOptional = {
            __typename: 'Document',
            id: 'doc-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            fileKey: 'file.pdf',
            fileHash: null,
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(docWithNullOptional, 0, errors);

         expect(errors.missingField).toHaveLength(0);
      });

      it('5.3: should detect missing required fields', () => {
         const docMissingRequired = {
            __typename: 'Document',
            id: 'doc-1',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            created: '2023-01-01',
            version: '1.0',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(docMissingRequired, 0, errors);

         expect(errors.missingField.some(e => e.field === 'fileKey')).toBe(true);
         expect(errors.missingField.some(e => e.field === 'documentAuthorId')).toBe(true);
      });
   });

   describe('Group 6: Error Reporting', () => {
      it('6.1: should report errors with file path, record id, field name', () => {
         const invalidDoc = {
            __typename: 'Document',
            id: 'doc-123',
            eng: { title: '', description: '' },
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            created: '2023-01-01',
            version: '1.0',
            documentAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(invalidDoc, 0, errors);

         const error = errors.missingField[0];
         expect(error.file).toBe('Document.json');
         expect(error.recordId).toBe('doc-123');
         expect(error.field).toBe('fileKey');
         expect(error.message).toBeTruthy();
      });

      it('6.2: should group errors by type', () => {
         const invalidDoc = {
            __typename: 'Wrong',
            id: 'doc-1',
            bc: { title: '', description: '' },
            ak: { title: '', description: '' },
            created: '2023-01-01',
            version: '1.0',
            documentDetailsAuthorId: 'author-1',
            documentContentOwnerUserId: 'user-1',
            documentBoxBoxId: 'box-1'
         };

         validateDocumentSchema(invalidDoc, 0, errors);

         expect(errors.schema.length).toBeGreaterThan(0);
         expect(errors.missingField.length).toBeGreaterThan(0);
      });
   });

   describe('Group 7: BoxUser and CollectionItem Validation', () => {
      it('7.1: should validate BoxUser field renames', () => {
         const validBoxUser = {
            __typename: 'BoxUser',
            id: 'bu-1',
            role: 'ADMIN',
            userUserId: 'user-1',
            boxUserUserId: 'user-1',
            boxUserBoxId: 'box-1'
         };

         validateBoxUserSchema(validBoxUser, 0, errors);

         expect(errors.schema).toHaveLength(0);
         expect(errors.missingField).toHaveLength(0);
      });

      it('7.2: should validate CollectionItem field renames', () => {
         const validItem = {
            __typename: 'CollectionItem',
            id: 'ci-1',
            collectionCollectionId: 'coll-1',
            collectionItemDocumentId: 'doc-1',
            collectionItemChildCollectionId: null,
            order: 1,
            created: '2023-01-01'
         };

         validateCollectionItemSchema(validItem, 0, errors);

         expect(errors.schema).toHaveLength(0);
         expect(errors.missingField).toHaveLength(0);
      });

      it('7.3: should detect old field names in CollectionItem', () => {
         const itemWithOldFields = {
            __typename: 'CollectionItem',
            id: 'ci-1',
            collectionID: 'coll-1',
            documentID: 'doc-1',
            order: 1,
            created: '2023-01-01'
         };

         validateCollectionItemSchema(itemWithOldFields, 0, errors);

         expect(errors.schema.some(e => e.field === 'collectionID')).toBe(true);
         expect(errors.schema.some(e => e.field === 'documentID')).toBe(true);
      });
   });
});
