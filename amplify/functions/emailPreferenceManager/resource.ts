import { defineFunction } from '@aws-amplify/backend';

export const emailPreferenceManager = defineFunction({
   name: 'emailPreferenceManager',
   entry: './handler.js',
   runtime: 22,
   timeoutSeconds: 30,
   memoryMB: 256,
});
