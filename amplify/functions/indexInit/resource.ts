import { defineFunction } from '@aws-amplify/backend';

export const indexInit = defineFunction({
   name: 'indexInit',
   entry: './index.ts',
   runtime: 22,
   timeoutSeconds: 60,
});
