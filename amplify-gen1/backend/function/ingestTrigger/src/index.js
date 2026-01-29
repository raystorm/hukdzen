/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_HUKDZEN_GRAPHQLAPIIDOUTPUT
	API_HUKDZEN_GRAPHQLAPIENDPOINTOUTPUT
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

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { indexUpdater, openSearchHealthCheck } = require('./OpenSearch.js');
const {
        isTextFile, isOfficeDocument, getOfficeDocumentText
      } = require('./TextExtractor');
const { logger } = require('./logger.js');

//TODO: sync with Amplify app, env variable?
const S3AccessLevel = 'public';
exports.S3AccessLevel = S3AccessLevel;

const indexName = 'documentdetails';
exports.indexName = indexName;

const s3Client = new S3Client({ region: process.env.AWS_REGION });

/**
 *  Amplify Environment, dev, prod, etc
 *  @type {string}
 */
const amplifyEnv = process.env.ENV;

const isProd = amplifyEnv === 'prod';

/**
 *  Build Search Index
 *  @param indexName string
 *  @param record DynamoDBStreamEvent
 *  @param fileContents string
 */
const buildSearchIndex = (indexName, record, fileContents) =>
{
   const insert = record.NewImage;
   let keys = [];
   // eslint-disable-next-line no-undef
   for ( const item of insert.keywords.L ) { keys.push(item.S); }
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

exports.buildSearchIndex = buildSearchIndex;

/**
 *  Lambda function to extract Text Content from
 *  @param event
 *  @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  if ( !isProd )
  {
     logger.log('EVENT:', event);
     for (const record of event.Records)
     {
        logger.log("event id:",           record.eventID);
        logger.log("event name:",         record.eventName);
        logger.log('DynamoDB Record: %j', record.dynamodb);
     }
  }
  //END - remove after debug

  const bucketName = process.env.STORAGE_HALIAMWAALS3_BUCKETNAME;

  try
  {  //check for INSERT/MODIFY
     const eventType = event.Records[0].eventName;

     //TODO: double check event types, and only act on, insert/update

     //Update / Insert in DynamoDB
     const docDetail = event.Records[0].dynamodb;

     /*
     const testKeywords = 'hard-coded keywords, not from the file.';
     const indexItem = buildSearchIndex(indexName, docDetail, testKeywords);
     console.log(`Updating index with: ${JSON.stringify(indexItem)}`);
     */

     if ( !docDetail.NewImage )
     {
        const message = 'Missing NewImage: aborting update';
        logger.error(message);
        return Promise.reject(message);
     }

     //Where to get the file from in S3
     const filePrefix = S3AccessLevel+'/';
     const fileKey = filePrefix+docDetail.NewImage.fileKey.S;

     if ( filePrefix === fileKey )
     {
        const message = 'Missing File Key: aborting update';
        logger.error(message);
        return Promise.reject(message);
     }

     //await openSearchHealthCheck(); //validate connection to OpenSearch

     const getFileParams = { Bucket: bucketName, Key: fileKey };
     if ( !isProd ) { logger.log('About to GET file for:', getFileParams); }
     const file = await s3Client.send(new GetObjectCommand(getFileParams));

     if ( !file.Body )
     {
        const failMessage = 'Unable to locate Uploaded file';
        logger.error(failMessage);
        return Promise.reject(failMessage);
     }

     if ( isTextFile(fileKey) )
     {
        //if ( !isProd ) { console.log('text:', fileBuff); }
        const content = await file.Body?.transformToString();
        await indexUpdater(buildSearchIndex(indexName, docDetail, content));
     }
     else if ( isOfficeDocument(fileKey) )
     {
        const ar = await file.Body.transformToByteArray();
        const fileBuff = Buffer.from(ar);

        const fileText = await getOfficeDocumentText(fileBuff);
        //if ( !isProd ) { logger.log('text:', fileText); }
        await indexUpdater(buildSearchIndex(indexName, docDetail, fileText));
     }
     else
     {
        const message = 'UnSupported File extension: Unable to extract text.';
        if ( !isProd ) { logger.warn(message); }
        return Promise.resolve(message);
     }

    return Promise.resolve('Success!');
  }
  catch (err)
  {  //TODO: handle any errors.
     logger.error('unexpected error indexing file:', err);
     //logger.log(err);
     throw err; //duck ?
  }
}
