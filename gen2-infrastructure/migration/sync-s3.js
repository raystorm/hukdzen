#!/usr/bin/env node

/**
 * S3 Sync Script
 * 
 * Syncs S3 files from Gen1 bucket to Gen2 bucket
 * Run AFTER Gen2 deployment
 * 
 * NOTE: Update GEN2_BUCKET_NAME after deploying Gen2
 */

const { execSync } = require('child_process');

const ENV = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node sync-s3.js [dev|prod]');
   process.exit(1);
}

const CONFIG = {
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

function runCommand(cmd)
{
   console.log(`Running: ${cmd}\n`);
   execSync(cmd, { stdio: 'inherit' });
}

function main()
{
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
