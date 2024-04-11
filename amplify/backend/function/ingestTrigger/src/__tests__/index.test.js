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
 *  Relative Path to testFiles Folder
 *  @type {string}
 */
const testFiles = '../../../../../testFiles';

describe('ingestTrigger (index.js)', () => {

   beforeEach(() => {
      //set update to be respond w/ success
      const response = { statusCode: 200 };
      const osClient = Client.mock.instances[0];
      osClient.update.mockResolvedValue(response);
   });

   test('handler updates index for a text file', async () => {
      const filePath = `${testFiles}/README.md`;
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const stream = fs.createReadStream(filePath);
      const mixin = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: mixin });

      const event = { ...exampleEvent };
      event.Records[0].dynamodb.NewImage.fileKey.S = filePath;
      const docDetail = event.Records[0].dynamodb;
      const osClient = Client.mock.instances[0];

      expect(isTextFile(docDetail.NewImage.fileKey.S)).toBe(true);

      const result = await handler(event);

      const indexMe = buildSearchIndex(indexName, docDetail, fileContent);
      expect(osClient.update).toHaveBeenCalledWith(indexMe);

      const algyaxalgyax = [ "Algyax", "yawkł", "üünx",
        "T'sm g̱alüünx wil dip lu tgi dooł ła̱'a̱sk nag̱oog̱a dm dip yetst.",
        "ẅa̱a̱x", "ḵ'a'aam", "a̱x'a̱xłk", "g̱ag̱oot", "ḏakda̱xł"];

      for ( const algyax of algyaxalgyax )
      { expect(fileContent).toContain(algyax); }

      expect(result).toEqual('Success!')
   });
});