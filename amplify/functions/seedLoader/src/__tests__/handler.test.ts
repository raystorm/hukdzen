import { handler } from '../handler';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

jest.mock('@aws-sdk/client-dynamodb', () => {
   const mockSend = jest.fn();
   return {
      DynamoDBClient: jest.fn(() => ({ send: mockSend })),
      PutItemCommand: jest.fn((input) => input)
   }
});
const mockSend = (DynamoDBClient as jest.Mock).mock.results[0].value.send;

describe('seedLoader handler', () =>
{
   const originalEnv = process.env;

   beforeEach(() =>
   {
      jest.clearAllMocks();
      process.env = {
         ...originalEnv,
         USER_TABLE_NAME:  'User-test',
         XBIIS_TABLE_NAME: 'Xbiis-test',
      };
   });

   afterEach(() => { process.env = originalEnv; });

   describe('successful seeding', () =>
   {
      it('creates both System User and Default Box', async () =>
      {
         mockSend.mockResolvedValue({});

         const result = await handler({});

         expect(mockSend).toHaveBeenCalledTimes(2);
         expect(result).toEqual({ statusCode: 200, body: 'Default data seeded' });

         const userCall = mockSend.mock.calls[0][0];
         expect(userCall.TableName).toBe('User-test');
         expect(userCall.Item.id.S).toBe('00000000-0000-0000-0000-000000000001');
         expect(userCall.Item.name.S).toBe('System');
         expect(userCall.Item.email.S).toBe('noreply@smalgyax-files.org');
         expect(userCall.Item.isAdmin.BOOL).toBe(false);
         expect(userCall.ConditionExpression).toBe('attribute_not_exists(id)');

         const boxCall = mockSend.mock.calls[1][0];
         expect(boxCall.TableName).toBe('Xbiis-test');
         expect(boxCall.Item.id.S).toBe('75ca183f-a199-4d3d-9ac3-e10432965276');
         expect(boxCall.Item.name.S).toBe('Public');
         expect(boxCall.Item.xbiisOwnerId.S).toBe('00000000-0000-0000-0000-000000000001');
         expect(boxCall.Item.purpose.S).toBe('DEFAULT');
         expect(boxCall.Item.defaultRole.S).toBe('WRITE');
         expect(boxCall.ConditionExpression).toBe('attribute_not_exists(id)');
      });
   });

   describe('partial existence scenarios', () =>
   {
      it('handles System User exists, creates Default Box', async () =>
      {
         mockSend
            .mockRejectedValueOnce({ name: 'ConditionalCheckFailedException' })
            .mockResolvedValueOnce({});

         const result = await handler({});

         expect(mockSend).toHaveBeenCalledTimes(2);
         expect(result).toEqual({ statusCode: 200, body: 'Default data seeded' });
      });

      it('creates System User, handles Default Box exists', async () =>
      {
         mockSend
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce({ name: 'ConditionalCheckFailedException' });

         const result = await handler({});

         expect(mockSend).toHaveBeenCalledTimes(2);
         expect(result).toEqual({ statusCode: 200, body: 'Default data already exists' });
      });

      it('handles both already exist', async () =>
      {
         mockSend.mockRejectedValue({ name: 'ConditionalCheckFailedException' });

         const result = await handler({});

         expect(mockSend).toHaveBeenCalledTimes(2);
         expect(result).toEqual({ statusCode: 200, body: 'Default data already exists' });
      });
   });

   describe('error handling', () =>
   {
      it('throws error when table names not set', async () =>
      {
         delete process.env.USER_TABLE_NAME;

         await expect(handler({})).rejects.toThrow('Table name environment variables not set');
         expect(mockSend).not.toHaveBeenCalled();
      });

      it('re-throws unexpected error on System User creation', async () =>
      {
         mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

         await expect(handler({})).rejects.toThrow('DynamoDB error');
         expect(mockSend).toHaveBeenCalledTimes(1);
      });

      it('re-throws unexpected error on Default Box creation', async () =>
      {
         mockSend
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce(new Error('DynamoDB error'));

         await expect(handler({})).rejects.toThrow('DynamoDB error');
         expect(mockSend).toHaveBeenCalledTimes(2);
      });
   });
});
