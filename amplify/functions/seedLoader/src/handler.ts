import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { logger } from '../../shared/logger';
import { SystemUser } from '../../../../src/data/SystemUser.js';
import { UnknownAuthor } from '../../../../src/data/UnknownAuthor.js';
import { DefaultBox } from '../../../../src/data/DefaultBox.js';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

/**
 * Seed Loader Lambda
 * 
 * Seeds required environment data for all environments (dev, staging, production).
 * 
 * **Trigger:** Manual invocation or deployment automation
 * 
 * **Responsibilities:**
 * - Create System User (required for system operations)
 * - Create Unknown Author (default author for documents without attribution)
 * - Create Default Box (public box for shared content)
 * - Ensure idempotent seeding (skip if records already exist)
 * 
 * **Integration Points:**
 * - DynamoDB (User, Author, Xbiis tables)
 * - Frontend data constants (imports SystemUser, UnknownAuthor, DefaultBox)
 * 
 * **Seeded Records:**
 * - System User: Special user account for system-level operations
 * - Unknown Author: Default author when document author is not specified
 * - Default Box: Public box with DEFAULT purpose for shared content
 * 
 * **Business Logic:**
 * - Uses conditional writes to prevent duplicate records
 * - Imports data constants from frontend to ensure consistency
 * - Logs success or skip messages for each record
 * - All environments require these records for proper operation
 * 
 * @param event - Invocation event (unused)
 * @returns Status response indicating success or existing data
 */
export const handler = async (event: any) =>
{
   logger.log('Seeding default data', event);

   const xbiisTableName  = process.env.XBIIS_TABLE_NAME;
   const userTableName   = process.env.USER_TABLE_NAME;
   const authorTableName = process.env.AUTHOR_TABLE_NAME;

   if (!xbiisTableName || !userTableName || !authorTableName)
   { throw new Error('Table name environment variables not set'); }

   // Seed System User
   try
   {
      await client.send(new PutItemCommand({
         TableName: userTableName,
         Item: {
            __typename: { S: 'User' },
            id:         { S: SystemUser.id },
            name:       { S: SystemUser.name },
            email:      { S: SystemUser.email },
            ...(typeof SystemUser.isAdmin === 'boolean' && {
               isAdmin: { BOOL: SystemUser.isAdmin }
            }),
            createdAt:  { S: SystemUser.createdAt },
            updatedAt:  { S: SystemUser.updatedAt },
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

   // Seed Unknown Author
   try
   {
      await client.send(new PutItemCommand({
         TableName: authorTableName,
         Item: {
            __typename: { S: 'Author' },
            id:         { S: UnknownAuthor.id },
            name:       { S: UnknownAuthor.name },
            waa:        { S: UnknownAuthor.waa! },
            createdAt:  { S: UnknownAuthor.createdAt },
            updatedAt:  { S: UnknownAuthor.updatedAt },
         },
         ConditionExpression: 'attribute_not_exists(id)',
      }));
      logger.log('Unknown author created');
   }
   catch (error: any)
   {
      if ('ConditionalCheckFailedException' === error.name)
      { logger.log('Unknown author already exists'); }
      else
      {
         logger.error('Error seeding unknown author:', error);
         throw error;
      }
   }

   // Seed Default Box
   try
   {
      await client.send(new PutItemCommand({
         TableName: xbiisTableName,
         Item: {
            __typename:   { S: 'Xbiis' },
            id:           { S: DefaultBox.id },
            name:         { S: DefaultBox.name },
            waa:          { S: DefaultBox.waa! },
            ownerUserId:  { S: DefaultBox.ownerUserId! },
            xbiisOwnerId: { S: DefaultBox.xbiisOwnerId! },
            purpose:      { S: DefaultBox.purpose! },
            defaultRole:  { S: DefaultBox.defaultRole! },
            createdAt:    { S: DefaultBox.createdAt },
            updatedAt:    { S: DefaultBox.updatedAt },
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
