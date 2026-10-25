#!/usr/bin/env node

/**
 * Update Foreign Keys Script (Phase 2)
 * 
 * Updates all User IDs and foreign keys using ID mapping
 * Validates mapping completeness before transformation
 */

import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {GEN2_CONFIG, GEN2_TABLES, SYSTEM_USER, SYSTEM_USER_ID, UNKNOWN_AUTHOR} from './config.js';

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
   // The System User never gets a Cognito account, so it has no mapping by design
   const missingUsers = users.filter(u => SYSTEM_USER_ID !== u.id && !mapping.has(u.id));
   
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
 * Collapse Users that share an id after remapping.
 * Gen1 accounts with the same email map to the same Cognito sub.
 * Keeps the record with the earliest createdAt (records without one lose).
 */
export function dedupeUsers(users)
{
   const byId = new Map();
   
   for (const user of users)
   {
      const existing = byId.get(user.id);
      
      if (!existing) { byId.set(user.id, user); continue; }
      
      // A missing createdAt sorts last, so a dated record always beats an undated one
      const keepNew = (user.createdAt || '\uffff') < (existing.createdAt || '\uffff');
      const kept = keepNew ? user : existing;
      const dropped = keepNew ? existing : user;
      byId.set(user.id, kept);
      console.log(`  Duplicate User ${user.id}: keeping "${kept.name}" ` +
                  `(${kept.createdAt}), dropping "${dropped.name}" (${dropped.createdAt})`);
   }
   
   return [...byId.values()];
}

/**
 * True for a Gen1 author that means "Unknown".
 * Accepts the "Unkown" spelling that existed in Gen1 data.
 */
export function isUnknownAuthor(author)
{
   const name = (author.name || '').trim().toLowerCase();
   return 'unknown' === name || 'unkown' === name;
}

/**
 * Merge every Gen1 "Unknown" author into the canonical Unknown Author.
 * The merged record gets the forced Gen2 id (the one the seedLoader creates),
 * so importing it overwrites the seeded record instead of adding a second one.
 * Keeps the earliest createdAt (records without one lose).
 * 
 * @returns {{authors: Array, replacedIds: Set<string>}} replacedIds are the
 *          Gen1 ids that documents must be re-pointed away from.
 */
export function mergeUnknownAuthors(authors)
{
   const unknowns = authors.filter(isUnknownAuthor);
   
   if (0 === unknowns.length)
   { return { authors, replacedIds: new Set() }; }
   
   const earliest = unknowns.reduce((a, b) =>
      (b.createdAt || '\uffff') < (a.createdAt || '\uffff') ? b : a);
   
   const merged = { 
      ...earliest, 
      id:   UNKNOWN_AUTHOR.id, 
      name: UNKNOWN_AUTHOR.name, 
      waa:  UNKNOWN_AUTHOR.waa 
   };
   
   unknowns.forEach(a => {
      console.log(`  Merging Author "${a.name}" (${a.id}) into Unknown Author ${UNKNOWN_AUTHOR.id}`);
   });
   
   // Replace the first Unknown in place so the order of the other authors is kept
   const firstIndex = authors.findIndex(isUnknownAuthor);
   const result = [];
   authors.forEach((author, i) => {
      if (i === firstIndex) { result.push(merged); }
      else if (!isUnknownAuthor(author)) { result.push(author); }
   });
   
   const replacedIds = new Set(unknowns.map(a => a.id));
   replacedIds.delete(UNKNOWN_AUTHOR.id);
   
   return { authors: result, replacedIds };
}

/**
 * Update all foreign keys using mapping
 * 
 * The System User keeps its fixed id: any mapping entry for it is ignored.
 * 
 * Ownership policy: an owner with no Gen2 account cannot be mapped, so the record
 * goes to the System User, which owns nothing real. An admin can reassign it later.
 * Accounts that share an email map to the same Gen2 account, so their records keep an owner.
 */
export function updateForeignKeys(data, idMapping)
{
   const updated = { ...data };
   
   const mapping = new Map(idMapping);
   mapping.delete(SYSTEM_USER_ID);
   
   /** The Gen2 owner for a Gen1 owner id, or the System User when it can't be mapped. */
   const mapOwner = (ownerId, table, recordId) =>
   {
      const mapped = mapping.get(ownerId);
      if (mapped) { return mapped; }
      
      if (SYSTEM_USER_ID !== ownerId)
      { console.warn(`  ${table} ${recordId}: owner ${ownerId} has no Gen2 account, assigning to System`); }
      
      return SYSTEM_USER_ID;
   };
   
   // Author table: merge Gen1 Unknown authors into the canonical one
   let replacedAuthorIds = new Set();
   if (updated.Author)
   {
      const merge = mergeUnknownAuthors(updated.Author);
      updated.Author = merge.authors;
      replacedAuthorIds = merge.replacedIds;
   }
   
   // User table
   if (updated.User)
   {
      updated.User = dedupeUsers(updated.User.map(user => ({
         ...user,
         id: mapping.get(user.id) || user.id,
         // The Gen1 System User becomes the canonical one the seedLoader creates
         ...(SYSTEM_USER_ID === user.id && {
            name:    SYSTEM_USER.name,
            email:   SYSTEM_USER.email,
            isAdmin: SYSTEM_USER.isAdmin
         })
      })));
   }
   
   // Document table
   if (updated.Document)
   {
      updated.Document = updated.Document.map(doc => ({
         ...doc,
         documentContentOwnerUserId: 
            mapOwner(doc.documentContentOwnerUserId, 'Document', doc.id),
         ...(doc.documentContentOwnerId && {
            documentContentOwnerId:
               mapOwner(doc.documentContentOwnerId, 'Document', doc.id)
         }),
         ...(replacedAuthorIds.has(doc.documentAuthorId) && 
            { documentAuthorId: UNKNOWN_AUTHOR.id })
      }));
   }
   
   // Box table
   if (updated.Box)
   {
      updated.Box = updated.Box.map(box => ({
         ...box,
         ownerUserId: mapOwner(box.ownerUserId, 'Box', box.id),
         ...(box.boxOwnerId && {
            boxOwnerId: mapOwner(box.boxOwnerId, 'Box', box.id)
         })
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
            mapOwner(coll.collectionContentOwnerUserId, 'Collection', coll.id),
         ...(coll.collectionContentOwnerId && {
            collectionContentOwnerId:
               mapOwner(coll.collectionContentOwnerId, 'Collection', coll.id)
         })
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
   const tables = GEN2_TABLES;
   
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
