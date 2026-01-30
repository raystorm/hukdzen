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
  
  auth/
    resource.ts           ← Auth resource definition
  
  data/
    resource.ts           ← GraphQL API definition
    schema.graphql        ← GraphQL schema
    resolvers/            ← Custom resolvers
  
  storage/
    resource.ts           ← Defines storage resource (currently S3 Bucket)
    backend.ts            ← Storage(Bucket) configuration (CORS, versioning, etc.)
  
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

Giving each domain its own `backend.ts` file keeps the backend easy to navigate
and prevents the root `backend.ts` file from becoming a single, unmaintainable mess.

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