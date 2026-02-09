import { defineFunction } from '@aws-amplify/backend';

export const seedLoader = defineFunction({
   name: 'seedLoader',
   entry: './index.ts',
   timeoutSeconds: 60,
});
