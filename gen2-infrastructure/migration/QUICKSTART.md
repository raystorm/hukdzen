# Quick Start - Data Migration

Fast track guide to migrate data from Gen1 to Gen2.

## Prerequisites (5 minutes)

```bash
cd gen2-infrastructure/migration
npm install
```

Verify AWS credentials:
```bash
aws sts get-caller-identity
```

## Dev Migration (30-60 minutes)

### Step 1: Export & Transform
```bash
npm run cleanup dev    # Clean up duplicate accounts
npm run export dev     # Export Gen1 data
npm run transform dev  # Transform to Gen2 schema
```

Verify:
```bash
ls -lh exports/dev/
ls -lh transformed/dev/
```

### Step 2: Deploy Gen2
```bash
cd ../..  # Back to project root
npx ampx sandbox --profile dev
```

Get table prefix and bucket name:
```bash
# Find table prefix
aws dynamodb list-tables --region us-east-1 | grep "Document-"
# Example: Document-abc123xyz-dev → prefix is "abc123xyz"

# Find bucket name
aws s3 ls | grep amplify
```

### Step 3: Import & Sync
```bash
cd gen2-infrastructure/migration

# Update import-dynamodb.js with table prefix
# Update sync-s3.js with bucket name

npm run import dev     # Import data to Gen2
npm run sync-s3 dev    # Sync S3 files
```

### Step 4: Validate
```bash
# Update validate-migration.js with table prefix
npm run validate dev
```

Expected output:
```
✅ VALIDATION PASSED - All tables migrated successfully
```

### Step 5: Test
- Login to Gen2 app
- Check documents load
- Test file upload/download
- Verify search works

## Prod Migration (2-4 hours)

### Before You Start
- [ ] Schedule maintenance window
- [ ] Send user notification (1 week before)
- [ ] Test migration on dev first
- [ ] Review rollback plan

### Execute Migration
```bash
cd gen2-infrastructure/migration

# Step 1: Export & Transform
npm run cleanup prod
npm run export prod
npm run transform prod

# Step 2: Deploy Gen2
cd ../..
npx ampx deploy --profile prod

# Step 3: Update scripts with Gen2 values
# - import-dynamodb.js (table prefix)
# - sync-s3.js (bucket name)
# - validate-migration.js (table prefix)

# Step 4: Import & Sync
cd gen2-infrastructure/migration
npm run import prod
npm run sync-s3 prod

# Step 5: Validate
npm run validate prod
```

### After Migration
- [ ] Update DNS to Gen2
- [ ] Test application
- [ ] Send post-migration notification
- [ ] Monitor for 24-48 hours
- [ ] Keep Gen1 running for 1 week

## Troubleshooting

### "Table not found" error
```bash
# Verify table prefix
aws dynamodb list-tables --region us-east-1

# Update script with correct prefix
```

### "Bucket not found" error
```bash
# Verify bucket name
aws s3 ls | grep amplify

# Update script with correct bucket name
```

### Validation fails
```bash
# Check CloudWatch logs
aws logs tail /aws/lambda/YOUR_FUNCTION --follow

# Compare counts manually
cat exports/dev/User.json | jq '. | length'
aws dynamodb scan --table-name User-PREFIX-dev --select COUNT
```

## Quick Commands

```bash
# Check export counts
cat exports/dev/User.json | jq '. | length'
cat exports/dev/Document.json | jq '. | length'

# Check Gen2 counts
aws dynamodb scan --table-name User-PREFIX-dev --select COUNT --region us-east-1
aws dynamodb scan --table-name Document-PREFIX-dev --select COUNT --region us-east-1

# Check S3 file counts
aws s3 ls s3://GEN1_BUCKET/public/ --recursive | wc -l
aws s3 ls s3://GEN2_BUCKET/public/ --recursive | wc -l
```

## Need More Details?

- **Comprehensive Guide:** See `MIGRATION_GUIDE.md`
- **Step-by-step Checklist:** See `CHECKLIST.md`
- **Implementation Details:** See `SUMMARY.md`
- **Overview:** See `README.md`

## Support

If you encounter issues:
1. Check CloudWatch logs
2. Review troubleshooting section in MIGRATION_GUIDE.md
3. Verify AWS credentials and permissions
4. Check script configuration (table prefix, bucket name)

## Rollback

If something goes wrong:
1. Keep Gen1 running (don't delete anything)
2. Point DNS back to Gen1 (prod only)
3. Investigate and fix issues
4. Retry migration

Gen1 data remains unchanged until you explicitly delete it.
