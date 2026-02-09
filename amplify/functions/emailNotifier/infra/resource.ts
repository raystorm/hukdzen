import { defineFunction } from '@aws-amplify/backend';

export const emailNotifier = defineFunction({
   name: 'emailNotifier',
   entry: '../src/handler.ts',
   runtime: 22,
   environment: {
      SENDER_EMAIL: 'noreply@smalgyax-files.org',
      CONFIGURATION_SET_NAME: 'hukdzen-dev',
   },
   timeoutSeconds: 30,
});
