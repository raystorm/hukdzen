# Hukdzen Gen 2 Migration - Automated Infrastructure

Automated deployment for Amplify Gen 2 migration with cost optimization.

## Quick Start

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install AWS CLI
aws --version

# Configure AWS credentials
aws configure
```

### Deploy Dev Environment (us-east-1)

```bash
cd gen2-infrastructure
npm install
npm run deploy:dev
```

### Deploy Prod Environment (us-west-2)

```bash
cd gen2-infrastructure
npm install
npm run deploy:prod
```

## What Gets Created Automatically

### Infrastructure
- ✅ OpenSearch Serverless collection
- ✅ DynamoDB tables (reuses existing Gen 1 tables)
- ✅ Lambda functions (ingestTrigger, emailNotifier, searchDocuments)
- ✅ AppSync GraphQL API
- ✅ S3 buckets for storage
- ✅ Cognito user pools

### Monitoring & Cost Alarms
- ✅ Total monthly cost alarm (Dev: $20, Prod: $40)
- ✅ Lambda invocation alarm (runaway detection)
- ✅ DynamoDB throttling alarm
- ✅ S3 storage growth alarm
- ✅ CloudWatch dashboard with cost metrics
- ✅ SNS topic for email alerts

### Email Configuration
- ✅ SES integration (us-west-2 for both environments)
- ✅ No cross-region permissions issues
- ✅ Reuses existing SES configuration

## Cost Projections

### Current (Gen 1)
- Dev: t3.small OpenSearch = $26/month
- Prod: t3.medium OpenSearch = $73/month
- **Total: ~$99/month**

### After Migration (Gen 2)
- Dev (us-east-1): $10-15/month
- Prod (us-west-2): $25-35/month
- **Total: $35-50/month**
- **Savings: 50-70%**

## Regional Configuration

| Environment | Region    | Reason                                      |
|-------------|-----------|---------------------------------------------|
| Dev         | us-east-1 | Cheapest, faster for east coast development |
| Prod        | us-west-2 | Optimal for west coast users                |
| SES         | us-west-2 | Single region for both environments         |

## Deployment Commands

```bash
# Deploy dev environment
npm run deploy:dev

# Deploy prod environment
npm run deploy:prod

# Seed dev with test data
npm run seed:dev

# Reindex existing documents (after prod migration)
npm run reindex:prod

# Generate cost report
npm run cost:report
```

## Migration Timeline

1. **Week 1**: Deploy dev to us-east-1, test functionality
2. **Weeks 2-4**: Deploy prod to us-west-2, parallel run
3. **Week 5**: Cutover prod traffic
4. **Week 6**: Decommission Gen 1, validate savings

## Monitoring

### CloudWatch Dashboard
After deployment, access your dashboard:
```
https://console.aws.amazon.com/cloudwatch/home?region=<region>#dashboards:name=hukdzen-<env>-costs
```

### Cost Alarms
Email alerts sent to configured address when:
- Monthly cost exceeds threshold
- Lambda invocations spike
- DynamoDB throttling occurs
- S3 storage grows unexpectedly

## Environment Variables

**Optional** - Set these before deployment to override defaults:

```bash
export ALERT_EMAIL="your-email@example.com"  # Default: admin@smalgyax-files.org
export SES_FROM_EMAIL="noreply@smalgyax-files.org"  # Default: noreply@smalgyax-files.org
```

**Note:** If not set, the deploy script uses sensible defaults.

## Rollback Plan

If issues occur:
1. Switch client back to Gen 1 API endpoint
2. Gen 1 infrastructure remains until Gen 2 validated
3. No data loss (DynamoDB tables shared)

## Support

See `GEN2_MIGRATION_PLAN.md` for detailed migration steps.
