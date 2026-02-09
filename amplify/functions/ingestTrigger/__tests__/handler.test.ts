import fs from 'fs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@smithy/util-stream';
import { Client } from '@opensearch-project/opensearch';
import type { DynamoDBStreamEvent, Context, Callback } from 'aws-lambda';
import { handler, buildSearchIndex, indexName, S3AccessLevel } from '../handler';
import { isTextFile, isOfficeDocument } from '../TextExtractor';
import exampleEvent from './ExampleEvent.json';

jest.mock('@opensearch-project/opensearch');
jest.mock('@opensearch-project/opensearch/aws');

const s3Mock = mockClient(S3Client);
const mockContext = {} as Context;
const mockCallback = (() => {}) as Callback;

const algyaxalgyax = [ "Algyax", "yawkł", "üünx",
      "T'sm g̱alüünx wil dip lu tgi dooł ła̱'a̱sk nag̱oog̱a dm dip yetst.",
      "ẅa̱a̱x", "ḵ'a'aam", "a̱x'a̱xłk", "g̱ag̱oot", "ḏakda̱xł"];

const testFiles = '../../../testFiles';

describe('ingestTrigger (handler.ts)', () =>
{
   let algyaxPattern: string;
   let algyaxMatcher: RegExp;

   beforeAll(() =>
   {
      algyaxPattern = '\\s*';
      for (const algyax of algyaxalgyax) { algyaxPattern += `${algyax}\\s*`; }
      algyaxMatcher = new RegExp(algyaxPattern, 'gu');
   });

   beforeEach(() =>
   {
      s3Mock.reset();
      const response = { statusCode: 200 };
      const osClient = jest.mocked(Client).mock.instances[0] as any;
      osClient.index.mockResolvedValue(response);
   });

   afterEach(() =>
   {
      const osClient = jest.mocked(Client).mock.instances[0];
      jest.mocked(osClient.index).mockClear();
   });

   test('updates index for a text (md) file', async () =>
   {
      const filePath = `${testFiles}/README.md`;
      const fileContent = expect.stringMatching(algyaxMatcher);
      const stream = fs.createReadStream(filePath);
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const event = exampleEvent as unknown as DynamoDBStreamEvent;
      event.Records[0].dynamodb!.NewImage!.fileKey!.S = filePath;
      const docDetail = event.Records[0].dynamodb!;
      const osClient = jest.mocked(Client).mock.instances[0];

      expect(isTextFile(docDetail.NewImage!.fileKey!.S!)).toBe(true);
      expect(isOfficeDocument(docDetail.NewImage!.fileKey!.S!)).toBe(false);

      await handler(event, mockContext, mockCallback);

      const indexMe = buildSearchIndex(indexName, event.Records[0], fileContent);
      expect(osClient.index).toHaveBeenLastCalledWith(indexMe);
   });

   test('updates index for an OpenOffice Spreadsheet file', async () =>
   {
      const filePath = `${testFiles}/test-sheet.ods`;
      const fileContent = expect.stringMatching(algyaxMatcher);
      const stream = fs.createReadStream(filePath);
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const record = { ...exampleEvent.Records[0] } as any;
      const docDetail = record.dynamodb;
      docDetail.NewImage.fileKey.S = filePath;
      const event = { ...exampleEvent, Records: [record] } as unknown as DynamoDBStreamEvent;

      expect(isTextFile(docDetail.NewImage!.fileKey!.S!)).toBe(false);
      expect(isOfficeDocument(docDetail.NewImage!.fileKey!.S!)).toBe(true);

      const osClient = jest.mocked(Client).mock.instances[0];
      await handler(event, mockContext, mockCallback);

      const indexMe = buildSearchIndex(indexName, event.Records[0], fileContent);
      expect(osClient.index).toHaveBeenLastCalledWith(indexMe);
   });

   test('short circuits, when no fileKey', async () =>
   {
      const event = { ...exampleEvent, Records: [] } as any;
      const ogRecord = exampleEvent.Records[0];

      event.Records[0] = {
         ...ogRecord,
         dynamodb: {
            ...ogRecord.dynamodb,
            NewImage: { ...ogRecord.dynamodb.NewImage, fileKey: { S: '' } }
         }
      };

      const message = 'Missing File Key: aborting update';
      await expect(handler(event, mockContext, mockCallback)).rejects.toThrow(message);
   });

   test('short circuits, when event record does not contain NewImage', async () =>
   {
      const event    = { ...exampleEvent, Records: [] } as any;
      const record   = { ...exampleEvent.Records[0] } as any;
      const dynamodb = { ...record.dynamodb };
      delete dynamodb.NewImage;
      event.Records[0] = record;
      event.Records[0].dynamodb = dynamodb;
      
      const message = 'Missing NewImage: aborting update';
      await expect(handler(event, mockContext, mockCallback)).rejects.toThrow(message);
   });

   test('returns an error when unable to find the file in S3', async () =>
   {
      const event = exampleEvent as unknown as DynamoDBStreamEvent;
      s3Mock.on(GetObjectCommand).resolves({ Body: undefined });

      const message = 'Unable to locate Uploaded file';
      await expect(handler(event, mockContext, mockCallback)).rejects.toThrow(message);
   });

   test('reports an error, and does not update the index for unsupported type',
        async () =>
   {
      const filePath = `${testFiles}/../public/favicon.ico`;
      const stream = fs.createReadStream(filePath);
      stream.setEncoding('binary');
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const event = { ...exampleEvent, Records: [] } as any;
      const ogRecord = exampleEvent.Records[0];

      event.Records[0] = {
         ...ogRecord,
         dynamodb: {
            ...ogRecord.dynamodb,
            NewImage: { ...ogRecord.dynamodb.NewImage, fileKey: { S: filePath } }
         }
      };

      expect(isTextFile(filePath)).toBe(false);
      expect(isOfficeDocument(filePath)).toBe(false);

      const osClient = jest.mocked(Client).mock.instances[0];
      await handler(event, mockContext, mockCallback);

      expect(osClient.index).not.toHaveBeenCalled();
   });
});
