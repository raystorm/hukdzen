# Sandbox Development Guide

## Overview

Amplify Sandbox provides a local development environment that deploys AWS
resources to your account for rapid iteration. By default, **OpenSearch is
disabled** to reduce deployment time and costs.

## Quick Start

Start sandbox without search:

```bash
npm run sbx:dev
```

This deploys:
- ✅ Authentication (Cognito)
- ✅ Database (DynamoDB)
- ✅ Storage (S3)
- ✅ All Lambdas except search
- ❌ OpenSearch (disabled)

**Deployment time:** ~2-3 minutes

## Enabling Search

To enable OpenSearch in sandbox:

```bash
npm run sbx:search
```

Or manually:

```bash
ENABLE_OPENSEARCH=true npx ampx sandbox --profile dev
```

This deploys everything including:
- ✅ OpenSearch Serverless collection
- ✅ Search Lambdas (indexInit, ingestTrigger, searchRunner)
- ✅ Search monitoring

**Deployment time:** ~10-15 minutes (OpenSearch provisioning is slow)

## Cost Implications

### Sandbox Without Search
- **Cost:** ~$0.50-$1.00 per day
- **Components:** Cognito, DynamoDB, S3, Lambda invocations

### Sandbox With Search
- **Cost:** ~$5-$10 per day
- **Additional:** OpenSearch Serverless collection (~$4-$8/day minimum)
- **Warning:** OpenSearch Serverless has minimum OCU charges even when idle

### Recommendation
- **Default workflow:** Use `npm run sbx:dev` (search disabled)
- **When working on search:** Use `npm run sbx:search` (search enabled)
- **Always clean up:** Run `npm run sbx:delete` when done

**Cost savings:** Disabling OpenSearch in sandbox saves ~$120-$240/month

## Environment Variable Configuration

### ENABLE_OPENSEARCH

Controls whether OpenSearch infrastructure is deployed.

**Default behavior:**
- **Sandbox** (no AMPLIFY_ENV or AMPLIFY_ENV=sandbox): OpenSearch **OFF**
- **Dev** (AMPLIFY_ENV=dev): OpenSearch **ON**
- **Prod** (AMPLIFY_ENV=prod): OpenSearch **ON**

**Override behavior:**
- `ENABLE_OPENSEARCH=true` → Force OpenSearch ON (any environment)
- `ENABLE_OPENSEARCH=false` → Force OpenSearch OFF (any environment)

### Examples

**Sandbox with search enabled:**
```bash
ENABLE_OPENSEARCH=true npx ampx sandbox --profile dev
```

**Dev environment with search disabled (for testing):**
```bash
ENABLE_OPENSEARCH=false npx ampx sandbox --profile dev
```

**Prod environment with search disabled (not recommended):**
```bash
ENABLE_OPENSEARCH=false npx amplify publish --profile prod
```

## When Search is Disabled

**What works:**
- User authentication and authorization
- Document upload and storage
- Document metadata CRUD operations
- Collections management
- All non-search features

**What doesn't work:**
- Document search (returns error)
- Search filters
- Full-text search

**Frontend behavior:**
- Search requests fail gracefully
- Error messages displayed to user
- No crashes or broken functionality

## Sandbox Management

**Start sandbox:**
```bash
npm run sbx:dev          # Without search
npm run sbx:search       # With search
```

**Delete sandbox:**
```bash
npm run sbx:delete       # Deletes all sandbox resources
```

**Reset sandbox:**
```bash
npm run sbx:reset        # Delete and restart
```

**Seed test data:**
```bash
npm run sbx:seed         # Add test users
```

## Development Workflow

### Working on Non-Search Features

1. Start sandbox without search: `npm run sbx:dev`
2. Make changes to code
3. Sandbox auto-deploys changes
4. Test in browser at http://localhost:3000
5. When done: `npm run sbx:delete`

**Benefits:**
- Fast deployment (~2-3 minutes)
- Low cost (~$0.50-$1.00/day)
- All features except search work

### Working on Search Features

1. Start sandbox with search: `npm run sbx:search`
2. Wait for OpenSearch provisioning (~10-15 minutes first time)
3. Make changes to search code
4. Test search functionality
5. When done: `npm run sbx:delete`

**Note:** OpenSearch provisioning is slow. Plan accordingly.

## Troubleshooting

### Sandbox won't start
- Check AWS credentials: `aws sts get-caller-identity --profile dev`
- Check for existing sandbox: `npx ampx sandbox delete --profile dev -y`

### Search not working in sandbox
- Verify OpenSearch is enabled: Check for `ENABLE_OPENSEARCH=true`
- Check deployment logs for OpenSearch collection creation
- Verify search Lambdas are deployed

### High AWS costs
- Delete sandbox when not in use: `npm run sbx:delete`
- Use search-disabled mode for non-search work
- Monitor costs in AWS Cost Explorer

## Implementation Details

**When disabled:**
- OpenSearch collection not created
- Search Lambdas (indexInit, ingestTrigger, searchRunner) not deployed
- Search monitoring not created
- OpenSearch policies and environment variables not configured

**When enabled:**
- All search infrastructure deployed (current behavior)
- Full search functionality available

## Related Documentation

- `docs/dev/architecture.md` - Full architecture overview
- `amplify/search/README.md` - OpenSearch configuration details (if exists)
- `amplify/functions/searchRunner/README.md` - Search Lambda documentation (if exists)
