import { defineFunction } from '@aws-amplify/backend';

export const boxUserHydrator = defineFunction({
   name: 'BoxUserHydrator',
   entry: '../src/BoxUserHydrator.ts',
   resourceGroupName: 'data',
});
