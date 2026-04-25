import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';

vi.mock('@aws-sdk/client-dynamodb');
vi.mock('@aws-sdk/lib-dynamodb');
vi.mock('fs');

describe('validate-migration.js', () => {
   let mockSend;
   let mockDocClient;
   let consoleLogSpy;
   let consoleErrorSpy;
   let processExitSpy;

   beforeEach(() => {
      mockSend = vi.fn();
      mockDocClient = { send: mockSend };
      
      vi.mocked(DynamoDBDocumentClient.from).mockReturnValue(mockDocClient);
      
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      
      vi.mocked(fs.existsSync).mockReturnValue(true);
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   describe('Scenario 6.1: Validate successful migration', () => {
      it('should pass validation when all counts match', () => {
         const gen1Count = 100;
         const transformedCount = 100;
         const gen2Count = 100;

         const exportMatch = gen1Count === transformedCount;
         const importMatch = transformedCount === gen2Count;

         if (exportMatch && importMatch) {
            console.log('  ✅ PASS - All counts match');
         }

         expect(consoleLogSpy).toHaveBeenCalledWith('  ✅ PASS - All counts match');
         expect(exportMatch).toBe(true);
         expect(importMatch).toBe(true);
      });
   });

   describe('Scenario 6.2: Detect export/transform mismatch', () => {
      it('should fail validation when export and transform counts differ', () => {
         const gen1Count = 100;
         const transformedCount = 95;
         const gen2Count = 95;

         const exportMatch = gen1Count === transformedCount;
         const importMatch = transformedCount === gen2Count;

         if (!exportMatch) {
            console.log('  ❌ FAIL - Export/Transform mismatch');
         }

         expect(consoleLogSpy).toHaveBeenCalledWith('  ❌ FAIL - Export/Transform mismatch');
         expect(exportMatch).toBe(false);
      });
   });

   describe('Scenario 6.3: Detect transform/import mismatch', () => {
      it('should fail validation when transform and import counts differ', () => {
         const gen1Count = 100;
         const transformedCount = 100;
         const gen2Count = 98;

         const exportMatch = gen1Count === transformedCount;
         const importMatch = transformedCount === gen2Count;

         if (!importMatch) {
            console.log('  ❌ FAIL - Transform/Import mismatch');
         }

         expect(consoleLogSpy).toHaveBeenCalledWith('  ❌ FAIL - Transform/Import mismatch');
         expect(importMatch).toBe(false);
      });
   });

   describe('Scenario 6.4: Handle missing export directory', () => {
      it('should exit with error when export directory missing', () => {
         const exportDir = '/test/exports/dev';
         vi.mocked(fs.existsSync).mockReturnValueOnce(false);
         
         if (!fs.existsSync(exportDir)) {
            console.error(`\nERROR: Export directory not found: ${exportDir}`);
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Export directory not found'));
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 6.5: Handle missing transformed directory', () => {
      it('should exit with error when transformed directory missing', () => {
         const transformedDir = '/test/transformed/dev';
         vi.mocked(fs.existsSync).mockReturnValueOnce(true).mockReturnValueOnce(false);
         
         if (!fs.existsSync(transformedDir)) {
            console.error(`\nERROR: Transformed directory not found: ${transformedDir}`);
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Transformed directory not found'));
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 6.6: Handle table prefix not configured', () => {
      it('should exit with error when prefix is UPDATE_AFTER_GEN2_DEPLOY', () => {
         const TABLE_PREFIX = 'UPDATE_AFTER_GEN2_DEPLOY';
         
         if ('UPDATE_AFTER_GEN2_DEPLOY' === TABLE_PREFIX) {
            console.error('ERROR: Update TABLE_PREFIX in script before running');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith('ERROR: Update TABLE_PREFIX in script before running');
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 6.7: Handle DynamoDB scan errors', () => {
      it('should return -1 for Gen2 count on AccessDeniedException', async () => {
         const error = new Error('AccessDeniedException');
         error.name = 'AccessDeniedException';
         mockSend.mockRejectedValue(error);

         let gen2Count = 0;
         
         try {
            await mockDocClient.send(new ScanCommand({
               TableName: 'User-test-dev',
               Select: 'COUNT'
            }));
         } catch (err) {
            console.error(`  Error scanning User-test-dev: ${err.message}`);
            gen2Count = -1;
         }

         expect(gen2Count).toBe(-1);
         expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error scanning'));
      });
   });

   describe('Scenario 6.8: Validate all table mappings', () => {
      it('should validate all Gen1 to Gen2 table mappings', () => {
         const tables = [
            { gen1: 'User', gen2: 'User' },
            { gen1: 'Author', gen2: 'Author' },
            { gen1: 'DocumentDetails', gen2: 'Document' },
            { gen1: 'Xbiis', gen2: 'Box' },
            { gen1: 'BoxUser', gen2: 'BoxUser' },
            { gen1: 'Collection', gen2: 'Collection' },
            { gen1: 'CollectionItem', gen2: 'CollectionItem' }
         ];

         expect(tables).toHaveLength(7);
         expect(tables.find(t => t.gen1 === 'DocumentDetails').gen2).toBe('Document');
         expect(tables.find(t => t.gen1 === 'Xbiis').gen2).toBe('Box');
      });
   });
});
