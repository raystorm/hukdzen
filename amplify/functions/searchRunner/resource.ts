import { defineFunction } from '@aws-amplify/backend';

export const searchRunner = defineFunction({
   name: 'searchRunner',
   entry: './handler.ts',
   timeoutSeconds: 30,
   memoryMB: 512,
   runtime: 18,
});
