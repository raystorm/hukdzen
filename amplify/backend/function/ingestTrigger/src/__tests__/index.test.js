/*
 *  Test Class to Validate index.js - File Parsing and OpenSearch Index Update
 */
const fs = require('fs');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { mockClient } = require('aws-sdk-client-mock');
const {sdkStreamMixin} = require('@smithy/util-stream');
const { Client } = require("@opensearch-project/opensearch");

const { handler, buildSearchIndex, indexName, S3AccessLevel } = require('../index');
const { search } = require('../OpenSearch');
const {
   isTextFile, isOfficeDocument, getOfficeDocumentText
} = require('../TextExtractor');
const exampleEvent = require('../ExampleEvent.json');


jest.mock('@opensearch-project/opensearch');
jest.mock('@opensearch-project/opensearch/aws');
//jest.mock('../OpenSearch');


const s3Mock = mockClient(S3Client);

/**
 *  List of Common words + sentence in each document.
 *  @type {string[]}
 */
const algyaxalgyax = [ "Algyax", "yawkł", "üünx",
      "T'sm g̱alüünx wil dip lu tgi dooł ła̱'a̱sk nag̱oog̱a dm dip yetst.",
      "ẅa̱a̱x", "ḵ'a'aam", "a̱x'a̱xłk", "g̱ag̱oot", "ḏakda̱xł"];


/**
 *  Relative Path to testFiles Folder
 *  @type {string}
 */
const testFiles = '../../../../../testFiles';

describe('ingestTrigger (index.js)', () => {

   let algyaxPattern;
   let algyaxMatcher;

   beforeAll(() => {
      algyaxPattern = '\\s*';
      for( const algyax of algyaxalgyax )
      { algyaxPattern += `${algyax}\\s*`; }
      algyaxMatcher =  new RegExp(algyaxPattern, 'gu');
   });

   beforeEach(() => {
      s3Mock.reset();
      //set update to respond w/ success
      const response = { statusCode: 200 };
      const osClient = Client.mock.instances[0];
      osClient.update.mockResolvedValue(response);
   });

   afterEach(() => {
      //jest.clearAllMocks();
      //Client.mock.instances[0].clearAllMocks();
      //const osClient = Client.mock.instances[0];
      //osClient.getData.mockClear();
      Client.mock.instances[0].update.mockClear();
   });

   test('updates index for a text (md) file', async () => {
      const filePath = `${testFiles}/README.md`;
      const fileContent = expect.stringMatching(algyaxMatcher);
      const stream = fs.createReadStream(filePath);
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const event = { ...exampleEvent };
      event.Records[0].dynamodb.NewImage.fileKey.S = filePath;
      const docDetail = event.Records[0].dynamodb;
      const osClient = Client.mock.instances[0];

      expect(isTextFile(docDetail.NewImage.fileKey.S)).toBe(true);
      expect(isOfficeDocument(docDetail.NewImage.fileKey.S)).toBe(false);

      const result = await handler(event);

      const indexMe = buildSearchIndex(indexName, docDetail, fileContent);
      expect(osClient.update).toHaveBeenLastCalledWith(indexMe);

      expect(result).toEqual('Success!')
   });

   test('updates index for an OpenOffice Spreadsheet file',
        async () =>
   {
      const filePath = `${testFiles}/test-sheet.ods`;
      const fileContent = expect.stringMatching(algyaxMatcher);
      const stream = fs.createReadStream(filePath);
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const record = { ...exampleEvent.Records[0], }
      const docDetail = record.dynamodb;
      docDetail.NewImage.fileKey.S = filePath;
      const event = {
         ...exampleEvent,
         Records: [ record ]
      }

      expect(isTextFile(docDetail.NewImage.fileKey.S)).toBe(false);
      expect(isOfficeDocument(docDetail.NewImage.fileKey.S)).toBe(true);

      const osClient = Client.mock.instances[0];
      const result = await handler(event);

      const indexMe = buildSearchIndex(indexName, docDetail, fileContent);
      expect(osClient.update).toHaveBeenLastCalledWith(indexMe);

      expect(result).toEqual('Success!')
   });

   test('short circuits, when no fileKey',
        async () =>
   {
      const event = { ...exampleEvent, Records: [] };
      const ogRecord = exampleEvent.Records[0];

      event.Records[0] = {
         ...ogRecord,
         dynamodb: {
            ...ogRecord.dynamodb,
            NewImage: { ...ogRecord.dynamodb.NewImage, fileKey: {S: ''}, }
         }
      };

      const message = 'Missing File Key: aborting update';
      await expect(handler(event)).resolves.toEqual(message);
   });

   test('short circuits, when event record does not contain NewImage',
        async () =>
   {
     const event = { ...exampleEvent, Records: [] };
     const record = { ...exampleEvent.Records[0] };
     const dynamodb =  { NewImage: undefined, ...record.dynamodb};
     delete dynamodb.NewImage;
     event.Records[0] = record;
     event.Records[0].dynamodb = dynamodb;
     const message = 'Missing NewImage: aborting update';
     await expect(handler(event)).resolves.toEqual(message);
   });

   test('returns an error when unable to find the file in S3',
        async () =>
   {
      const event = { ...exampleEvent };
      s3Mock.on(GetObjectCommand).resolves({ Body: null });

      const message = 'Unable to locate Uploaded file';
      await expect(handler(event)).rejects.toEqual(message);
   });

   test('reports an error, and does not update the index for unsupported type',
        async () =>
   {
      const filePath = `${testFiles}/../public/favicon.ico`;
      const stream = fs.createReadStream(filePath);
      stream.setEncoding('binary');
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const event = { ...exampleEvent, Records: [] };
      const ogRecord = exampleEvent.Records[0];

      event.Records[0] = {
         ...ogRecord,
         dynamodb: {
            ...ogRecord.dynamodb,
            NewImage: { ...ogRecord.dynamodb.NewImage, fileKey: {S: filePath}, }
         }
      };

      expect(isTextFile(filePath)).toBe(false);
      expect(isOfficeDocument(filePath)).toBe(false);

      const osClient = Client.mock.instances[0];
      const result = await handler(event);

      expect(osClient.update).not.toHaveBeenCalled();

      const expected = 'UnSupported File extension: Unable to extract text.';
      expect(result).toEqual(expected);
   });
});