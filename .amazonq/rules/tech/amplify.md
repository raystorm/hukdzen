# AWS Amplify Standards

## Authentication
- Use existing auth patterns from `AuthEventsProcessor.ts`
- Follow OpenID Connect flows for Google/Facebook/Amazon
- Use Cognito groups for role-based access

## GraphQL
- **ALWAYS** define new data types in GraphQL schema first (`amplify/backend/api/hukdzen/schema.graphql`)
- Generate TypeScript types from GraphQL schema using `amplify codegen`
- Never create TypeScript types independently for data that will be stored/queried
- Use generated types from `src/graphql/`
- Follow existing query/mutation patterns
- Use proper error handling for GraphQL operations

## Storage
- Use S3 for file uploads following existing patterns
- Implement proper file validation
- Use consistent naming for storage keys

## Lambda Functions
- Use TypeScript for Lambda functions (existing pattern)
- Follow error handling patterns in `ingestTrigger`
- Use proper CloudWatch logging

### Initial Lambda Deployments
First-time Lambda enablement must be done one Lambda at a time unless tightly coupled.
A newly enabled Lambda must be proven fully functional end-to-end before the next Lambda is enabled.
