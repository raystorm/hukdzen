import { defineFunction } from '@aws-amplify/backend';

export const seedLoader = defineFunction({
   name: 'seedLoader',
   entry: './handler.js',
   timeoutSeconds: 60,
});
