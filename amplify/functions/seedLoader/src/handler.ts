import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { logger } from '../../shared/logger';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

const SYSTEM_USER = {
   id:        '00000000-0000-0000-0000-000000000001',
   name:      'System',
   email:     'noreply@smalgyax-files.org',
   isAdmin:   false,
   createdAt: '2023-06-23T01:13:51.459Z',
   updatedAt: '2023-06-23T01:13:51.459Z',
};

const DEFAULT_BOX = {
   id:          '75ca183f-a199-4d3d-9ac3-e10432965276',
   name:        'Public',
   waa:         "Nlip 'gynnm",
   ownerId:     '00000000-0000-0000-0000-000000000001',
   purpose:     'DEFAULT',
   defaultRole: 'WRITE',
   createdAt:   '2023-06-23T01:13:51.459Z',
   updatedAt:   '2023-07-23T19:37:01.255Z',
};

export const handler = async (event: any) =>
{
   logger.log('Seeding default data', event);

   const xbiisTableName = process.env.XBIIS_TABLE_NAME;
   const userTableName  = process.env.USER_TABLE_NAME;

   if (!xbiisTableName || !userTableName)
   { throw new Error('Table name environment variables not set'); }

   try
   {
      await client.send(new PutItemCommand({
         TableName: userTableName,
         Item: {
            __typename: { S: 'User' },
            id:         { S: SYSTEM_USER.id },
            name:       { S: SYSTEM_USER.name },
            email:      { S: SYSTEM_USER.email },
            isAdmin:    { BOOL: SYSTEM_USER.isAdmin },
            createdAt:  { S: SYSTEM_USER.createdAt },
            updatedAt:  { S: SYSTEM_USER.updatedAt },
         },
         ConditionExpression: 'attribute_not_exists(id)',
      }));
      logger.log('System user created');
   }
   catch (error: any)
   {
      if ('ConditionalCheckFailedException' === error.name)
      { logger.log('System user already exists'); }
      else
      {
         logger.error('Error seeding system user:', error);
         throw error;
      }
   }

   try
   {
      await client.send(new PutItemCommand({
         TableName: xbiisTableName,
         Item: {
            __typename:   { S: 'Xbiis' },
            id:           { S: DEFAULT_BOX.id },
            name:         { S: DEFAULT_BOX.name },
            waa:          { S: DEFAULT_BOX.waa },
            xbiisOwnerId: { S: DEFAULT_BOX.ownerId },
            purpose:      { S: DEFAULT_BOX.purpose },
            defaultRole:  { S: DEFAULT_BOX.defaultRole },
            createdAt:    { S: DEFAULT_BOX.createdAt },
            updatedAt:    { S: DEFAULT_BOX.updatedAt },
         },
         ConditionExpression: 'attribute_not_exists(id)',
      }));
      logger.log('Default box created');
      return { statusCode: 200, body: 'Default data seeded' };
   }
   catch (error: any)
   {
      if ('ConditionalCheckFailedException' === error.name)
      {
         logger.log('Default box already exists');
         return { statusCode: 200, body: 'Default data already exists' };
      }
      logger.error('Error seeding default box:', error);
      throw error;
   }
};
