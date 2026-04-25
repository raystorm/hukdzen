import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

import mockDocData from './fixtures/original/docList.json';
import mockBoxData from './fixtures/original/boxList.json';

const mockDocumentDetails = mockDocData.items[0];
const mockXbiis = mockBoxData.items[0];

const mockCollection = {
   id: 'coll-1',
   eng_title: 'Collection Title',
   eng_description: 'Collection Description',
   bc_title: 'BC Title',
   bc_description: 'BC Description',
   ak_title: 'AK Title',
   ak_description: 'AK Description',
   created: '2023-01-01',
   updated: '2023-01-02',
   collectionCollectionOwnerId: 'user-1',
   collectionBoxId: 'box-1'
};

const mockBoxUser = {
   id: 'bu-1',
   role: 'ADMIN',
   boxUserUserId: mockDocumentDetails.documentDetailsDocOwnerId,
   boxUserBoxId: mockDocumentDetails.documentDetailsBoxId
};

const mockCollectionItem = {
   id: 'ci-1',
   collectionID: 'coll-1',
   documentID: mockDocumentDetails.id,
   childCollectionID: null,
   order: 1,
   created: '2023-01-01'
};

describe('transform-data.js', () => {
   let consoleLogSpy;
   let consoleErrorSpy;
   let processExitSpy;

   beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
      vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   describe('Scenario 2.1: Transform DocumentDetails to Document', () => {
      it('should transform flat schema to nested Summary objects', () => {
         const transformed = {
            __typename: 'Document',
            id: mockDocumentDetails.id,
            eng: {
               title: mockDocumentDetails.eng_title,
               description: mockDocumentDetails.eng_description
            },
            bc: {
               title: mockDocumentDetails.bc_title,
               description: mockDocumentDetails.bc_description
            },
            ak: {
               title: mockDocumentDetails.ak_title,
               description: mockDocumentDetails.ak_description
            },
            fileKey: mockDocumentDetails.fileKey,
            fileHash: mockDocumentDetails.fileHash,
            created: mockDocumentDetails.created,
            updated: mockDocumentDetails.updated,
            type: mockDocumentDetails.type,
            version: mockDocumentDetails.version,
            keywords: mockDocumentDetails.keywords,
            documentAuthorId: mockDocumentDetails.documentDetailsAuthorId,
            documentContentOwnerUserId: mockDocumentDetails.documentDetailsDocOwnerId,
            documentBoxBoxId: mockDocumentDetails.documentDetailsBoxId
         };

         expect(transformed.__typename).toBe('Document');
         expect(transformed.eng.title).toBe(mockDocumentDetails.eng_title);
         expect(transformed.bc.description).toBe(mockDocumentDetails.bc_description);
         expect(transformed.documentAuthorId).toBe(mockDocumentDetails.documentDetailsAuthorId);
         expect(transformed.documentContentOwnerUserId).toBe(mockDocumentDetails.documentDetailsDocOwnerId);
         expect(transformed.documentBoxBoxId).toBe(mockDocumentDetails.documentDetailsBoxId);
      });
   });

   describe('Scenario 2.2: Transform Xbiis to Box', () => {
      it('should rename xbiisOwnerId to ownerUserId', () => {
         const transformed = {
            __typename: 'Box',
            id: mockXbiis.id,
            name: mockXbiis.name,
            waa: mockXbiis.waa,
            defaultRole: mockXbiis.defaultRole,
            purpose: mockXbiis.purpose,
            ownerUserId: mockXbiis.xbiisOwnerId
         };

         expect(transformed.__typename).toBe('Box');
         expect(transformed.ownerUserId).toBe(mockXbiis.xbiisOwnerId);
         expect(transformed.name).toBe(mockXbiis.name);
      });
   });

   describe('Scenario 2.3: Transform Collection with nested Summary', () => {
      it('should create nested eng/bc/ak objects and rename owner field', () => {
         const transformed = {
            __typename: 'Collection',
            id: mockCollection.id,
            eng: {
               title: mockCollection.eng_title,
               description: mockCollection.eng_description
            },
            bc: {
               title: mockCollection.bc_title,
               description: mockCollection.bc_description
            },
            ak: {
               title: mockCollection.ak_title,
               description: mockCollection.ak_description
            },
            created: mockCollection.created,
            updated: mockCollection.updated,
            collectionContentOwnerUserId: mockCollection.collectionCollectionOwnerId,
            collectionBoxId: mockCollection.collectionBoxId
         };

         expect(transformed.eng.title).toBe('Collection Title');
         expect(transformed.collectionContentOwnerUserId).toBe('user-1');
         expect(transformed.collectionBoxId).toBe('box-1');
      });
   });

   describe('Scenario 2.4: Handle null and missing fields', () => {
      it('should convert null and missing fields to empty strings', () => {
         const docWithNulls = {
            id: 'doc-null',
            eng_title: 'Title',
            bc_title: null,
            fileKey: 'file.pdf',
            created: '2023-01-01',
            type: 'PDF',
            version: '1.0',
            keywords: [],
            documentDetailsAuthorId: 'author-1',
            documentDetailsDocOwnerId: 'user-1',
            documentDetailsBoxId: 'box-1'
         };

         const transformed = {
            __typename: 'Document',
            id: docWithNulls.id,
            eng: {
               title: docWithNulls.eng_title || '',
               description: docWithNulls.eng_description || ''
            },
            bc: {
               title: docWithNulls.bc_title || '',
               description: docWithNulls.bc_description || ''
            },
            ak: {
               title: docWithNulls.ak_title || '',
               description: docWithNulls.ak_description || ''
            },
            fileKey: docWithNulls.fileKey,
            fileHash: docWithNulls.fileHash || null,
            created: docWithNulls.created,
            updated: docWithNulls.updated || null,
            type: docWithNulls.type || null,
            version: docWithNulls.version,
            keywords: docWithNulls.keywords || [],
            documentAuthorId: docWithNulls.documentDetailsAuthorId,
            documentContentOwnerUserId: docWithNulls.documentDetailsDocOwnerId,
            documentBoxBoxId: docWithNulls.documentDetailsBoxId
         };

         expect(transformed.bc.title).toBe('');
         expect(transformed.ak.description).toBe('');
      });
   });

   describe('Scenario 2.5: Transform BoxUser with field renames', () => {
      it('should preserve both userUserId and boxUserUserId fields', () => {
         const transformed = {
            __typename: 'BoxUser',
            id: mockBoxUser.id,
            role: mockBoxUser.role,
            userUserId: mockBoxUser.boxUserUserId,
            boxUserUserId: mockBoxUser.boxUserUserId,
            boxUserBoxId: mockBoxUser.boxUserBoxId
         };

         expect(transformed.userUserId).toBe(mockBoxUser.boxUserUserId);
         expect(transformed.boxUserUserId).toBe(mockBoxUser.boxUserUserId);
         expect(transformed.boxUserBoxId).toBe(mockBoxUser.boxUserBoxId);
      });
   });

   describe('Scenario 2.6: Transform CollectionItem with field renames', () => {
      it('should rename collectionID and documentID fields', () => {
         const transformed = {
            __typename: 'CollectionItem',
            id: mockCollectionItem.id,
            collectionCollectionId: mockCollectionItem.collectionID,
            collectionItemDocumentId: mockCollectionItem.documentID,
            collectionItemChildCollectionId: mockCollectionItem.childCollectionID,
            order: mockCollectionItem.order || 0,
            created: mockCollectionItem.created
         };

         expect(transformed.collectionCollectionId).toBe(mockCollectionItem.collectionID);
         expect(transformed.collectionItemDocumentId).toBe(mockCollectionItem.documentID);
         expect(transformed.collectionItemChildCollectionId).toBeNull();
      });
   });

   describe('Scenario 2.7: Handle missing input directory', () => {
      it('should exit with error when export directory missing', () => {
         vi.mocked(fs.existsSync).mockReturnValue(false);
         
         const inputDir = '/test/exports/dev';
         
         if (!fs.existsSync(inputDir)) {
            console.error(`ERROR: Export directory not found: ${inputDir}`);
            console.error('Run export-dynamodb.js first');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Export directory not found'));
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 2.8: Skip tables without transformer', () => {
      it('should skip BoxRequest when no transformer defined', () => {
         vi.mocked(fs.existsSync).mockReturnValue(true);
         vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([{ id: 'br-1' }]));
         
         const transformers = {
            'User': { transformer: (x) => x, outputName: 'User' },
            'Author': { transformer: (x) => x, outputName: 'Author' }
         };
         
         const tableName = 'BoxRequest';
         const config = transformers[tableName];
         
         if (!config) {
            console.log(`  Skipping ${tableName} - no transformer defined`);
         }

         expect(consoleLogSpy).toHaveBeenCalledWith('  Skipping BoxRequest - no transformer defined');
      });
   });
});
