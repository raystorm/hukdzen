import { defineFunction } from '@aws-amplify/backend';

export const searchRunner = defineFunction({
   name: 'searchRunner',
   entry: './handler.ts',
   runtime: 22,
   timeoutSeconds: 30,
   memoryMB: 512,
});
