import { defineFunction } from '@aws-amplify/backend';

export const seedLoader = defineFunction({
   name: 'seedLoader',
   entry: './index.ts',
   runtime: 22,
   timeoutSeconds: 60,
});
