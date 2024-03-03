/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_HUKDZEN_GRAPHQLAPIIDOUTPUT
	API_HUKDZEN_GRAPHQLAPIENDPOINTOUTPUT
	API_HUKDZEN_GRAPHQLAPIKEYOUTPUT
	STORAGE_HALIAMWAALS3_BUCKETNAME
	API_HUKDZEN_DOCUMENTDETAILSTABLE_NAME
	API_HUKDZEN_DOCUMENTDETAILSTABLE_ARN
   OS_DOMAIN_URL
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
// */

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { indexUpdater } = require('OpenSearch');
const {
   isTextFile, isOfficeDocument, getOfficeDocumentText
} = require('TextExtractor');

//TODO: sync with Amplify app, env variable?
const S3AccessLevel = 'public';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

/**
 *  Build Search Index
 *  @param indexName string
 *  @param record DynamoDBStreamEvent
 *  @param fileContents string
 *  @returns {Promise<ApiResponse<Record<string, any>, Context>>}
 */
const buildSearchIndex = (indexName, record, fileContents) =>
{
   const insert = record.NewImage;
   let keys = [];
   // eslint-disable-next-line no-undef
   for ( item of insert.keywords.L ) { keys.push(item.S); }
   keys.push(fileContents);

   /*
    *  TODO: keep an eye on searching,
    *        look into string analysis and tokenization for fileContents
    */

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
            type: insert.type.S ?? '',
            version: insert.version.N,
            //box: Xbiis,
            bc_title: insert.bc_title.S,
            bc_description: insert.bc_description.S,
            ak_title: insert.ak_title.S,
            ak_description: insert.ak_description.S,
            createdAt: insert.createdAt.S,
            updatedAt: insert.updatedAt.S,
            documentDetailsAuthorId: insert.documentDetailsAuthorId.S,
            documentDetailsDocOwnerId: insert.documentDetailsDocOwnerId.S,
            documentDetailsBoxId: insert.documentDetailsBoxId.S,
            keywords: keys
         }
      },
      refresh: true
   };
   return indexMe;
}

/**
 *  Lombda function to extract Text Content from
 *  @param event
 *  @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  // TODO: remove after debug
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records)
  {
    console.log("event id:" + record.eventID);
    console.log("event name:" + record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  }
   //END - remove after debug

  const indexName = 'documentdetails';

  const bucketName = process.env.STORAGE_HALIAMWAALS3_BUCKETNAME;

  try
  {
     //check for INSERT/MODIFY
     const eventType = event.Records[0].eventName;

     //Update / Insert in DynamoDB
     const docDetail = event.Records[0].dynamodb;

     /*
     const testKeywords = 'hard-coded keywords, not from the file.';
     const indexItem = buildSearchIndex(indexName, docDetail, testKeywords);
     console.log(`Updating index with: ${JSON.stringify(indexItem)}`);
     */

     //Where to get the file from in S3
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

     if ( isTextFile(fileKey) )
     {
        //console.log(`text: ${fileBuff.toString()}`);
        await indexUpdater(buildSearchIndex(indexName, docDetail,
                                            file.Body.toString()));
     }
     else if ( isOfficeDocument(fileKey) )
     {
        const ar = await file.Body.transformToByteArray();
        const fileBuff = Buffer.from(ar);

        const fileText = await getOfficeDocumentText(fileBuff);
        //console.log(`text: ${fileText}`);
        await indexUpdater(buildSearchIndex(indexName, docDetail, fileText));
     }
     else
     {
        const errorUpdate = {
           id: docDetail.id,
           index: indexName,
           //TODO: Smalgyax, this error.
           body: 'file extension not supported, Unable to extract text from this File.'
        };
        await indexUpdater(errorUpdate);
     }

    return Promise.resolve('Success!');
  }
  catch (err)
  {  //TODO: handle any errors.
     console.log(`unexpected error indexing file: ${err}`)
     //console.log(err);
     throw err; //duck ?
  }
}
