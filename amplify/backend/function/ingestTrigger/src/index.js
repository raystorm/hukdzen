/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HALIAMWAALS3_BUCKETNAME
Amplify Params - DO NOT EDIT */

/*
 *  Lambda for OpenSearch, based on:
 *  https://opensearch.org/docs/latest/clients/javascript/index/
 *
 *  Lambda code also based on:
 *  https://docs.aws.amazon.com/lambda/latest/dg/example_serverless_S3_Lambda_section.html
 *  &&
 *  https://github.com/aws-samples/serverless-snippets/blob/main/integration-s3-to-lambda/example.ts
 */
/* -> require * /
import * as fs from 'fs';
import fetch from 'node-fetch';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { defaultProvider } from '@aws-sdk/credential-provider-node';  // V3 SDK.
import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import officeParser from "officeparser";
// */

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { defaultProvider }  = require( '@aws-sdk/credential-provider-node');  // V3 SDK.
const { Client }  = require( '@opensearch-project/opensearch');
const { AwsSigv4Signer }  = require( '@opensearch-project/opensearch/aws');
const officeParser = require('officeparser');

//TODO: sync with Amplify app, env variable?
const S3AccessLevel = 'public';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const osClient = new Client(
    {
      ...AwsSigv4Signer({
        region: process.env.REGION, //'us-west-2',
        service: 'es',  // 'aoss' for OpenSearch Serverless
        /*
         * Must return a Promise that resolve to an AWS.Credentials object.
         * Acquires credentials when the client starts and when they are expired.
         * The Client refreshes the Credentials only when they are expired.
         * With AWS SDK V2, Credentials.refreshPromise is used
         * when available to refresh the credentials.
         */

        // Example with AWS SDK V3:
        getCredentials: () => {
          // Any other method to acquire a new Credentials object can be used.
          const credentialsProvider = defaultProvider();
          return credentialsProvider();
        },
      }),
      // OpenSearch domain URL
      node: 'https://search-amplify-opense-15yt42dqhtcb4-7ranqi63ln2cw6cbzde7csujwq.us-west-2.es.amazonaws.com',
      // node: "https://xxx.region.aoss.amazonaws.com" for OpenSearch Serverless
    }
);

const buildSearchIndex = (indexName, record, fileContents) =>
{
   const insert = record.NewImage;

   const indexMe = {
      index: indexName,
      id: record.Keys.id.S, //get the key from the event, assume GUID String
      body:
      {
         doc:
         {
            __typename: insert.__typename.S,
            id: insert.id.S,
            eng_title: insert.eng_title.S,
            eng_description: insert.eng_description.S,
            //author: insert.author,
            //docOwner: User,
            fileKey: insert.fileKey.S,
            created: insert.created.S,
            updated: insert.updated ? insert.updated.S : '',
            type: insert.type ?? '',
            version: insert.version.N,
            //box: Xbiis,
            bc_title: insert.bc_title,
            bc_description: insert.bc_description,
            ak_title: insert.ak_title,
            ak_description: insert.ak_description,
            createdAt: insert.createdAt.S,
            updatedAt: insert.updatedAt.S,
            documentDetailsAuthorId: insert.documentDetailsAuthorId.S,
            documentDetailsDocOwnerId: insert.documentDetailsDocOwnerId.S,
            documentDetailsBoxId: insert.documentDetailsBoxId.S,
            keywords: fileContents
         }
      }
   };

   return indexMe;
}

const officeParserConfig =
{
   newlineDelimiter: " ",  // Separate new lineNs with a space instead of the default \n.
   ignoreNotes: true,      // Ignore notes while parsing presentation files like pptx or odp.
   tempFilesLocation: '/tmp',
}


const parseDocumentAndUpdateIndex = (indexName, docDetail, fileContents) =>
{
  console.log(`Parsing File`);
  // relative path is also fine => eg: files/myWorkSheet.ods
  officeParser.parseOfficeAsync(fileContents, officeParserConfig)
      .then(data => {
        console.log(`parsed data: ${data}`)
        const newText = data;
        const indexItem = buildSearchIndex(indexName, docDetail, newText);
        console.log(`Updating index with: ${JSON.stringify(indexItem)}`);
        const response = osClient.update(indexItem);
      })
      .catch(err => {
          console.error(err);
          console.error(`Error Parsing file: ${err}`);
          throw err  //duck
      })
      .finally(console.log('Finished parsing file.'));
}

