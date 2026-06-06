import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

const isProd = process.env.AWS_BRANCH === 'main' || process.env.NODE_ENV === 'production';
const isSandbox = !process.env.AWS_BRANCH && !process.env.NODE_ENV;

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
      },
      loginWithAmazon: {
        clientId: secret('AMAZON_CLIENT_ID'),
        clientSecret: secret('AMAZON_CLIENT_SECRET'),
      },
      callbackUrls: [
        'http://localhost:3000/',
        'https://dev.smalgyax-files.org/',
        'https://smalgyax-files.org/',
      ],
      logoutUrls: [
        'http://localhost:3000/',
        'https://dev.smalgyax-files.org/',
        'https://smalgyax-files.org/',
      ],
    },
  },
  userAttributes: {
    'custom:waa': {
      dataType: 'String',
      mutable: true,
    },
  },
  // SES configuration applied via CDK in backend.ts
  // This fromEmail is used when SES is configured
  ...((isProd || isSandbox) && {
    senders: {
      email: {
        fromEmail: 'no-reply@smalgyax-files.org',
      },
    },
  }),
});
