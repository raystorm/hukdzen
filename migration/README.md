# Gen1 to Gen2 Migration Scripts

Scripts for migrating Hukdzen from AWS Amplify Gen1 to Gen2.

## Prerequisites

```bash
npm install
```

## Migration Process

### 1. Pre-Migration Cleanup

Reassigns duplicate account ownership to SYSTEM user before export.

```bash
node pre-migration-cleanup.js [dev|prod]
# Or preview changes first:
node pre-migration-cleanup.js [dev|prod] --dry-run
```

**What it does:**
- Creates SYSTEM user if missing
- Reassigns documents and boxes from duplicate accounts to SYSTEM
- BoxUsers are NOT reassigned (they migrate unchanged in export/transform/import)
- Prepares data for clean export

**Dry-run mode:**
- Shows what would be reassigned without making changes
- Displays detailed information (IDs, titles, owner names) for each affected record
- Skips SYSTEM user creation

### 2. Export DynamoDB Data

Exports all Gen1 DynamoDB tables to JSON files.

```bash
node export-dynamodb.js [dev|prod]
```

**Output:** `exports/[env]/[TableName].json`

**Tables exported:**
- User
- Author
- DocumentDetails
- Xbiis (Boxes)
- BoxUser
- Collection
- CollectionItem

**Tables NOT migrated:**
- BoxRequest (operational/transient - users can resubmit after migration)

### 3. Transform Data

Transforms Gen1 schema to Gen2 schema format.

```bash
node transform-data.js [dev|prod]
```

**Output:** `transformed/[env]/[TableName].json`

**Transformations:**
- DocumentDetails → Document (with nested Summary objects)
- Xbiis → Box
- Collection (flat fields → nested Summary objects)
- Foreign key field renames
- Remove createdAt/updatedAt (Gen2 auto-manages)

### 3a. Validate Transformation

Validates Gen1 to Gen2 data transformations.

```bash
node validate-transformation.js [dev|prod]
```

**Run AFTER transform-data.js and BEFORE import-dynamodb.js**

**What it validates:**
- Record counts match (Gen1 export → Gen2 transformed)
- Schema correctness (nested Summary objects, __typename)
- Required fields present (foreign keys, fileKey, etc.)
- Old field names removed (documentDetailsAuthorId → documentAuthorId)
- Foreign key integrity (no orphaned references)

### 4. Deploy Gen2 Infrastructure

Deploy Gen2 Amplify app:

```bash
cd .. # Back to gen2-infrastructure root
npx ampx sandbox # For dev
# OR
npx ampx deploy # For prod
```

**After deployment:**
1. Note the Gen2 table prefix from AWS Console (DynamoDB)
2. Note the Gen2 S3 bucket name from AWS Console (S3)
3. Update `config.js` with Gen2 values (see CONFIG.md for details)

### 5. Import DynamoDB Data

Imports JSON files into Gen2 DynamoDB tables.

```bash
node import-dynamodb.js [sbx|dev|prod]
# Or preview import first:
node import-dynamodb.js [sbx|dev|prod] --dry-run
```

**Before running:**
- Update `config.js` with Gen2 table prefix (see step 4)
- Ensure Gen2 tables are deployed

**Dry-run mode:**
- Shows table names and item counts without importing
- Validates transformed files exist
- Skips BatchWriteCommand execution

### 6. Sync S3 Files

Syncs files from Gen1 to Gen2 S3 bucket.

```bash
node sync-s3.js [sbx|dev|prod]
# Or preview sync first:
node sync-s3.js [sbx|dev|prod] --preview
```

**Before running:**
- Update `config.js` with Gen2 S3 bucket name (see step 4)
- Ensure Gen2 S3 bucket is deployed

**Preview mode:**
- Lists source and destination files without syncing
- Identifies new files, overwrites, and destination-only files
- Displays summary with counts and overwrite details

**Verification:**

The sync-s3.js script outputs verification commands with actual bucket names.
Or manually verify:

```bash
# Dev
aws s3 ls s3://hukdzen-storage-vziz2d2xgbbx7ec2s44ncx73p4-dev/public/ --recursive --region us-west-2 | wc -l
aws s3 ls s3://[gen2-dev-bucket]/public/ --recursive --region us-east-1 | wc -l

# Prod
aws s3 ls s3://hukdzen-storage-p56j3ha5kjhmjn66c4m4eevl4a-prod/public/ --recursive --region us-west-2 | wc -l
aws s3 ls s3://[gen2-prod-bucket]/public/ --recursive --region us-west-2 | wc -l
```

### 7. Validate Migration

Validates that all data was migrated successfully.

```bash
node validate-migration.js [sbx|dev|prod]
```

**Before running:**
- Update `TABLE_PREFIX` in script with Gen2 value

**What it checks:**
- Compares Gen1 export counts with transformed counts
- Compares transformed counts with Gen2 import counts
- Reports any mismatches

## Environment Configuration

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

## Post-Migration Tasks

1. **Test Gen2 Application**
   - Verify user login (OAuth users should work immediately)
   - Check document access and permissions
   - Test file uploads and downloads
   - Verify search functionality

2. **Update DNS** (Prod only)
   - Point domain to Gen2 CloudFront distribution
   - Update Route53 records

3. **Notify Users** (Prod only)
   - Send pre-migration announcement (1 week before) - see USER-COMMUNICATIONS.md
   - Send day-of reminder (morning of migration)
   - Send post-migration announcement with password reset instructions
   - Direct login users need password reset
   - OAuth users unaffected
   - Pending box access requests need to be resubmitted

4. **Monitor Costs**
   - Watch CloudWatch for errors
   - Monitor AWS billing for unexpected charges

5. **Cleanup Gen1** (After verification)
   - Delete Gen1 Amplify app
   - Remove Gen1 CloudFormation stacks
   - Delete Gen1 S3 bucket
   - Remove Gen1 DynamoDB tables

## Rollback Plan

If issues occur:
1. Keep Gen1 running during testing
2. Point DNS back to Gen1 if needed
3. Gen1 data remains unchanged until cleanup

## Notes

- **Dev:** Disposable sandbox - can delete and redeploy clean
- **Prod:** Use maintenance window approach (2-4 hours downtime)
- **Cognito:** Fresh user pool - direct users need password reset
- **OAuth Users:** Unaffected by migration (19 users in prod)
- **Direct Users:** Need password reset (10 users in prod)
