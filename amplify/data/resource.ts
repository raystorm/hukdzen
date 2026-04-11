import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type ClientSchema, a,
         defineData, defineFunction } from '@aws-amplify/backend';


//get the amplify/data folder
const dataDir = dirname(fileURLToPath(import.meta.url));

/**
 *  Walk amplify/data directory tree to find all .graphql files.
 *  This enables us to use organize based on domain,
 *  and still supply a unified file for amplify.
 *
 *  @param dir - The directory to walk (/amplify/data)
 *  @returns string[] - An array of file paths to .graphql files
 */
function collectGraphqlFiles(dir: string): string[]
{
   const entries = readdirSync(dir, { withFileTypes: true });

   return entries.flatMap(entry =>
   {
      const fullPath = join(dir, entry.name);

      //recurse into sub dirs and look for graphql files
      if (entry.isDirectory()) { return collectGraphqlFiles(fullPath); }

      //return the full path to the file
      if (entry.isFile() && entry.name.endsWith('.graphql'))
      { return [fullPath]; }

      return [];
   });
}

const schemaFiles = collectGraphqlFiles(dataDir).sort();

//combine all graphql files into one schema file
const schemaFile = schemaFiles.map(file => readFileSync(file, 'utf8')).join('\n\n');

export const data = defineData({
   schema: schemaFile,
   authorizationModes: {
      defaultAuthorizationMode: 'userPool',
   },
});