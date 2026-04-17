import { defineFunction } from '@aws-amplify/backend';

export const emailNotifier = defineFunction({
   name: 'emailNotifier',
   entry: '../src/handler.ts',
   runtime: 22,
   environment: {
      SENDER_EMAIL: 'noreply@smalgyax-files.org',
      CONFIGURATION_SET_NAME: 'hukdzen-dev',
      SES_REGION: 'us-west-2',
   },
   timeoutSeconds: 30,
   resourceGroupName: "data",
});
