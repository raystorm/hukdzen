# Migration Checklist

Quick reference checklist for Gen1 to Gen2 data migration.

## Pre-Migration

- [ ] Install dependencies: `npm install`
- [ ] Verify AWS credentials configured
- [ ] Document Gen1 table prefixes and bucket names
- [ ] (Optional) Take DynamoDB table snapshots

## Dev Environment Migration

### Preparation
- [ ] Run pre-migration cleanup: `npm run cleanup dev`
- [ ] Verify SYSTEM user created in Gen1

### Export & Transform
- [ ] Export Gen1 data: `npm run export dev`
- [ ] Verify exports in `exports/dev/` directory
- [ ] Transform data: `npm run transform dev`
- [ ] Verify transformed data in `transformed/dev/` directory

### Deploy & Import
- [ ] Deploy Gen2: `npx ampx sandbox --profile dev`
- [ ] Note Gen2 table prefix from AWS Console
- [ ] Note Gen2 S3 bucket name from AWS Console
- [ ] Update `import-dynamodb.js` with table prefix
- [ ] Import data: `npm run import dev`
- [ ] Verify import counts match export counts

### S3 & Validation
- [ ] Update `sync-s3.js` with Gen2 bucket name
- [ ] Sync S3 files: `npm run sync-s3 dev`
- [ ] Verify S3 file counts match
- [ ] Update `validate-migration.js` with table prefix
- [ ] Run validation: `npm run validate dev`
- [ ] All validation checks pass ✅

### Testing
- [ ] Test user login (OAuth)
- [ ] Test document access
- [ ] Test file upload/download
- [ ] Test search functionality
- [ ] Test box permissions
- [ ] Test collections

## Prod Environment Migration

### Pre-Migration Communication
- [ ] Schedule maintenance window (2-4 hours)
- [ ] Send pre-migration notification (1 week before)
- [ ] Send day-of reminder (morning of migration)

### Preparation
- [ ] Run pre-migration cleanup: `npm run cleanup prod`
- [ ] Verify SYSTEM user created in Gen1
- [ ] (Optional) Set Gen1 to read-only mode

### Export & Transform
- [ ] Export Gen1 data: `npm run export prod`
- [ ] Verify exports in `exports/prod/` directory
- [ ] Transform data: `npm run transform prod`
- [ ] Verify transformed data in `transformed/prod/` directory

### Deploy & Import
- [ ] Deploy Gen2: `npx ampx deploy --profile prod`
- [ ] Note Gen2 table prefix from AWS Console
- [ ] Note Gen2 S3 bucket name from AWS Console
- [ ] Update `import-dynamodb.js` with table prefix
- [ ] Import data: `npm run import prod`
- [ ] Verify import counts match export counts

### S3 & Validation
- [ ] Update `sync-s3.js` with Gen2 bucket name
- [ ] Sync S3 files: `npm run sync-s3 prod`
- [ ] Verify S3 file counts match
- [ ] Update `validate-migration.js` with table prefix
- [ ] Run validation: `npm run validate prod`
- [ ] All validation checks pass ✅

### Testing
- [ ] Test user login (OAuth)
- [ ] Test document access
- [ ] Test file upload/download
- [ ] Test search functionality
- [ ] Test box permissions
- [ ] Test collections
- [ ] Spot check specific users/documents

### Cutover
- [ ] Update DNS to point to Gen2
- [ ] Monitor CloudWatch for errors
- [ ] Send post-migration notification
- [ ] Inform users about password reset (direct login users)

### Post-Migration Monitoring
- [ ] Monitor for 24-48 hours
- [ ] Check CloudWatch logs for errors
- [ ] Monitor AWS billing
- [ ] Keep Gen1 running for 1 week as backup

## Cleanup (After 1 week)

- [ ] Verify Gen2 is stable
- [ ] Delete Gen1 Amplify app
- [ ] Remove Gen1 CloudFormation stacks
- [ ] Delete Gen1 S3 bucket
- [ ] Remove Gen1 DynamoDB tables

## Rollback Plan (If Needed)

- [ ] Point DNS back to Gen1
- [ ] Notify users of rollback
- [ ] Investigate issues
- [ ] Fix and retry migration

## Quick Commands Reference

```bash
# Install dependencies
cd gen2-infrastructure/migration
npm install

# Dev migration
npm run cleanup dev
npm run export dev
npm run transform dev
npm run import dev
npm run sync-s3 dev
npm run validate dev

# Prod migration
npm run cleanup prod
npm run export prod
npm run transform prod
npm run import prod
npm run sync-s3 prod
npm run validate prod

# Verification
ls -lh exports/dev/
ls -lh transformed/dev/
cat exports/dev/User.json | jq '. | length'
aws dynamodb scan --table-name User-PREFIX-dev --select COUNT --region us-east-1
```

## Environment Details

### Dev
- Gen1 Region: us-west-2
- Gen2 Region: us-east-1
- Gen1 Prefix: vziz2d2xgbbx7ec2s44ncx73p4
- Gen1 Bucket: hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev

### Prod
- Gen1 Region: us-west-2
- Gen2 Region: us-west-2
- Gen1 Prefix: p56j3ha5kjhmjn66c4m4eevl4a
- Gen1 Bucket: hukdzen-storage-p56j3ha5kjhmjn66c4m4eevl4a-prod

## Notes

- BoxRequest table is NOT migrated (users can resubmit)
- OAuth users unaffected (19 in prod)
- Direct login users need password reset (10 in prod)
- Dev is disposable - can delete and redeploy
- Prod requires maintenance window
