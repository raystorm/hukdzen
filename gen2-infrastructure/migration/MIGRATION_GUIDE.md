# Data Migration Execution Guide

Complete step-by-step guide for migrating data from Gen1 to Gen2.

## Prerequisites

1. **Install dependencies:**
   ```bash
   cd gen2-infrastructure/migration
   npm install
   ```

2. **AWS Credentials:**
   - Ensure AWS CLI is configured with appropriate credentials
   - Verify access to both Gen1 and Gen2 environments

3. **Backup:**
   - Take snapshots of Gen1 DynamoDB tables (optional but recommended)
   - Document current Gen1 bucket names and table prefixes

## Migration Steps

### Step 1: Pre-Migration Cleanup (Gen1)

Clean up duplicate accounts and reassign ownership to SYSTEM user.

```bash
# For dev environment
npm run cleanup dev

# For prod environment
npm run cleanup prod
```

**What it does:**
- Creates SYSTEM user if missing
- Reassigns documents, boxes, and box users from duplicate accounts to SYSTEM
- Prepares data for clean export

**Verification:**
- Check CloudWatch logs for any errors
- Verify SYSTEM user exists in Gen1 User table

### Step 2: Export Gen1 Data

Export all DynamoDB tables from Gen1 to JSON files.

```bash
# For dev environment
npm run export dev

# For prod environment
npm run export prod
```

**Output:** `exports/[env]/[TableName].json`

**Tables exported:**
- User
- Author
- DocumentDetails
- Xbiis
- BoxUser
- Collection
- CollectionItem

**Verification:**
```bash
# Check exported files
ls -lh exports/dev/
# or
ls -lh exports/prod/

# Verify item counts
cat exports/dev/User.json | jq '. | length'
cat exports/dev/DocumentDetails.json | jq '. | length'
```

### Step 3: Transform Data

Transform Gen1 schema to Gen2 schema format.

```bash
# For dev environment
npm run transform dev

# For prod environment
npm run transform prod
```

**Output:** `transformed/[env]/[TableName].json`

**Transformations:**
- `DocumentDetails` → `Document` (with nested Summary objects)
- `Xbiis` → `Box`
- `Collection` (flat fields → nested Summary objects)
- Foreign key field renames
- Remove `createdAt`/`updatedAt` (Gen2 auto-manages)

**Verification:**
```bash
# Check transformed files
ls -lh transformed/dev/
# or
ls -lh transformed/prod/

# Verify structure of transformed data
cat transformed/dev/Document.json | jq '.[0]'
cat transformed/dev/Box.json | jq '.[0]'
```

### Step 4: Deploy Gen2 Infrastructure

Deploy Gen2 Amplify app to target environment.

```bash
cd ../.. # Back to project root

# For dev environment (sandbox)
npx ampx sandbox --profile dev

# For prod environment
npx ampx deploy --profile prod
```

**After deployment:**
1. Note the Gen2 table prefix from AWS Console (DynamoDB)
2. Note the Gen2 S3 bucket name from AWS Console (S3)

**Find table prefix:**
```bash
# List DynamoDB tables
aws dynamodb list-tables --region us-east-1 | grep "Document-"
# Example output: Document-abc123xyz-dev
# Table prefix is: abc123xyz
```

**Find S3 bucket:**
```bash
# List S3 buckets
aws s3 ls | grep amplify
# Example output: amplify-hukdzen-dev-abc123xyz
```

### Step 5: Update Import Script

Update the import script with Gen2 table prefix.

```bash
cd gen2-infrastructure/migration
```

Edit `import-dynamodb.js`:
```javascript
const CONFIG = {
   dev: {
      region: 'us-east-1',
      tablePrefix: 'YOUR_GEN2_DEV_PREFIX' // Update this
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'YOUR_GEN2_PROD_PREFIX' // Update this
   }
};
```

### Step 6: Import Data to Gen2

Import transformed data into Gen2 DynamoDB tables.

```bash
# For dev environment
npm run import dev

# For prod environment
npm run import prod
```

**Verification:**
```bash
# Check item counts in Gen2 tables
aws dynamodb scan --table-name User-YOUR_PREFIX-dev --select COUNT --region us-east-1
aws dynamodb scan --table-name Document-YOUR_PREFIX-dev --select COUNT --region us-east-1
aws dynamodb scan --table-name Box-YOUR_PREFIX-dev --select COUNT --region us-east-1
```

### Step 7: Update S3 Sync Script

Update the S3 sync script with Gen2 bucket name.

Edit `sync-s3.js`:
```javascript
const CONFIG = {
   dev: {
      region: 'us-west-2',
      gen1Bucket: 'hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev',
      gen2Bucket: 'YOUR_GEN2_DEV_BUCKET', // Update this
      gen2Region: 'us-east-1'
   },
   prod: {
      region: 'us-west-2',
      gen1Bucket: 'hukdzen-storage-p56j3ha5kjhmjn66c4m4eevl4a-prod',
      gen2Bucket: 'YOUR_GEN2_PROD_BUCKET', // Update this
      gen2Region: 'us-west-2'
   }
};
```

