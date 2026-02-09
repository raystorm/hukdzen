import { defineFunction } from '@aws-amplify/backend';

export const searchRunner = defineFunction({
   name: 'searchRunner',
   entry: '../src/handler.ts',
   runtime: 22,
   timeoutSeconds: 30,
   memoryMB: 512,
});
