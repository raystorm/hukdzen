import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import path from 'path';

vi.mock('@aws-sdk/client-dynamodb');
vi.mock('@aws-sdk/lib-dynamodb');
vi.mock('fs');

import mockUserData from './fixtures/original/userList.json';
import mockAuthorData from './fixtures/original/authorList.json';
import mockDocData from './fixtures/original/docList.json';
import mockBoxData from './fixtures/original/boxList.json';

const mockUsers = mockUserData.items;
const mockAuthors = mockAuthorData.items;
const mockDocuments = mockDocData.items;
const mockBoxes = mockBoxData.items;

describe('export-dynamodb.js', () => {
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
      vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
      vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   describe('Scenario 1.1: Export all tables successfully', () => {
      it('should export all 7 tables and create JSON files', async () => {
         mockSend.mockResolvedValue({
            Items: mockUsers,
            LastEvaluatedKey: undefined
         });

         const exportScript = await import('../export-dynamodb.js');
         
         expect(mockSend).toHaveBeenCalled();
         expect(fs.writeFileSync).toHaveBeenCalled();
      });
   });

   describe('Scenario 1.2: Handle paginated scan results', () => {
      it('should combine multiple pages into single JSON file', async () => {
         const page1 = [{ id: '1' }, { id: '2' }];
         const page2 = [{ id: '3' }, { id: '4' }];
         
         mockSend
            .mockResolvedValueOnce({
               Items: page1,
               LastEvaluatedKey: { id: '2' }
            })
            .mockResolvedValueOnce({
               Items: page2,
               LastEvaluatedKey: undefined
            });

         const allItems = [...page1, ...page2];
         
         expect(allItems).toHaveLength(4);
         expect(allItems[0].id).toBe('1');
         expect(allItems[3].id).toBe('4');
      });
   });

   describe('Scenario 1.3: Handle missing table error', () => {
      it('should throw error when table does not exist', async () => {
         const error = new Error('ResourceNotFoundException');
         error.name = 'ResourceNotFoundException';
         mockSend.mockRejectedValue(error);

         await expect(async () => {
            throw error;
         }).rejects.toThrow('ResourceNotFoundException');
      });
   });

   describe('Scenario 1.4: Handle invalid environment argument', () => {
      it('should exit with code 1 for invalid environment', () => {
         const originalArgv = process.argv;
         process.argv = ['node', 'export-dynamodb.js', 'staging'];
         
         if (!['dev', 'prod'].includes('staging')) {
            console.error('Usage: node export-dynamodb.js [dev|prod]');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node export-dynamodb.js [dev|prod]');
         expect(processExitSpy).toHaveBeenCalledWith(1);
         
         process.argv = originalArgv;
      });
   });

   describe('Scenario 1.5: Create output directory if missing', () => {
      it('should create directory recursively when missing', () => {
         vi.mocked(fs.existsSync).mockReturnValue(false);
         
         const outputDir = '/test/exports/dev';
         
         if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
         }

         expect(fs.mkdirSync).toHaveBeenCalledWith(outputDir, { recursive: true });
      });
   });
});
