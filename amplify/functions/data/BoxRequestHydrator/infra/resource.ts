import { defineFunction } from '@aws-amplify/backend';

export const boxRequestHydrator = defineFunction({
   name: 'BoxRequestHydrator',
   entry: '../src/BoxRequestHydrator.ts',
   resourceGroupName: 'data',
});
