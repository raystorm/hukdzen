# Amplify Backend Organization

## Why This Structure Exists

The backend mirrors the project’s domain‑oriented architecture.
Amplify category folders are treated as domains:
auth, data, storage, and folders for the Lambda functions.
Domains own their resource definitions and configurations.
This keeps boundaries clear, keeps related logic together,
and prevents the root `backend.ts` from collapsing under its own weight
into a single, unmaintainable file as the system grows.

## Directory Structure

```
amplify/
  backend.ts              ← Main backend definition, wires everything together
  monitoring-stack.ts     ← Orchestrates all monitoring (uses domain monitoring)
  
  auth/
    resource.ts           ← Auth resource definition
    backend.ts            ← Auth configuration (Cognito groups, etc.)
  
  data/
    resource.ts           ← GraphQL API definition
    schema.graphql        ← GraphQL schema
    resolvers/            ← Custom resolvers
  
  storage/
    resource.ts           ← Defines storage resource (currently S3 Bucket)
    backend.ts            ← Storage(Bucket) configuration (CORS, versioning, etc.)
    monitoring.ts         ← Storage alarms (S3 growth)
  
  search/
    resource.ts           ← OpenSearch Serverless collection
    monitoring.ts         ← Search alarms (indexing, latency, OCU)
  
  email/
    resource.ts           ← SES configuration, bounce/complaint topics
    monitoring.ts         ← Email alarms (bounce rate, complaint rate)
  
  monitoring/
    cost-alarms.ts        ← Cross-cutting cost monitoring
    dashboard.ts          ← Unified CloudWatch dashboard
  
  functions/
    <function-name>/
      resource.ts         ← Lambda function definition
      backend.ts          ← Lambda configuration (policies, env vars)
      handler.ts          ← Lambda code
```

## Pattern

Each domain directory contains:
- `resource.ts` - Defines the resource (required by Amplify)
- `backend.ts` - Configures the resource (Roles, Policies, IAM,
                                          CORS, environment variables, overrides)
- `monitoring.ts` - Domain-specific CloudWatch alarms (optional)

Giving each domain its own files keeps the backend easy to navigate
and prevents the root `backend.ts` file from becoming a single, unmaintainable mess.

## Domain-Owned Monitoring

Each domain owns its monitoring:
- `search/monitoring.ts` - OpenSearch alarms (indexing, latency, OCU)
- `email/monitoring.ts` - SES alarms (bounce rate, complaint rate)
- `storage/monitoring.ts` - S3 alarms (storage growth)

Cross-cutting concerns live in `monitoring/`:
- `cost-alarms.ts` - Total cost, Lambda invocations, DynamoDB throttling
- `dashboard.ts` - Unified CloudWatch dashboard

This follows the "bake security throughout" philosophy:
Bake monitoring throughout too.

### Monitoring Details

**OpenSearch Alarms** (`search/monitoring.ts`)
- Search Latency: Alerts when searches exceed 2 seconds (10 min average)
- OCU Usage: Cost control, alerts at 1 OCU (dev) or 1.5 OCU (prod) for 2 hours

**Lambda Alarms** (`functions/ingest-trigger/monitoring.ts`)
- Errors: Alerts on any Lambda execution failure (only when uploads occur)

**Email Alarms** (`email/monitoring.ts`)
- Bounce Rate: Alerts at 5% (AWS suspends at 10%)
- Complaint Rate: Alerts at 0.1% (AWS suspends at 0.5%)

**Storage Alarms** (`storage/monitoring.ts`)
- S3 Growth: Alerts when storage exceeds 1 GB (current < 120 MB)

**Cost Alarms** (`monitoring/cost-alarms.ts`)
- Total Cost: $18/month (dev), $35/month (prod)
- Lambda Invocations: 100/hour (dev), 200/hour (prod)
- DynamoDB Throttling: 10 errors in 10 minutes

**Dashboard** (`monitoring/dashboard.ts`) - DISABLED ($3/month per environment)
- Estimated monthly cost
- Lambda invocations
- DynamoDB operations
- OpenSearch OCU usage
- OpenSearch operations (search/indexing rates)
- Uncomment in monitoring-stack.ts if visibility is worth $6/month
- Metrics still available in CloudWatch console for free

All alarms send to SNS topic, email: Tom.Burton@Outlook.com

## Why Not a Single `backend.ts`?

Amplify Gen 2 examples often place all definitions and configuration in the root file.  
That works for demos, and simple projects, but not for real applications
with multiple domains and evolving requirements.

This project keeps each category/domain self‑contained:

- Auth logic lives with auth
- API logic lives with the API
- Storage logic lives with storage
- Functions own their own configuration and code

The result is a backend that scales cleanly, stays readable,
and aligns with the application code's domain‑first organization.