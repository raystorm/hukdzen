import { defineFunction } from '@aws-amplify/backend';

export const emailNotifier = defineFunction({
   name: 'emailNotifier',
   entry: './handler.js',
   environment: {
      SENDER_EMAIL: 'noreply@smalgyax-files.org',
      CONFIGURATION_SET_NAME: 'hukdzen-dev',
   },
   timeoutSeconds: 30,
});
