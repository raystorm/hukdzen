import { defineFunction } from '@aws-amplify/backend';

export const ingestTrigger = defineFunction({
   name: 'ingestTrigger',
   entry: './handler.ts',
   runtime: 18,
   timeoutSeconds: 300,
   memoryMB: 512,
});
