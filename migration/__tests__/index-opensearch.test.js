import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {buildIndexBody, indexDocument, runIndexing} from '../index-opensearch.js';

// --- Fixture documents from import-ready/sbx/Document.json ---

const docMd = {
   __typename:                    'Document',
   id:                            'f4d3534d-c2ba-488f-b0af-2659e1bfdaf5',
   eng:                           { title: 'Upload to Personal', description: '' },
   bc:                            { title: '', description: '' },
   ak:                            { title: '', description: '' },
   fileKey:                       '9c64c169-bc42-4632-b70c-8d4feb66d60a/issue-04-upload-to-private.md',
   fileHash:                      null,
   created:                       '2025-12-31T02:04:34.934Z',
   updated:                       '2025-12-31T02:04:34.934Z',
   type:                          'text/markdown',
   version:                       1,
   keywords:                      ['kw1'],
   documentAuthorId:              '24db92c8-a974-4a8e-897f-6a560e3f2108',
   documentContentOwnerUserId:    'd48894a8-00c1-70c0-5af8-53a6d7a62037',
   documentBoxBoxId:              '9c64c169-bc42-4632-b70c-8d4feb66d60a',
   createdAt:                     '2025-12-31T02:04:34.934Z',
   updatedAt:                     '2025-12-31T02:04:34.934Z',
};

const docMp3 = {
   __typename:                    'Document',
   id:                            '825de02b-c0cc-4781-a936-f7a4c97edc1f',
   eng:                           { title: 'test', description: '' },
   bc:                            { title: '', description: '' },
   ak:                            { title: '', description: '' },
   fileKey:                       '75ca183f-a199-4d3d-9ac3-e10432965276/I thank you (singular).mp3',
   fileHash:                      null,
   created:                       '2024-03-15T00:42:33.214Z',
   updated:                       '2024-03-15T00:42:33.214Z',
   type:                          'audio/mpeg',
   version:                       1,
   keywords:                      [],
   documentAuthorId:              '6c2f5a54-29f7-470e-812c-926c9e7e5d6f',
   documentContentOwnerUserId:    'd4c8b4d8-f091-7024-1353-6d83fca3def3',
   documentBoxBoxId:              '75ca183f-a199-4d3d-9ac3-e10432965276',
   createdAt:                     '2024-03-15T00:42:33.214Z',
   updatedAt:                     '2024-03-15T00:42:33.214Z',
};

const docPng = {
   __typename:                    'Document',
   id:                            'f598b79c-c1d5-4bcf-98dd-a21f66cf6008',
   eng:                           { title: 'Test Vite (Image)', description: '' },
   bc:                            { title: '', description: '' },
   ak:                            { title: '', description: '' },
   fileKey:                       '75ca183f-a199-4d3d-9ac3-e10432965276/ovoid512-a.png',
   fileHash:                      null,
   created:                       '2025-09-08T12:57:30.131Z',
   updated:                       '2025-09-08T12:57:30.131Z',
   type:                          'image/png',
   version:                       1,
   keywords:                      [],
   documentAuthorId:              '757db552-7516-4874-b005-8e8d1a9cf9fd',
   documentContentOwnerUserId:    'd48894a8-00c1-70c0-5af8-53a6d7a62037',
   documentBoxBoxId:              '75ca183f-a199-4d3d-9ac3-e10432965276',
   createdAt:                     '2025-09-08T12:57:30.131Z',
   updatedAt:                     '2025-09-08T12:57:30.131Z',
};

const docPdf = {
   __typename:                    'Document',
   id:                            '55d1f12a-422c-4d9f-a8b9-1c7cad5f2e87',
   eng:                           { title: 'Test 2', description: '' },
   bc:                            { title: '', description: '' },
   ak:                            { title: '', description: '' },
   fileKey:                       '75ca183f-a199-4d3d-9ac3-e10432965276/Six Kinds of Counting.pdf',
   fileHash:                      null,
   created:                       '2024-03-11T01:53:52.497Z',
   updated:                       '2024-04-03T03:24:36.855Z',
   type:                          'application/pdf',
   version:                       2,
   keywords:                      [],
   documentAuthorId:              'fd5c5624-c24b-4fd8-b4e5-b9e4cc80b606',
   documentContentOwnerUserId:    'd4c8b4d8-f091-7024-1353-6d83fca3def3',
   documentBoxBoxId:              '75ca183f-a199-4d3d-9ac3-e10432965276',
   createdAt:                     '2024-03-11T01:53:52.497Z',
   updatedAt:                     '2024-04-03T03:24:36.855Z',
};

