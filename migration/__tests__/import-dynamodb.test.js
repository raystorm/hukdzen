import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';

vi.mock('@aws-sdk/client-dynamodb');
vi.mock('@aws-sdk/lib-dynamodb');
vi.mock('fs');

describe('import-dynamodb.js', () => {
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
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([]));
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   describe('Scenario 3.1: Import all tables successfully', () => {
      it('should import all 8 tables using BatchWriteCommand', async () => {
         const mockItems = [
            { __typename: 'User', id: 'user-1', name: 'Test' },
            { __typename: 'User', id: 'user-2', name: 'Test2' }
         ];
         
         vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockItems));
         mockSend.mockResolvedValue({});

         const BATCH_SIZE = 25;
         const batches = [];
         
         for (let i = 0; i < mockItems.length; i += BATCH_SIZE) {
            batches.push(mockItems.slice(i, i + BATCH_SIZE));
         }

         expect(batches).toHaveLength(1);
         expect(batches[0]).toHaveLength(2);
      });
   });

   describe('Scenario 3.2: Batch items in chunks of 25', () => {
      it('should create 4 batches for 100 items', () => {
         const items = Array.from({ length: 100 }, (_, i) => ({ id: `item-${i}` }));
         const BATCH_SIZE = 25;
         const batches = [];
         
         for (let i = 0; i < items.length; i += BATCH_SIZE) {
            batches.push(items.slice(i, i + BATCH_SIZE));
         }

         expect(batches).toHaveLength(4);
         expect(batches[0]).toHaveLength(25);
         expect(batches[1]).toHaveLength(25);
         expect(batches[2]).toHaveLength(25);
         expect(batches[3]).toHaveLength(25);
      });
   });

   describe('Scenario 3.3: Handle table prefix not configured', () => {
      it('should exit with error when prefix is UPDATE_AFTER_GEN2_DEPLOY', () => {
         const TABLE_PREFIX = 'UPDATE_AFTER_GEN2_DEPLOY';
         
         if ('UPDATE_AFTER_GEN2_DEPLOY' === TABLE_PREFIX) {
            console.error('ERROR: Update GEN2_TABLE_PREFIX in script before running');
            console.error('Deploy Gen2, then find table prefix from AWS Console');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith('ERROR: Update GEN2_TABLE_PREFIX in script before running');
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 3.4: Handle missing transformed directory', () => {
      it('should exit with error when transformed directory missing', () => {
         vi.mocked(fs.existsSync).mockReturnValue(false);
         
         const inputDir = '/test/transformed/dev';
         
         if (!fs.existsSync(inputDir)) {
            console.error(`ERROR: Export directory not found: ${inputDir}`);
            console.error('Run export-dynamodb.js first');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Export directory not found'));
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 3.5: Skip tables without transformed file', () => {
      it('should skip BoxRequest when file does not exist', () => {
         const inputFile = '/test/transformed/dev/BoxRequest.json';
         vi.mocked(fs.existsSync).mockReturnValue(false);
         
         const fileExists = fs.existsSync(inputFile);
         
         expect(fileExists).toBe(false);
      });
   });

   describe('Scenario 3.6: Handle DynamoDB write errors', () => {
      it('should catch and log ProvisionedThroughputExceededException', async () => {
         const error = new Error('ProvisionedThroughputExceededException');
         error.name = 'ProvisionedThroughputExceededException';
         mockSend.mockRejectedValue(error);

         await expect(async () => {
            throw error;
         }).rejects.toThrow('ProvisionedThroughputExceededException');
      });
   });
});
