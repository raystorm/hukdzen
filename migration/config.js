/**
 * Centralized Migration Configuration
 * 
 * Single source of truth for all environment-specific settings
 * across migration scripts.
 */

export const GEN1_CONFIG = {
   dev: {
      region: 'us-west-2',
      tablePrefix: 'vziz2d2xgbbx7ec2s44ncx73p4',
      s3Bucket: 'haliamwaal-s3211334-dev',
      duplicateAccountIds: [
         'facebook_10231024664460561',
         '6703dc53-6a3f-4631-9775-30b8d2c01289',
         '36e29345-a1df-4cb4-a83e-96ad3d8ace10',
         'b2faec0e-1068-4c0e-9871-07e977d484a1'
      ]
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'p56j3ha5kjhmjn66c4m4eevl4a',
      s3Bucket: 'haliamwaal-s3120918-prod',
      duplicateAccountIds: [
         'facebook_10231024664460561',
         'loginwithamazon_amzn1.account.aein3tipmmexfwuzptp4gfbwf5oa',
         '4756fb61-ce77-40cb-8076-226c438d0dc6'
      ]
   }
};

export const GEN2_CONFIG = {
   sbx: {
      region: 'us-east-1',
      tablePrefix: 'ffof5hci3baalf5gtc4r3gu7y4',
      s3Bucket: 'amplify-hukdzen-tburton-s-haliamwaals3bucket411f77-tshkukdlnbsv', // TODO: Update after sandbox deployment
      gen1Source: 'dev' // sbx uses dev data
   },
   dev: {
      region: 'us-east-1',
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY', // TODO: Update after Gen2 deployment
      s3Bucket: 'UPDATE_AFTER_GEN2_DEPLOY'
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY', // TODO: Update after Gen2 deployment
      s3Bucket: 'UPDATE_AFTER_GEN2_DEPLOY'
   }
};

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';

export const GEN1_COGNITO_CONFIG = {
   dev: {
      userPoolId: 'UPDATE_WITH_GEN1_DEV_POOL_ID',
      region: 'us-west-2'
   },
   prod: {
      userPoolId: 'UPDATE_WITH_GEN1_PROD_POOL_ID',
      region: 'us-west-2'
   }
};

export const COGNITO_CONFIG = {
   sbx: {
      userPoolId: 'us-east-1_XXXXXXXXX',
      region: 'us-east-1'
   },
   dev: {
      userPoolId: 'UPDATE_AFTER_GEN2_DEPLOY',
      region: 'us-east-1'
   },
   prod: {
      userPoolId: 'UPDATE_AFTER_GEN2_DEPLOY',
      region: 'us-west-2'
   }
};

export const OAUTH_PROVIDERS = {
   Google: 'Google',
   Facebook: 'Facebook',
   LoginWithAmazon: 'LoginWithAmazon'
};

export const GEN1_TABLES = [
   'User', 'Author', 'Xbiis', 'BoxUser',
   'DocumentDetails', 'Collection', 'CollectionItem'
];

export const GEN2_TABLES = [
   'User', 'Author', 'Box', 'BoxUser',
   'Document', 'Collection', 'CollectionItem'
];

export const TABLE_MAPPINGS = [
   { gen1: 'User', gen2: 'User' }, { gen1: 'Author', gen2: 'Author' },
   { gen1: 'DocumentDetails', gen2: 'Document' },
   { gen1: 'Xbiis', gen2: 'Box' }, { gen1: 'BoxUser', gen2: 'BoxUser' },
   { gen1: 'Collection', gen2: 'Collection' },
   { gen1: 'CollectionItem', gen2: 'CollectionItem' }
];
