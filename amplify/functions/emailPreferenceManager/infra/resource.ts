import { defineFunction } from '@aws-amplify/backend';

export const emailPreferenceManager = defineFunction({
   name: 'emailPreferenceManager',
   entry: '../src/handler.ts',
   runtime: 22,
   timeoutSeconds: 30,
   memoryMB: 256,
});
