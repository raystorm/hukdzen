# Amplify Gen 2 Migration Plan - Automated

## Overview
Migrate from Amplify Gen 1 to Gen 2 with:
- Zero downtime for Production
- Regional split: Dev (us-east-1), Prod (us-west-2)
- OpenSearch Serverless for cost savings
- Single SES region for email (us-west-2)
- Automated infrastructure deployment
- Cost monitoring and alarms

## Cost Projections

### Current (Gen 1)
- Dev OpenSearch (t3.small): $26/month
- Prod OpenSearch (t3.medium): $73/month
- Other services: ~$15/month
- **Total: ~$114/month** (actual: $84-87 with credits/reserved)

### After Migration (Gen 2)
- OpenSearch Serverless (both envs): $15-25/month
- DynamoDB: $5-10/month
- Lambda/S3: $5-10/month
- SES: $0 (free tier)
- **Total: $25-45/month**
- **Savings: $40-70/month (50-70%)**

## Timeline

- **Week 1**: Setup and preparation
- **Weeks 2-4**: Prod migration (us-west-2)
- **Week 5**: Dev fresh start (us-east-1)
- **Week 6**: Cleanup and validation

## Phase 1: Preparation (Week 1)

### 1.1 Prerequisites

```bash
# Install Amplify Gen 2 CLI
npm install -g @aws-amplify/cli@latest

# Verify AWS credentials
aws sts get-caller-identity

# Verify SES is configured in us-west-2
aws ses get-account-sending-enabled --region us-west-2
```

### 1.2 Use Existing Gen 2 Migration Branch

```bash
cd /home/tburton/IdeaProjects/hukdzen

# Switch to existing branch
git checkout feature/amplify-gen-2

# Initialize Gen 2 in existing repo
npm create amplify@latest

# Commit Gen 2 structure
git add .
git commit -m "Initialize Amplify Gen 2 migration"
git push -u origin feature/amplify-gen-2
```

**Branch Strategy:**
- `main` branch: Gen 1 (production)
- `feature/amplify-gen-2` branch: Gen 2 development
- After validation: merge `feature/amplify-gen-2` → `main`

**Why this approach:**
- Single repo, version controlled
- Easy to compare Gen 1 vs Gen 2
- Can cherry-pick bug fixes between branches
- Clean history of migration

### 1.3 Set Up MCP Server (Optional - Developer Productivity)

The Amplify MCP Server gives AI assistants direct access to your backend during development.

```bash
# Install MCP Server globally
npm install -g @aws-amplify/mcp-server-amplify

# Configure in your IDE (e.g., Amazon Q, Claude Desktop)
# Add to MCP settings:
{
  "mcpServers": {
    "amplify": {
      "command": "npx",
      "args": ["-y", "@aws-amplify/mcp-server-amplify"]
    }
  }
}
```

**Benefits:**
- AI can read/modify your Amplify schema
- AI can query your data during development
- AI can help debug issues faster
- Only runs locally, no production access

**When to use:** During Phase 2-3 development and testing

### 1.4 Document Current State

Export current configurations:
```bash
# From Gen 1 project
cd /home/tburton/IdeaProjects/hukdzen

# Export Cognito user pool IDs
aws cognito-idp list-user-pools --max-results 10 --region us-west-2 > cognito-pools.json

# Export DynamoDB table names
aws dynamodb list-tables --region us-west-2 > dynamodb-tables.json

# Export S3 bucket names
aws s3 ls > s3-buckets.txt

# Export OpenSearch domain info
aws opensearch describe-domain --domain-name <domain-name> --region us-west-2 > opensearch-config.json
```

## Phase 2: Prod Migration (Weeks 2-4)

### 2.1 Automated Infrastructure Deployment

All infrastructure is defined in code (see files below).

Deploy to us-west-2:
```bash
cd /home/tburton/IdeaProjects/hukdzen
git checkout feature/amplify-gen-2
npx ampx sandbox --region us-west-2 --profile prod
```

### 2.2 OpenSearch Serverless Setup

