# Gen1 to Gen2 User Migration Guide

## Overview

This migration creates all Gen1 users in Gen2 Cognito User Pool and updates all foreign keys to use Cognito `sub` values. This ensures proper AppSync owner authorization and consistent user identification across authentication methods.

## Prerequisites

### 1. Story 1 Deployed

Ensure Story 1 (authentication flow using Cognito sub) is deployed to the target environment before running migration. This ensures new users created after migration will have correct IDs automatically.

### 2. AWS Credentials Configured

```bash
aws configure
# Or use AWS_PROFILE environment variable
export AWS_PROFILE=your-profile-name
```

Required permissions:
- Cognito: `AdminCreateUser`, `AdminLinkProviderForUser`, `AdminGetUser`, `AdminAddUserToGroup`, `CreateGroup`
- DynamoDB: `Scan`, `BatchWriteItem`

### 3. Dependencies Installed

```bash
cd migration
npm install
```

### 4. Configuration Updated

Update `migration/config.js` with correct values:

**For sandbox (sbx):**
```javascript
COGNITO_CONFIG.sbx.userPoolId = 'us-east-1_XXXXXXXXX'; // Get from Amplify console
```

**For dev/prod:**
```javascript
COGNITO_CONFIG.dev.userPoolId = 'UPDATE_AFTER_GEN2_DEPLOY';
COGNITO_CONFIG.prod.userPoolId = 'UPDATE_AFTER_GEN2_DEPLOY';

GEN2_CONFIG.dev.tablePrefix = 'UPDATE_AFTER_GEN2_DEPLOY';
GEN2_CONFIG.prod.tablePrefix = 'UPDATE_AFTER_GEN2_DEPLOY';
```

## Migration Phases

### Phase 0: Export and Transform (Existing Scripts)

```bash
# Export Gen1 data
node export-dynamodb.js [dev|prod]

# Transform to Gen2 schema
node transform-data.js [dev|prod]
```

### Phase 1: Create Cognito Users

Creates all Gen1 users in Gen2 Cognito User Pool.

```bash
node create-cognito-users.js [sbx|dev|prod]
```

**What it does:**
- Creates native Cognito users with temporary passwords
- Creates OAuth users and links to providers (Google, Facebook, Amazon)
- Handles seed user conflicts (reuses existing Cognito users)
- Builds ID mapping: Gen1 ID → Gen2 Cognito sub
- Saves mapping to `mappings/[env]/id-mapping.json`
- Logs failures to `mappings/[env]/failures.json`

**Expected output:**
```
Created: 150 users
Failed: 2 users

Failed users:
  - invalid@email (gen1-id-123): InvalidParameterException
```

**Seed User Conflicts:**

If Gen1 data includes emails that match seed users (e.g., `admin@example.com`), the script will:
- Detect `UsernameExistsException`
- Query existing Cognito user for `sub`
- Use existing `sub` in mapping
- Gen1 data will overwrite seed data in DynamoDB (Phase 3)
- Seed user credentials (password, groups) are preserved

### Phase 2: Update Foreign Keys

Updates all User IDs and foreign keys using the ID mapping.

```bash
node update-foreign-keys.js [sbx|dev|prod]
```

**What it does:**
- Validates mapping completeness (all users have mappings)
- Updates `User.id` to Gen2 Cognito sub
- Updates `Document.documentContentOwnerUserId`
- Updates `Box.ownerUserId`
- Updates `BoxUser.userUserId` and `BoxUser.boxUserUserId`
- Updates `Collection.collectionContentOwnerUserId`
- Saves updated data to `import-ready/[env]/`

**Expected output:**
```
✓ Mapping is complete

Updating foreign keys...
  ✓ User: 150 records
  ✓ Document: 500 records
  ✓ Box: 20 records
  ✓ BoxUser: 75 records
  ✓ Collection: 30 records
```

### Phase 3: Import Data (Existing Script)

Imports all transformed data to Gen2 DynamoDB.

```bash
node import-dynamodb.js [sbx|dev|prod]
```

**What it does:**
- Imports data in dependency order (User, Author, Box, BoxUser, Document, Collection, CollectionItem)
- Uses batch writes for efficiency
- All foreign keys now reference Gen2 Cognito subs

### Phase 4: Add Admins to WebAppAdmin Group

Adds all admin users to the WebAppAdmin Cognito group.

```bash
node add-admins-to-group.js [sbx|dev|prod]
```

**What it does:**
- Creates WebAppAdmin group if it doesn't exist
- Adds all users with `isAdmin: true` to the group
- Continues processing even if individual adds fail

**Expected output:**
```
Created group: WebAppAdmin
Adding 5 admin users to WebAppAdmin group...

  ✓ Added admin1@example.com to WebAppAdmin
  ✓ Added admin2@example.com to WebAppAdmin
  ✓ Added admin3@example.com to WebAppAdmin

=== Results ===
Added: 3 admins
Failed: 0 admins
```

### Phase 5: Verify Migration

Automated verification of migration success.

```bash
node verify-migration.js [sbx|dev|prod]
```

**What it checks:**
- Seed user conflicts handled correctly
- Admin users in WebAppAdmin group
- OAuth provider links active
- Foreign key integrity (no orphaned records)
- User counts match (Gen1 vs Gen2)