const getExtension = (path) => {
  return path.substring(path.lastIndexOf('.')+1);
}

const extensions = ["docx", "pptx", "xlsx",
                            "odt", "odp", "ods",
                            //TODO: move PDF to AWS Textract
                            "pdf"];

//assume parse-ability based on file extension
const isParseable = (path) =>
{
  if ( !path.includes('.') ) { return false; }
  const extension = getExtension(path);
  const canParse = extensions.includes(extension);
  console.log(`File ${path} is Parsable: ${canParse} for ${extension}`);
  return canParse;
};


/**
 *  Lombda function to extract Text Content from
 *  @param event
 *  @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  //TODO: remove after debug
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records)
  {
    console.log("event id:" + record.eventID);
    console.log("event name:" + record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  }

  const indexName = 'documentdetails';
  try
  {
      /*
       *  TODO: find a more efficient way to do this.
       *        This should only be done ONCE, not every time.
       * /
      //update the index with keywords
      // @ t s - i g n o r e
      osClient.indices.update({  //.update({
         index: indexName,
         body: {
            mappings: {
               properties: { doc: { keywords: { type: 'keyword' } } }
            }
         },
     });
     // END - update index schema */

    //Index Exists, Updating DynamoDB index w/ a new field

    const bucketName = process.env.STORAGE_HALIAMWAALS3_BUCKETNAME;

    //check for INSERT/MODIFY
    const eventType = event.Records[0].eventName;

    const docDetail = event.Records[0].dynamodb;

     //TODO: test BC orthography chars.
     const testKeywords = 'hard-coded keywords, not from the file.';
     const indexItem = buildSearchIndex(indexName, docDetail, testKeywords);
     console.log(`Updating index with: ${JSON.stringify(indexItem)}`);
     //NOT updating - investigate
     const response = osClient.update(indexItem)
                              .then(response => {
                                 console.log('index update attempted.');
                                 // Check status
                                 if(response.status === 200)
                                 { console.log("Index updated successfully"); }
                                 else
                                 {
                                    //console.log(`Error updating index: ${JSON.stringify(response)}`);
                                    console.log(`Error updating index`);
                                    throw new Error("Update failed");
                                 }
                              })
                              .catch(err => {
                                 console.log(`Update failed`);
                                 //console.log(err);
                              })
                              .finally(console.log('Finished updating index.'));

    /* Disable for hard-coded keywords * /
    const fileKey = S3AccessLevel+'/'+docDetail.NewImage.fileKey.S;
          //decodeURIComponent(s3.object.key.replace(/\+/g, ' '));

    const getFileParams = { Bucket: bucketName, Key: fileKey };
    console.log(`About to GET file for: ${JSON.stringify(getFileParams)}`);
    const file = await s3Client.send(new GetObjectCommand(getFileParams));

     if ( !file.Body )
     {
         const failMessage = 'Unable to locate Uploaded file';
         console.log(failMessage)
         return Promise.reject(failMessage);
     }

     file.Body.transformToByteArray()
         .then(ar => {
            //TODO: support for .txt, and .csv files.
           //parse if known ext.
           if (isParseable(fileKey))
           { parseDocumentAndUpdateIndex(indexName, docDetail, Buffer.from(ar)); }
           //TODO: add textTract check / handler here.
           else
           {
             const response = osClient.index({
               id: docDetail.id,
               index: indexName,
               //TODO: Smalgyax, this error.
               body: 'file extension not supported, Unable to extract text from this File.'
             });
           }
         });
     */
    return Promise.resolve('Success!');
  }
  catch (err)
  {  //TODO: handle any errors.
    console.log(`unexpected error indexing file: ${err}`)
    //console.log(err);
    throw err; //duck ?
  }
}
