#!/usr/bin/env node

/**
 * S3 Sync Script
 * 
 * Syncs S3 files from Gen1 bucket to Gen2 bucket
 * Run AFTER Gen2 deployment
 * 
 * NOTE: Update GEN2_BUCKET_NAME after deploying Gen2
 */

import { execSync } from 'child_process';

const ENV = process.argv[2] || 'dev';
const PREVIEW = process.argv.includes('--preview');

if (!['sbx', 'dev', 'prod'].includes(ENV))
{
   console.error('Usage: node sync-s3.js [sbx|dev|prod] [--preview]');
   process.exit(1);
}

const CONFIG = {
   sbx: {
      region: 'us-west-2',
      gen1Bucket: 'hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev',
      gen2Bucket: 'UPDATE_AFTER_GEN2_DEPLOY', // TODO: Update after Gen2 deployment
      gen2Region: 'us-east-1'
   },
   dev: {
      region: 'us-west-2',
      gen1Bucket: 'hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev',
      gen2Bucket: 'UPDATE_AFTER_GEN2_DEPLOY', // TODO: Update after Gen2 deployment
      gen2Region: 'us-east-1'
   },
   prod: {
      region: 'us-west-2',
      gen1Bucket: 'hukdzen-storage-p56j3ha5kjhmjn66c4m4eevl4a-prod',
      gen2Bucket: 'UPDATE_AFTER_GEN2_DEPLOY', // TODO: Update after Gen2 deployment
      gen2Region: 'us-west-2'
   }
};

const { gen1Bucket, gen2Bucket, region, gen2Region } = CONFIG[ENV];

if ('UPDATE_AFTER_GEN2_DEPLOY' === gen2Bucket)
{
   console.error('ERROR: Update gen2Bucket in script before running');
   console.error('Deploy Gen2, then find bucket name from AWS Console');
   process.exit(1);
}

function parseS3Listing(output)
{
   const lines = output.toString().trim().split('\n').filter(line => 0 < line.length);
   return lines.map(line => {
      const parts = line.trim().split(/\s+/);
      return {
         date: parts[0],
         time: parts[1],
         size: parseInt(parts[2]),
         path: parts.slice(3).join(' ')
      };
   });
}

function previewSync()
{
   console.log('=== PREVIEW MODE ===');
   console.log('Analyzing files without syncing\n');
   
   console.log(`Source: s3://${gen1Bucket}/public/ (${region})`);
   console.log(`Destination: s3://${gen2Bucket}/public/ (${gen2Region})\n`);
   
   // List source files
   console.log('Listing source files...');
   const sourceLsCmd = `aws s3 ls s3://${gen1Bucket}/public/ --recursive --region ${region}`;
   const sourceOutput = execSync(sourceLsCmd);
   const sourceFiles = parseS3Listing(sourceOutput);
   
   // List destination files
   console.log('Listing destination files...');
   const destLsCmd = `aws s3 ls s3://${gen2Bucket}/public/ --recursive --region ${gen2Region}`;
   let destFiles = [];
   try
   {
      const destOutput = execSync(destLsCmd);
      destFiles = parseS3Listing(destOutput);
   }
   catch (error) { console.log('Destination bucket is empty or does not exist\n'); }
   
   // Analyze differences
   const destPaths = new Set(destFiles.map(f => f.path));
   const sourcePaths = new Set(sourceFiles.map(f => f.path));
   
   const newFiles = sourceFiles.filter(f => !destPaths.has(f.path));
   const overwrites = sourceFiles.filter(f => destPaths.has(f.path));
   const destOnly = destFiles.filter(f => !sourcePaths.has(f.path));
   
   console.log('\n=== Preview Summary ===');
   console.log(`Source files: ${sourceFiles.length}`);
   console.log(`Destination files: ${destFiles.length}`);
   console.log('\nWould sync:');
   console.log(`  New files: ${newFiles.length}`);
   console.log(`  Would overwrite: ${overwrites.length}`);
   console.log(`\nDestination only (not in source): ${destOnly.length}`);
   
   if (0 < overwrites.length && 10 >= overwrites.length)
   {
      console.log('\nFiles that would be overwritten:');
      overwrites.forEach(f => {
         const destFile = destFiles.find(d => d.path === f.path);
         console.log(`  ${f.path}`);
         console.log(`    Source: ${f.date} ${f.time}`);
         console.log(`    Dest:   ${destFile.date} ${destFile.time}`);
      });
   }
   else if (10 < overwrites.length)
   { console.log(`\n${overwrites.length} files would be overwritten (too many to list)`); }
   
   console.log('\n=== PREVIEW COMPLETE ===');
   console.log('No files synced');
}

function runCommand(cmd)
{
   console.log(`Running: ${cmd}\n`);
   execSync(cmd, { stdio: 'inherit' });
}

function main()
{
   if (PREVIEW)
   {
      previewSync();
      return;
   }
   
   console.log(`Syncing S3 files for ${ENV.toUpperCase()}...\n`);
   console.log(`Source: s3://${gen1Bucket}/public/ (${region})`);
   console.log(`Destination: s3://${gen2Bucket}/public/ (${gen2Region})\n`);
   
   // Sync public files
   const syncCmd = `aws s3 sync s3://${gen1Bucket}/public/ s3://${gen2Bucket}/public/ --region ${region} --source-region ${region}`;
   
   runCommand(syncCmd);
   
   console.log('\nS3 sync complete!');
   console.log('\nVerify file count:');
   console.log(`  Gen1: aws s3 ls s3://${gen1Bucket}/public/ --recursive --region ${region} | wc -l`);
   console.log(`  Gen2: aws s3 ls s3://${gen2Bucket}/public/ --recursive --region ${gen2Region} | wc -l`);
}

main();