**Expected output:**
```
=== Migration Verification Report (SBX) ===

Seed User Conflicts:
  ✓ admin@example.com - Cognito: true, DynamoDB: true, Gen1 Data: true

Admin Group Membership:
  ✓ admin1@example.com
  ✓ admin2@example.com

OAuth Provider Links:
  ✓ google@example.com - Expected: Google, Linked: Google
  ✓ fb@example.com - Expected: Facebook, Linked: Facebook

Foreign Key Integrity:
  ✓
  Users: 150
  Documents: 500 (0 orphaned)
  Boxes: 20 (0 orphaned)
  BoxUsers: 75 (0 orphaned)

User Counts:
  ✓
  Gen1: 150
  Gen2: 150
  Mapping: 150

=== End Report ===
```

## Manual Verification Steps

### 1. Test OAuth Login

**Why manual:** Requires actual OAuth provider authentication flow

**Steps:**
1. Open application in browser
2. Click "Sign in with Google" (or Facebook/Amazon)
3. Complete OAuth flow
4. Verify user can access their documents
5. Repeat for each OAuth provider

### 2. Test Native User Password Reset

**Why manual:** Requires email verification and user interaction

**Steps:**
1. Attempt to log in as native user with old password (should fail)
2. Click "Forgot password"
3. Check email for reset code
4. Set new password
5. Log in with new password
6. Verify user can access their documents

### 3. Verify Admin Permissions

**Steps:**
1. Log in as admin user
2. Navigate to admin-only pages (User List, Box Requests)
3. Verify admin functionality works

## Troubleshooting

### Issue: UsernameExistsException

**Cause:** Email already exists in Cognito (seed user conflict)

**Resolution:** Script automatically handles this by querying existing user for `sub`. No action needed.

### Issue: LimitExceededException

**Cause:** Cognito API rate limit exceeded

**Resolution:** Script automatically retries with exponential backoff. If persistent, wait a few minutes and re-run.

### Issue: Provider linking failed

**Cause:** OAuth provider configuration issue or invalid provider subject

**Resolution:**
1. Check Gen1 user ID format (should be `google_xxx`, `facebook_xxx`, etc.)
2. Verify OAuth providers configured in Cognito
3. Check `mappings/[env]/failures.json` for details
4. Manual intervention may be required

### Issue: Validation failed - incomplete mapping

**Cause:** Some users failed to create in Phase 1

**Resolution:**
1. Check `mappings/[env]/failures.json` for failed users
2. Fix issues (invalid email, permissions, etc.)
3. Re-run Phase 1 for failed users only
4. Re-run Phase 2 after all users created

### Issue: Orphaned records detected

**Cause:** Foreign keys reference non-existent users

**Resolution:**
1. Check verification report for orphaned record details
2. Investigate why those users are missing
3. Either create missing users or remove orphaned records
4. Re-run verification

## Rollback Procedures

### Before Phase 3 (Import)

**Simple rollback:**
1. Don't run Phase 3
2. Optionally delete Gen2 Cognito users:
   ```bash
   # List users to verify
   aws cognito-idp list-users --user-pool-id [Gen2-pool-id]
   
   # Delete all Gen2 users (if needed)
   # Manual deletion via AWS Console or CLI
   ```

### After Phase 3 (Import)

**Complex rollback:**
1. Delete all Gen2 DynamoDB data
2. Delete all Gen2 Cognito users
3. Re-run migration from Phase 1

**Steps:**
```bash
# 1. Delete DynamoDB data
node pre-migration-cleanup.js [sbx|dev|prod]

# 2. Delete Cognito users (manual via AWS Console)
# Or use AWS CLI:
aws cognito-idp list-users --user-pool-id [Gen2-pool-id] \
  | jq -r '.Users[].Username' \
  | xargs -I {} aws cognito-idp admin-delete-user \
      --user-pool-id [Gen2-pool-id] --username {}

# 3. Re-run migration from Phase 1
node create-cognito-users.js [sbx|dev|prod]
```

## Post-Migration Cleanup (Optional)

After verification period (e.g., 30 days), delete Gen1 Cognito users:

```bash
node delete-gen1-cognito-users.js [dev|prod]
```

**Warning:** This is irreversible. Ensure:
- Migration verification passed
- Manual testing completed
- No issues reported for 30+ days
- Backup of Gen1 data exists

## Complete Migration Workflow

```bash
# Phase 0: Export and Transform (existing)
node export-dynamodb.js dev
node transform-data.js dev

# Phase 1: Create Cognito Users
node create-cognito-users.js dev

# Phase 2: Update Foreign Keys
node update-foreign-keys.js dev

# Phase 3: Import Data (existing)
node import-dynamodb.js dev

# Phase 4: Add Admins to Group
node add-admins-to-group.js dev

# Phase 5: Verify Migration
node verify-migration.js dev

# Manual verification (see above)

# Optional: After 30 days
node delete-gen1-cognito-users.js dev
```

## Files Created

### New Scripts
- `create-cognito-users.js` - Phase 1: Create users in Cognito
- `update-foreign-keys.js` - Phase 2: Update foreign keys
- `add-admins-to-group.js` - Phase 4: Add admins to group
- `verify-migration.js` - Phase 5: Verify migration
- `delete-gen1-cognito-users.js` - Optional cleanup

### New Directories
- `mappings/[env]/` - ID mappings and failures
- `import-ready/[env]/` - Data ready for import (with updated foreign keys)

### Modified Files
- `config.js` - Added COGNITO_CONFIG and OAUTH_PROVIDERS
- `package.json` - Added @aws-sdk/client-cognito-identity-provider

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review verification report for specific errors
3. Check `mappings/[env]/failures.json` for failed users
4. Consult architecture document: `.amazonq/work/current/ARCHITECTURE-migration-cognito-users.md`