const docMultilingual = {
   __typename:                    'Document',
   id:                            '5ec0fdc8-81a3-423b-a98c-7f496e1a2acc',
   eng:                           { title: 'Songs of the Tsimshian', description: 'eng desc' },
   bc:                            { title: "Ts'msyen Limii", description: 'BC_DESC' },
   ak:                            { title: 'Tsimshian Limee', description: 'AK DESC' },
   fileKey:                       '75ca183f-a199-4d3d-9ac3-e10432965276/Songs_of_the_Tsimshians.pdf',
   fileHash:                      'abc123',
   created:                       '2024-03-11T01:27:57.560Z',
   updated:                       '2024-03-11T01:27:57.560Z',
   type:                          'application/pdf',
   version:                       1,
   keywords:                      ['kw1', 'kw2'],
   documentAuthorId:              '0e786887-6eb8-409d-b19f-7f64da8d547c',
   documentContentOwnerUserId:    'd4c8b4d8-f091-7024-1353-6d83fca3def3',
   documentBoxBoxId:              '75ca183f-a199-4d3d-9ac3-e10432965276',
   createdAt:                     '2024-03-11T01:27:57.560Z',
   updatedAt:                     '2024-03-11T01:27:57.560Z',
};

const docNullHash = {
   __typename:                    'Document',
   id:                            '766cf41f-6393-40e6-b141-131ee419db8d',
   eng:                           { title: 'T4', description: '' },
   bc:                            { title: '', description: '' },
   ak:                            { title: '', description: '' },
   fileKey:                       '75ca183f-a199-4d3d-9ac3-e10432965276/test.odt',
   fileHash:                      null,
   created:                       '2024-02-26T17:26:29.608Z',
   updated:                       '2024-02-26T17:26:29.608Z',
   type:                          'application/vnd.oasis.opendocument.text',
   version:                       1,
   keywords:                      ['T4'],
   documentAuthorId:              'fd5c5624-c24b-4fd8-b4e5-b9e4cc80b606',
   documentContentOwnerUserId:    'd48894a8-00c1-70c0-5af8-53a6d7a62037',
   documentBoxBoxId:              '75ca183f-a199-4d3d-9ac3-e10432965276',
   createdAt:                     '2024-02-26T17:26:29.608Z',
   updatedAt:                     '2024-02-26T17:26:29.608Z',
};

// --- Mocks ---

vi.mock('@opensearch-project/opensearch', () => ({
   Client: vi.fn(),
}));

vi.mock('@opensearch-project/opensearch/aws', () => ({
   AwsSigv4Signer: vi.fn(() => ({})),
}));

vi.mock('@aws-sdk/credential-provider-node', () => ({
   defaultProvider: vi.fn(),
}));

vi.mock('@aws-sdk/client-s3', () => ({
   S3Client:         vi.fn(),
   GetObjectCommand: vi.fn((params) => params),
}));

// --- Import module under test (after mocks) ---

// --- Tests ---