Automated via CDK in `monitoring-stack.ts` (see file below).

### 2.3 Data Migration

**DynamoDB**: No migration needed - Gen 2 points to existing tables
**OpenSearch**: Reindex via Lambda trigger on existing data

```bash
# Trigger reindex of all documents
aws lambda invoke \
  --function-name reindex-documents-prod \
  --region us-west-2 \
  --payload '{"action": "reindex_all"}' \
  response.json
```

### 2.4 Parallel Run

Both Gen 1 and Gen 2 run simultaneously for 1 week:
- Gen 1: Existing users
- Gen 2: Testing and validation
- Monitor costs daily

### 2.5 Cutover

Update client configuration:
```typescript
// src/aws-exports.ts
export const awsconfig = {
  aws_appsync_graphqlEndpoint: 'https://<new-gen2-endpoint>',
  // ... other config
};
```

Deploy client update:
```bash
npm run build
amplify publish
```

## Phase 3: Dev Fresh Start (Week 5)

### 3.1 Deploy Dev Environment

```bash
cd /home/tburton/IdeaProjects/hukdzen
git checkout feature/amplify-gen-2
npx ampx sandbox --region us-east-1 --profile dev
```

### 3.2 Seed Test Data

```bash
# Run seed script
npm run seed:dev
```

## Phase 4: Cleanup (Week 6)

### 4.1 Decommission Gen 1

```bash
# Delete Gen 1 OpenSearch domains
aws opensearch delete-domain \
  --domain-name amplify-opense-dev \
  --region us-west-2

aws opensearch delete-domain \
  --domain-name amplify-opense-prod \
  --region us-west-2

# Delete Gen 1 AppSync APIs (keep DynamoDB tables)
aws appsync delete-graphql-api \
  --api-id <gen1-api-id> \
  --region us-west-2
```

### 4.2 Merge Gen 2 to Main

```bash
cd /home/tburton/IdeaProjects/hukdzen

# Switch to main
git checkout main

# Merge Gen 2 migration
git merge feature/amplify-gen-2

# Push to remote
git push origin main

# Tag the migration
git tag -a v2.0.0-gen2 -m "Amplify Gen 2 migration complete"
git push origin v2.0.0-gen2

# Optional: Delete migration branch
git branch -d feature/amplify-gen-2
git push origin --delete feature/amplify-gen-2
```

### 4.3 Validate Cost Savings

Check CloudWatch dashboard and AWS Cost Explorer after 1 month.

## Cost Alarms Configuration

All alarms are automatically created via `monitoring-stack.ts`.

**Alarms Created:**
1. OpenSearch Serverless OCU usage > 100 hours/day
2. Total monthly cost > $50
3. Lambda invocations > 1000/hour
4. DynamoDB throttling
5. S3 storage > 10GB

**Notification**: Email to configured address

## SES Configuration

**Single Region**: us-west-2 (for both Dev and Prod)

**Why**: 
- SES is region-specific but can send from anywhere
- No cross-region permissions issues
- Simpler configuration

**Setup**:
```bash
# Verify domain in us-west-2 (if not already done)
aws ses verify-domain-identity --domain hukdzen.com --region us-west-2

# Verify email addresses for testing
aws ses verify-email-identity --email-address admin@hukdzen.com --region us-west-2
```

Lambda functions in both regions will use SES in us-west-2.

## Rollback Plan

If issues arise during migration:

1. **Immediate**: Switch client back to Gen 1 endpoint
2. **Within 24 hours**: Investigate and fix Gen 2 issues
3. **If unfixable**: Keep Gen 1 running, delay Gen 2 migration

Gen 1 resources remain until Gen 2 is validated (1-2 weeks).

## Success Criteria

- [ ] Zero downtime during migration
- [ ] All functionality working in Gen 2
- [ ] Cost < $50/month after 1 month
- [ ] Search performance equivalent or better
- [ ] All cost alarms configured and tested
- [ ] Documentation updated

## Next Steps

1. Review this plan
2. Create infrastructure files (provided below)
3. Test in sandbox environment
4. Execute Phase 1
