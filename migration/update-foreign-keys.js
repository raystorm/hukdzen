#!/usr/bin/env node

/**
 * Update Foreign Keys Script (Phase 2)
 * 
 * Updates all User IDs and foreign keys using ID mapping
 * Validates mapping completeness before transformation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GEN2_CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.argv[2] || 'sbx';

if (!['sbx', 'dev', 'prod'].includes(ENV))
{
   console.error('Usage: node update-foreign-keys.js [sbx|dev|prod]');
   process.exit(1);
}

/**
 * Validate mapping completeness
 */
export function validateMapping(users, mapping)
{
   const missingUsers = users.filter(u => !mapping.has(u.id));
   
   if (missingUsers.length > 0)
   {
      console.error(`\\nERROR: Missing mappings for ${missingUsers.length} users:`);
      missingUsers.forEach(u => {
         console.error(`  - ${u.email} (${u.id})`);
      });
      return { valid: false, missingUsers };
   }
   
   return { valid: true, missingUsers: [] };
}

/**
 * Update all foreign keys using mapping
 */
export function updateForeignKeys(data, mapping)
{
   const updated = { ...data };
   
   // User table
   if (updated.User)
   {
      updated.User = updated.User.map(user => ({
         ...user,
         id: mapping.get(user.id) || user.id
      }));
   }
   
   // Document table
   if (updated.Document)
   {
      updated.Document = updated.Document.map(doc => ({
         ...doc,
         documentContentOwnerUserId: 
            mapping.get(doc.documentContentOwnerUserId) || 
            doc.documentContentOwnerUserId
      }));
   }
   
   // Box table
   if (updated.Box)
   {
      updated.Box = updated.Box.map(box => ({
         ...box,
         ownerUserId: mapping.get(box.ownerUserId) || box.ownerUserId
      }));
   }
   
   // BoxUser table
   if (updated.BoxUser)
   {
      updated.BoxUser = updated.BoxUser.map(bu => ({
         ...bu,
         userUserId: mapping.get(bu.userUserId) || bu.userUserId,
         boxUserUserId: mapping.get(bu.boxUserUserId) || bu.boxUserUserId
      }));
   }
   
   // Collection table
   if (updated.Collection)
   {
      updated.Collection = updated.Collection.map(coll => ({
         ...coll,
         collectionContentOwnerUserId: 
            mapping.get(coll.collectionContentOwnerUserId) || 
            coll.collectionContentOwnerUserId
      }));
   }
   
   return updated;
}

/**
 * Main execution
 */
async function main()
{
   console.log(`Updating foreign keys for ${ENV.toUpperCase()}...\\n`);
   
   const gen2Config = GEN2_CONFIG[ENV];
   const sourceEnv = gen2Config.gen1Source || ENV;
   
   const mappingFile = path.join(__dirname, 'mappings', ENV, 'id-mapping.json');
   const transformedDir = path.join(__dirname, 'transformed', sourceEnv);
   const outputDir = path.join(__dirname, 'import-ready', ENV);
   
   if (!fs.existsSync(mappingFile))
   {
      console.error(`ERROR: Mapping file not found: ${mappingFile}`);
      console.error('Run create-cognito-users.js first');
      process.exit(1);
   }
   
   if (!fs.existsSync(transformedDir))
   {
      console.error(`ERROR: Transformed data not found: ${transformedDir}`);
      console.error('Run transform-data.js first');
      process.exit(1);
   }
   
   const mappingObj = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
   const mapping = new Map(Object.entries(mappingObj));
   
   console.log(`Loaded mapping with ${mapping.size} entries\\n`);
   
   const data = {};
   const tables = ['User', 'Author', 'Box', 'BoxUser', 'Document', 'Collection', 'CollectionItem'];
   
   for (const table of tables)
   {
      const file = path.join(transformedDir, `${table}.json`);
      if (fs.existsSync(file))
      {
         data[table] = JSON.parse(fs.readFileSync(file, 'utf8'));
         console.log(`Loaded ${data[table].length} ${table} records`);
      }
   }
   
   console.log(`\\nValidating mapping completeness...`);
   const validation = validateMapping(data.User, mapping);
   
   if (!validation.valid)
   {
      console.error(`\\nValidation failed - cannot proceed`);
      process.exit(1);
   }
   
   console.log(`✓ Mapping is complete\\n`);
   
   console.log(`Updating foreign keys...`);
   const updated = updateForeignKeys(data, mapping);
   
   if (!fs.existsSync(outputDir))
   { fs.mkdirSync(outputDir, { recursive: true }); }
   
   for (const table of tables)
   {
      if (updated[table])
      {
         const outputFile = path.join(outputDir, `${table}.json`);
         fs.writeFileSync(outputFile, JSON.stringify(updated[table], null, 2));
         console.log(`  ✓ ${table}: ${updated[table].length} records`);
      }
   }
   
   console.log(`\\nForeign keys updated successfully`);
   console.log(`Files saved to: ${outputDir}`);
   console.log(`\\nNext step: node import-dynamodb.js ${ENV}`);
}

if (import.meta.url === `file://${process.argv[1]}`)
{ main(); }
