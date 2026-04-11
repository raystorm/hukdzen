import { defineFunction } from '@aws-amplify/backend';

export const seedLoader = defineFunction({
   name: 'seedLoader',
   entry: '../src/seedLoader.ts',
   runtime: 22,
   timeoutSeconds: 60,
});