### Step 8: Sync S3 Files

Sync files from Gen1 to Gen2 S3 bucket.

```bash
# For dev environment
npm run sync-s3 dev

# For prod environment
npm run sync-s3 prod
```

**Verification:**
```bash
# Compare file counts
aws s3 ls s3://GEN1_BUCKET/public/ --recursive --region us-west-2 | wc -l
aws s3 ls s3://GEN2_BUCKET/public/ --recursive --region us-east-1 | wc -l
```

## Post-Migration Verification

### 1. Test Gen2 Application

- [ ] Verify user login (OAuth users)
- [ ] Check document access and permissions
- [ ] Test file uploads and downloads
- [ ] Verify search functionality
- [ ] Test box access and permissions
- [ ] Verify collections display correctly

### 2. Data Integrity Checks

```bash
# Compare record counts
echo "Gen1 Users:"
cat exports/dev/User.json | jq '. | length'
echo "Gen2 Users:"
aws dynamodb scan --table-name User-YOUR_PREFIX-dev --select COUNT --region us-east-1

echo "Gen1 Documents:"
cat exports/dev/DocumentDetails.json | jq '. | length'
echo "Gen2 Documents:"
aws dynamodb scan --table-name Document-YOUR_PREFIX-dev --select COUNT --region us-east-1

echo "Gen1 Boxes:"
cat exports/dev/Xbiis.json | jq '. | length'
echo "Gen2 Boxes:"
aws dynamodb scan --table-name Box-YOUR_PREFIX-dev --select COUNT --region us-east-1
```

### 3. Spot Check Data

```bash
# Check a specific user
aws dynamodb get-item \
  --table-name User-YOUR_PREFIX-dev \
  --key '{"id": {"S": "USER_ID_HERE"}}' \
  --region us-east-1

# Check a specific document
aws dynamodb get-item \
  --table-name Document-YOUR_PREFIX-dev \
  --key '{"id": {"S": "DOCUMENT_ID_HERE"}}' \
  --region us-east-1
```

## Rollback Plan

If issues occur:

1. **Keep Gen1 running** during testing
2. **Point DNS back to Gen1** if needed (prod only)
3. **Gen1 data remains unchanged** until cleanup
4. **Delete Gen2 stack** and redeploy if needed

## Production-Specific Steps

### Before Migration

1. **Schedule maintenance window** (2-4 hours)
2. **Send user notification** (see USER-COMMUNICATIONS.md)
3. **Set Gen1 to read-only mode** (optional)

### During Migration

1. **Monitor CloudWatch** for errors
2. **Track progress** of each step
3. **Document any issues** encountered

### After Migration

1. **Update DNS** to point to Gen2
2. **Send post-migration notification** to users
3. **Monitor for 24-48 hours**
4. **Keep Gen1 running** for 1 week as backup

### Cleanup (After 1 week)

1. Delete Gen1 Amplify app
2. Remove Gen1 CloudFormation stacks
3. Delete Gen1 S3 bucket
4. Remove Gen1 DynamoDB tables

## Troubleshooting

### Export fails with "Table not found"

- Verify table prefix in `export-dynamodb.js`
- Check AWS region is correct
- Verify AWS credentials have DynamoDB read access

### Transform fails with "Cannot read property"

- Check exported JSON files are valid
- Verify all required fields exist in Gen1 data
- Review transformation logic for missing null checks

### Import fails with "Table not found"

- Verify Gen2 tables are deployed
- Check table prefix in `import-dynamodb.js`
- Verify AWS region is correct

### S3 sync fails

- Verify source and destination bucket names
- Check AWS credentials have S3 read/write access
- Ensure sufficient S3 storage quota

### Data missing after import

- Check CloudWatch logs for import errors
- Verify transformation didn't filter out records
- Check DynamoDB item counts match export counts

## Environment Configuration Reference

### Dev
- **Gen1 Region:** us-west-2
- **Gen2 Region:** us-east-1
- **Gen1 Table Prefix:** vziz2d2xgbbx7ec2s44ncx73p4
- **Gen1 S3 Bucket:** hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev

### Prod
- **Gen1 Region:** us-west-2
- **Gen2 Region:** us-west-2
- **Gen1 Table Prefix:** p56j3ha5kjhmjn66c4m4eevl4a
- **Gen1 S3 Bucket:** hukdzen-storage-p56j3ha5kjhmjn66c4m4eevl4a-prod

## Notes

- **Dev:** Disposable sandbox - can delete and redeploy clean
- **Prod:** Use maintenance window approach (2-4 hours downtime)
- **Cognito:** Fresh user pool - direct users need password reset
- **OAuth Users:** Unaffected by migration (19 users in prod)
- **Direct Users:** Need password reset (10 users in prod)
- **BoxRequest:** Not migrated (operational/transient - users can resubmit)