describe('index-opensearch.js', () => {
   let consoleLogSpy;
   let consoleWarnSpy;
   let consoleErrorSpy;
   let processExitSpy;

   beforeEach(() => {
      consoleLogSpy   = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleWarnSpy  = vi.spyOn(console, 'warn').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      processExitSpy  = vi.spyOn(process, 'exit').mockImplementation(() => {
         throw new Error('process.exit called');
      });
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   // -----------------------------------------------------------------------
   // Feature 1: buildIndexBody
   // -----------------------------------------------------------------------

   describe('Feature 1: buildIndexBody', () => {

      describe('Scenario 1.1: Full field mapping', () => {
         it('should map all fields correctly and append fileContent as last keyword', () => {
            const doc = {
               ...docMd,
               fileHash: 'hash123',
               keywords: ['kw1', 'kw2'],
            };
            const result = buildIndexBody(doc, 'extracted text content');

            expect(result.__typename).toBe('Document');
            expect(result.id).toBe(doc.id);
            expect(result.eng_title).toBe(doc.eng.title);
            expect(result.eng_description).toBe(doc.eng.description);
            expect(result.bc_title).toBe(doc.bc.title);
            expect(result.bc_description).toBe(doc.bc.description);
            expect(result.ak_title).toBe(doc.ak.title);
            expect(result.ak_description).toBe(doc.ak.description);
            expect(result.fileKey).toBe(doc.fileKey);
            expect(result.fileHash).toBe('hash123');
            expect(result.created).toBe(doc.created);
            expect(result.updated).toBe(doc.updated);
            expect(result.type).toBe(doc.type);
            expect(result.version).toBe(doc.version);
            expect(result.createdAt).toBe(doc.createdAt);
            expect(result.updatedAt).toBe(doc.updatedAt);
            expect(result.documentAuthorId).toBe(doc.documentAuthorId);
            expect(result.documentContentOwnerUserId).toBe(doc.documentContentOwnerUserId);
            expect(result.documentBoxBoxId).toBe(doc.documentBoxBoxId);
            expect(result.keywords).toContain('kw1');
            expect(result.keywords).toContain('kw2');
            expect(result.keywords[result.keywords.length - 1]).toBe('extracted text content');
         });
      });

      describe('Scenario 1.2: Null/missing nested fields default to empty string', () => {
         it('should default bc.title null and ak.description undefined to ""', () => {
            const doc = {
               ...docMd,
               bc: { title: null, description: '' },
               ak: { title: '', description: undefined },
            };
            const result = buildIndexBody(doc, '');
            expect(result.bc_title).toBe('');
            expect(result.ak_description).toBe('');
         });
      });

      describe('Scenario 1.3: Null fileHash defaults to empty string', () => {
         it('should return "" for fileHash when null', () => {
            const result = buildIndexBody(docNullHash, '');
            expect(result.fileHash).toBe('');
         });
      });

      describe('Scenario 1.4: Empty fileContent appended to keywords', () => {
         it('should append "" to keywords when fileContent is empty', () => {
            const doc = { ...docMd, keywords: ['T1'] };
            const result = buildIndexBody(doc, '');
            expect(result.keywords).toEqual(['T1', '']);
         });
      });

      describe('Scenario 1.5: Multilingual document', () => {
         it('should map all three language fields correctly', () => {
            const result = buildIndexBody(docMultilingual, '');
            expect(result.eng_title).toBe('Songs of the Tsimshian');
            expect(result.bc_title).toBe("Ts'msyen Limii");
            expect(result.ak_title).toBe('Tsimshian Limee');
            expect(result.bc_description).toBe('BC_DESC');
            expect(result.ak_description).toBe('AK DESC');
         });
      });
   });

   // -----------------------------------------------------------------------
   // Feature 2: File type routing
   // -----------------------------------------------------------------------

   describe('Feature 2: File type routing', () => {
      let mockS3Client;
      let mockIndexUpdater;

      beforeEach(() => {
         mockIndexUpdater = vi.fn().mockResolvedValue({});
         mockS3Client = {
            send: vi.fn().mockResolvedValue({
               Body: { transformToString: vi.fn().mockResolvedValue('hello world') },
            }),
         };
      });

      describe('Scenario 2.1: .txt file — S3 fetched, content appended, indexUpdater called', () => {
         it('should fetch S3, call buildIndexBody with content, call indexUpdater', async () => {
            const doc = { ...docMd, fileKey: 'box/file.txt', keywords: [] };
            const counts = { indexed: 0, skipped: 0, failed: 0 };
            await indexDocument(doc, mockS3Client, 'test-index', mockIndexUpdater, counts);

            expect(mockS3Client.send).toHaveBeenCalledTimes(1);
            const callArg = mockS3Client.send.mock.calls[0][0];
            expect(callArg).toMatchObject({ Bucket: undefined, Key: 'public/box/file.txt' });
            expect(mockIndexUpdater).toHaveBeenCalledTimes(1);
            const indexArg = mockIndexUpdater.mock.calls[0][0];
            expect(indexArg.body.keywords[indexArg.body.keywords.length - 1]).toBe('hello world');
            expect(counts.indexed).toBe(1);
         });
      });

      describe('Scenario 2.2: .md file treated as text', () => {
         it('should treat .md as text and call indexUpdater', async () => {
            mockS3Client.send.mockResolvedValue({
               Body: { transformToString: vi.fn().mockResolvedValue('# Title\nSome content') },
            });
            const counts = { indexed: 0, skipped: 0, failed: 0 };
            await indexDocument(docMd, mockS3Client, 'test-index', mockIndexUpdater, counts);

            expect(mockIndexUpdater).toHaveBeenCalledTimes(1);
            const indexArg = mockIndexUpdater.mock.calls[0][0];
            expect(indexArg.body.keywords[indexArg.body.keywords.length - 1])
               .toBe('# Title\nSome content');
            expect(counts.indexed).toBe(1);
         });
      });

      describe('Scenario 2.3: .mp3 — skipped with warning, indexUpdater NOT called', () => {
         it('should log warning and count as skipped', async () => {
            const counts = { indexed: 0, skipped: 0, failed: 0 };
            await indexDocument(docMp3, mockS3Client, 'test-index', mockIndexUpdater, counts);

            expect(mockIndexUpdater).not.toHaveBeenCalled();
            expect(mockS3Client.send).not.toHaveBeenCalled();
            expect(counts.skipped).toBe(1);
            const warnMsg = consoleWarnSpy.mock.calls.flat().join(' ');
            expect(warnMsg.toLowerCase()).toMatch(/unsupported|skipped/);
         });
      });

      describe('Scenario 2.4: .png — skipped, indexUpdater NOT called', () => {
         it('should count as skipped', async () => {
            const counts = { indexed: 0, skipped: 0, failed: 0 };
            await indexDocument(docPng, mockS3Client, 'test-index', mockIndexUpdater, counts);

            expect(mockIndexUpdater).not.toHaveBeenCalled();
            expect(counts.skipped).toBe(1);
         });
      });

      describe('Scenario 2.5: .pdf — skipped, indexUpdater NOT called', () => {
         it('should count as skipped', async () => {
            const counts = { indexed: 0, skipped: 0, failed: 0 };
            await indexDocument(docPdf, mockS3Client, 'test-index', mockIndexUpdater, counts);

            expect(mockIndexUpdater).not.toHaveBeenCalled();
            expect(counts.skipped).toBe(1);
         });
      });
   });

   // -----------------------------------------------------------------------
   // Feature 3: Dry-run
   // -----------------------------------------------------------------------

   describe('Feature 3: Dry-run', () => {
      let mockS3Client;
      let mockIndexUpdater;

      beforeEach(() => {
         mockIndexUpdater = vi.fn().mockResolvedValue({});
         mockS3Client     = { send: vi.fn() };
      });

      describe('Scenario 3.1: --dry-run suppresses all OpenSearch and S3 calls', () => {
         it('should not call indexUpdater or S3, and log intent for each document', async () => {
            const docs = [
               { ...docMd, fileKey: 'box/a.txt' },
               { ...docMd, fileKey: 'box/b.txt', id: 'id-b' },
               { ...docMd, fileKey: 'box/c.txt', id: 'id-c' },
            ];
            const counts = { indexed: 0, skipped: 0, failed: 0 };

            for (const doc of docs) {
               await indexDocument(
                  doc, mockS3Client, 'test-index', mockIndexUpdater, counts, true
               );
            }

            expect(mockIndexUpdater).not.toHaveBeenCalled();
            expect(mockS3Client.send).not.toHaveBeenCalled();
            const logOutput = consoleLogSpy.mock.calls.flat().join(' ');
            expect(logOutput).toMatch(/would index/i);
            expect(counts.indexed).toBe(3);
         });
      });

      describe('Scenario 3.2: --dry-run reports correct would-index/would-skip counts', () => {
         it('should report Would index: 2, Would skip: 1', async () => {
            const docs = [
               { ...docMd, fileKey: 'box/a.txt' },
               { ...docMd, fileKey: 'box/b.md', id: 'id-b' },
               { ...docMp3 },
            ];
            const counts = { indexed: 0, skipped: 0, failed: 0 };

            for (const doc of docs) {
               await indexDocument(
                  doc, mockS3Client, 'test-index', mockIndexUpdater, counts, true
               );
            }

            expect(counts.indexed).toBe(2);
            expect(counts.skipped).toBe(1);
         });
      });
   });

   // -----------------------------------------------------------------------
   // Feature 4: Count reporting
   // -----------------------------------------------------------------------

   describe('Feature 4: Count reporting', () => {
      let mockS3Client;
      let mockIndexUpdater;

      beforeEach(() => {
         mockIndexUpdater = vi.fn().mockResolvedValue({});
         mockS3Client = {
            send: vi.fn().mockResolvedValue({
               Body: { transformToString: vi.fn().mockResolvedValue('content') },
            }),
         };
      });

      describe('Scenario 4.1: All succeed → Indexed: 3, Skipped: 0, Failed: 0', () => {
         it('should report correct counts when all succeed', async () => {
            const docs = [
               { ...docMd, fileKey: 'box/a.txt' },
               { ...docMd, fileKey: 'box/b.txt', id: 'id-b' },
               { ...docMd, fileKey: 'box/c.txt', id: 'id-c' },
            ];
            const counts = { indexed: 0, skipped: 0, failed: 0 };
            for (const doc of docs) {
               await indexDocument(doc, mockS3Client, 'test-index', mockIndexUpdater, counts);
            }
            expect(counts.indexed).toBe(3);
            expect(counts.skipped).toBe(0);
            expect(counts.failed).toBe(0);
         });
      });

      describe('Scenario 4.2: Mixed results — Indexed: 2, Skipped: 2, Failed: 1', () => {
         it('should report mixed counts and not throw', async () => {
            let callCount = 0;
            mockIndexUpdater = vi.fn().mockImplementation(() => {
               callCount++;
               if (2 === callCount) { return Promise.reject(new Error('OS error')); }
               return Promise.resolve({});
            });

            const docs = [
               { ...docMd, fileKey: 'box/a.txt' },
               { ...docMd, fileKey: 'box/b.txt', id: 'id-b' },
               { ...docMp3 },
               { ...docPng },
               { ...docMd, fileKey: 'box/c.txt', id: 'id-c' },
            ];
            const counts = { indexed: 0, skipped: 0, failed: 0 };

            for (const doc of docs) {
               await indexDocument(doc, mockS3Client, 'test-index', mockIndexUpdater, counts);
            }

            expect(counts.indexed).toBe(2);
            expect(counts.skipped).toBe(2);
            expect(counts.failed).toBe(1);
         });
      });

      describe('Scenario 4.3: S3 failure counted as failed, processing continues', () => {
         it('should catch S3 error, count as failed, continue', async () => {
            mockS3Client.send.mockRejectedValue(new Error('S3 error'));
            const counts = { indexed: 0, skipped: 0, failed: 0 };

            await expect(
               indexDocument(docMd, mockS3Client, 'test-index', mockIndexUpdater, counts)
            ).resolves.not.toThrow();

            expect(counts.failed).toBe(1);
            expect(counts.indexed).toBe(0);
         });
      });

      describe('Scenario 4.4: indexUpdater failure counted as failed', () => {
         it('should catch indexUpdater error and count as failed', async () => {
            mockIndexUpdater.mockRejectedValue(new Error('OS error'));
            const counts = { indexed: 0, skipped: 0, failed: 0 };

            await expect(
               indexDocument(docMd, mockS3Client, 'test-index', mockIndexUpdater, counts)
            ).resolves.not.toThrow();

            expect(counts.failed).toBe(1);
            expect(counts.indexed).toBe(0);
         });
      });
   });

   // -----------------------------------------------------------------------
   // Feature 5: Input validation
   // -----------------------------------------------------------------------

   describe('Feature 5: Input validation', () => {

      describe('Scenario 5.1: Missing import-ready file exits with error', () => {
         it('should log error and call process.exit(1)', async () => {
            process.env.OS_DOMAIN_URL = 'https://example.com';

            await expect(runIndexing('sbx', false, () => false)).rejects.toThrow('process.exit called');

            const errMsg = consoleErrorSpy.mock.calls.flat().join(' ');
            expect(errMsg.toLowerCase()).toMatch(/not found|missing/);
            expect(processExitSpy).toHaveBeenCalledWith(1);
         });
      });

      describe('Scenario 5.2: Missing OS_DOMAIN_URL exits with error', () => {
         it('should log error and call process.exit(1)', async () => {
            delete process.env.OS_DOMAIN_URL;

            await expect(runIndexing('sbx', false, () => true)).rejects.toThrow('process.exit called');

            const errMsg = consoleErrorSpy.mock.calls.flat().join(' ');
            expect(errMsg.toLowerCase()).toMatch(/os_domain_url|endpoint/);
            expect(processExitSpy).toHaveBeenCalledWith(1);
         });
      });

      describe('Scenario 5.3: Invalid env argument exits with error', () => {
         it('should log error with valid options and call process.exit(1)', async () => {
            process.env.OS_DOMAIN_URL = 'https://example.com';

            await expect(runIndexing('staging')).rejects.toThrow('process.exit called');

            const errMsg = consoleErrorSpy.mock.calls.flat().join(' ');
            expect(errMsg).toMatch(/sbx|dev|prod/);
            expect(processExitSpy).toHaveBeenCalledWith(1);
         });
      });
   });
});
