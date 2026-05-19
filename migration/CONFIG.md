# Migration Configuration

## Overview

All environment-specific configuration is centralized in `config.js`
to avoid repetition across migration scripts.

## Configuration File: `config.js`

### GEN1_CONFIG
Configuration for Gen1 (source) environments:
- `region`: AWS region for Gen1 resources
- `tablePrefix`: DynamoDB table prefix
- `s3Bucket`: S3 bucket name
- `duplicateAccountIds`: User IDs to reassign during cleanup

### GEN2_CONFIG
Configuration for Gen2 (destination) environments:
- `region`: AWS region for Gen2 resources
- `tablePrefix`: DynamoDB table prefix (update after deployment)
- `s3Bucket`: S3 bucket name (update after deployment)
- `gen1Source`: Source environment for data (sbx uses dev data)

### Constants
- `SYSTEM_USER_ID`: System user ID for ownership reassignment
- `GEN1_TABLES`: List of Gen1 table names
- `GEN2_TABLES`: List of Gen2 table names
- `TABLE_MAPPINGS`: Gen1 to Gen2 table name mappings

## Updating Configuration

### After Gen2 Deployment

1. Find your Gen2 table prefix:
   ```bash
   aws dynamodb list-tables --region us-east-1 | grep "Document-"
   # Example: Document-abc123xyz-dev → prefix is "abc123xyz"
   ```

2. Find your Gen2 S3 bucket:
   ```bash
   aws s3 ls | grep amplify
   # Example: amplify-hukdzen-dev-abc123xyz
   ```

3. Update `config.js`:
   ```javascript
   export const GEN2_CONFIG = {
      dev: {
         region: 'us-east-1',
         tablePrefix: 'abc123xyz',  // ← Update this
         s3Bucket: 'amplify-hukdzen-dev-abc123xyz'  // ← Update this
      },
      // ...
   };
   ```

## Scripts Using Configuration

All migration scripts now import from `config.js`:

- `export-dynamodb.js`       → Uses `GEN1_CONFIG`, `GEN1_TABLES`
- `import-dynamodb.js`       → Uses `GEN2_CONFIG`, `GEN2_TABLES`
- `sync-s3.js`               → Uses `GEN1_CONFIG`, `GEN2_CONFIG`
- `validate-migration.js`    → Uses `GEN2_CONFIG`, `TABLE_MAPPINGS`
- `pre-migration-cleanup.js` → Uses `GEN1_CONFIG`, `SYSTEM_USER_ID`

## Benefits

1. **Single Source of Truth**: Update configuration in one place
2. **Consistency**: All scripts use the same values
3. **Maintainability**: Easier to add new environments or update settings
4. **Type Safety**: Centralized constants reduce typos
5. **Documentation**: Configuration structure is self-documenting

## Example: Adding a New Environment

To add a staging environment:

```javascript
export const GEN2_CONFIG = {
   // ... existing configs ...
   staging: {
      region: 'us-east-1',
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY',
      s3Bucket: 'UPDATE_AFTER_GEN2_DEPLOY',
      gen1Source: 'dev'  // staging uses dev data
   }
};
```

Then update script validation:
```javascript
if (!['dev', 'prod', 'sbx', 'staging'].includes(ENV))
```
