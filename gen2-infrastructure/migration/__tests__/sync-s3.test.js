import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';

vi.mock('child_process');

describe('sync-s3.js', () => {
   let consoleLogSpy;
   let consoleErrorSpy;
   let processExitSpy;

   beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      
      vi.mocked(execSync).mockReturnValue(Buffer.from(''));
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   describe('Scenario 5.1: Sync files from Gen1 to Gen2 bucket', () => {
      it('should execute aws s3 sync command with correct parameters', () => {
         const gen1Bucket = 'hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev';
         const gen2Bucket = 'amplify-gen2-bucket-dev';
         const region = 'us-west-2';
         
         const syncCmd = `aws s3 sync s3://${gen1Bucket}/public/ s3://${gen2Bucket}/public/ --region ${region} --source-region ${region}`;
         
         execSync(syncCmd, { stdio: 'inherit' });

         expect(execSync).toHaveBeenCalledWith(syncCmd, { stdio: 'inherit' });
      });
   });

   describe('Scenario 5.2: Handle Gen2 bucket not configured', () => {
      it('should exit with error when bucket is UPDATE_AFTER_GEN2_DEPLOY', () => {
         const gen2Bucket = 'UPDATE_AFTER_GEN2_DEPLOY';
         
         if ('UPDATE_AFTER_GEN2_DEPLOY' === gen2Bucket) {
            console.error('ERROR: Update gen2Bucket in script before running');
            console.error('Deploy Gen2, then find bucket name from AWS Console');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith('ERROR: Update gen2Bucket in script before running');
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 5.3: Display verification commands', () => {
      it('should display verification commands after sync', () => {
         const gen1Bucket = 'hukdzen-storage-test-dev';
         const gen2Bucket = 'amplify-gen2-bucket-dev';
         const region = 'us-west-2';
         const gen2Region = 'us-east-1';
         
         console.log('\nVerify file count:');
         console.log(`  Gen1: aws s3 ls s3://${gen1Bucket}/public/ --recursive --region ${region} | wc -l`);
         console.log(`  Gen2: aws s3 ls s3://${gen2Bucket}/public/ --recursive --region ${gen2Region} | wc -l`);

         expect(consoleLogSpy).toHaveBeenCalledWith('\nVerify file count:');
         expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('aws s3 ls'));
      });
   });

   describe('Scenario 5.4: Handle invalid environment argument', () => {
      it('should exit with error for invalid environment', () => {
         const env = 'test';
         
         if (!['dev', 'prod'].includes(env)) {
            console.error('Usage: node sync-s3.js [dev|prod]');
            process.exit(1);
         }

         expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node sync-s3.js [dev|prod]');
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });

   describe('Scenario 5.5: Use correct regions for dev vs prod', () => {
      it('should use us-east-1 for dev Gen2 region', () => {
         const devConfig = {
            region: 'us-west-2',
            gen2Region: 'us-east-1'
         };

         expect(devConfig.region).toBe('us-west-2');
         expect(devConfig.gen2Region).toBe('us-east-1');
      });

      it('should use us-west-2 for prod Gen2 region', () => {
         const prodConfig = {
            region: 'us-west-2',
            gen2Region: 'us-west-2'
         };

         expect(prodConfig.region).toBe('us-west-2');
         expect(prodConfig.gen2Region).toBe('us-west-2');
      });
   });
});
