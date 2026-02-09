import { defineFunction } from '@aws-amplify/backend';

export const ingestTrigger = defineFunction({
   name: 'ingestTrigger',
   entry: '../src/handler.ts',
   runtime: 22,
   timeoutSeconds: 300,
   memoryMB: 512,
});
