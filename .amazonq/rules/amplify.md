# AWS Amplify Standards

## Authentication
- Use existing auth patterns from `AuthEventsProcessor.ts`
- Follow OpenID Connect flows for Google/Facebook/Amazon
- Use Cognito groups for role-based access

## GraphQL
- Use generated types from `src/graphql/`
- Follow existing query/mutation patterns
- Use proper error handling for GraphQL operations

## Storage
- Use S3 for file uploads following existing patterns
- Implement proper file validation
- Use consistent naming for storage keys

## Lambda Functions
- Use JavaScript for Lambda functions (existing pattern)
- Follow error handling patterns in `ingestTrigger`
- Use proper CloudWatch logging