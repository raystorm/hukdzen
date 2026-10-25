/**
 * Centralized Migration Configuration
 * 
 * Single source of truth for all environment-specific settings
 * across migration scripts.
 */

import {DefaultBox} from '../src/data/DefaultBox.js';
import {SystemUser} from '../src/data/SystemUser.js';
import {UnknownAuthor} from '../src/data/UnknownAuthor.js';

export const GEN1_CONFIG = {
   dev: {
      region: 'us-west-2',
      tablePrefix: 'vziz2d2xgbbx7ec2s44ncx73p4',
      s3Bucket: 'haliamwaal-s3211334-dev',
      userPoolId: 'us-west-2_c41jO0Sve',
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'p56j3ha5kjhmjn66c4m4eevl4a',
      s3Bucket: 'haliamwaal-s3120918-prod',
      userPoolId: 'us-west-2_2ctiTtRrP',
   }
};

export const GEN2_CONFIG = {
   sbx: {
      region: 'us-east-1',
      tablePrefix: '3wykgicryreapnnyreynx2a2q4',
      // TODO: Update after sandbox deployment
      s3Bucket: 'amplify-hukdzen-tburton-s-haliamwaals3bucket411f77-apovxawmmdme',
      userPoolId: 'us-east-1_Yq0GZXLfs',
      // ingestTrigger Lambda (deployed only when search is enabled: npm run sbx:search)
      ingestTriggerFunction: 'amplify-hukdzen-tburton-s-ingestTriggerlambda63598-5caAkvZJsQsB',
      gen1Source: 'dev' // sbx uses dev data
   },
   dev: {
      region: 'us-east-1',
      // TODO: Update after Gen2 deployment
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY',
      s3Bucket: 'UPDATE_AFTER_GEN2_DEPLOY',
      userPoolId: 'UPDATE_AFTER_GEN2_DEPLOY',
      ingestTriggerFunction: 'UPDATE_AFTER_GEN2_DEPLOY'
   },
   prod: {
      region: 'us-west-2',
      // TODO: Update after Gen2 deployment
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY',
      s3Bucket: 'UPDATE_AFTER_GEN2_DEPLOY',
      userPoolId: 'UPDATE_AFTER_GEN2_DEPLOY',
      ingestTriggerFunction: 'UPDATE_AFTER_GEN2_DEPLOY'
   }
};

/**
 * Seeded records, imported from src/data so there is one definition.
 * The seedLoader Lambda writes these same records on every Gen2 deploy.
 */
export const SYSTEM_USER_ID = SystemUser.id;

/**
 * Canonical System User.
 * It is not a real person: it never gets a Cognito account, and its id is never remapped.
 */
export const SYSTEM_USER = {
   id:      SystemUser.id,
   name:    SystemUser.name,
   email:   SystemUser.email,
   isAdmin: SystemUser.isAdmin
};

/**
 * Canonical Unknown Author.
 * Gen1 "Unknown" authors are merged into this record during update-foreign-keys.
 */
export const UNKNOWN_AUTHOR = {
   id:   UnknownAuthor.id,
   name: UnknownAuthor.name,
   waa:  UnknownAuthor.waa
};

/**
 * Canonical Default Box ("Public").
 * It is the only box with purpose DEFAULT, and the System User always owns it.
 * In Gen1 it was owned by a real user, before the System User existed, and it had
 * no purpose or defaultRole. Importing it overwrites the seeded record, so the
 * transform uses these values instead of the Gen1 ones.
 */
export const DEFAULT_BOX_ID = DefaultBox.id;

export const DEFAULT_BOX = {
   id:          DefaultBox.id,
   name:        DefaultBox.name,
   waa:         DefaultBox.waa,
   purpose:     DefaultBox.purpose,
   defaultRole: DefaultBox.defaultRole
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
