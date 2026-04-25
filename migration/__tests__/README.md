# Migration Scripts Test Suite

Comprehensive test suite for Gen1→Gen2 migration scripts using Vitest and TDD approach.

## Test Structure

```
__tests__/
├── fixtures/
│   ├── original/       # Gen1 data (flat schema) - from GitHub
│   └── edge-cases/     # Edge case test data
├── export-dynamodb.test.js
├── transform-data.test.js
├── import-dynamodb.test.js
├── pre-migration-cleanup.test.js
├── sync-s3.test.js
└── validate-migration.test.js
```

**Note:** Gen2 expected data is in `src/__utils__/__fixtures__/` (used by frontend tests)

## Test Coverage

### export-dynamodb.test.js (5 scenarios)
- Export all tables successfully
- Handle paginated scan results
- Handle missing table error
- Handle invalid environment argument
- Create output directory if missing

### transform-data.test.js (8 scenarios)
- Transform DocumentDetails to Document (nested Summary)
- Transform Xbiis to Box (field rename)
- Transform Collection with nested Summary
- Handle null and missing fields
- Transform BoxUser with field renames
- Transform CollectionItem with field renames
- Handle missing input directory
- Skip tables without transformer

### import-dynamodb.test.js (6 scenarios)
- Import all tables successfully
- Batch items in chunks of 25
- Handle table prefix not configured
- Handle missing transformed directory
- Skip tables without transformed file
- Handle DynamoDB write errors

### pre-migration-cleanup.test.js (7 scenarios)
- Create SYSTEM user if missing
- Skip SYSTEM user creation if exists
- Reassign documents from duplicate accounts
- Reassign boxes from duplicate accounts
- Reassign box users from duplicate accounts
- Handle environment-specific duplicate account lists
- Handle no duplicate accounts

### sync-s3.test.js (5 scenarios)
- Sync files from Gen1 to Gen2 bucket
- Handle Gen2 bucket not configured
- Display verification commands
- Handle invalid environment argument
- Use correct regions for dev vs prod

### validate-migration.test.js (8 scenarios)
- Validate successful migration
- Detect export/transform mismatch
- Detect transform/import mismatch
- Handle missing export directory
- Handle missing transformed directory
- Handle table prefix not configured
- Handle DynamoDB scan errors
- Validate all table mappings

## Running Tests

```bash
# Run all migration tests
cd gen2-infrastructure/migration
npm test

# Run specific test file
npm test export-dynamodb.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Mock Strategy

### AWS SDK Mocking
- `@aws-sdk/client-dynamodb` - DynamoDBClient
- `@aws-sdk/lib-dynamodb` - DynamoDBDocumentClient, ScanCommand, BatchWriteCommand, UpdateCommand, PutCommand
- No real AWS API calls made during tests

### File System Mocking
- `fs.readFileSync` - Returns fixture data
- `fs.writeFileSync` - Captures output
- `fs.existsSync` - Controls directory/file existence
- `fs.mkdirSync` - Verifies directory creation

### Child Process Mocking
- `execSync` - Mocks S3 sync command execution
- Verifies correct AWS CLI commands

## Test Fixtures

### Gen1 Data (fixtures/original/ - from GitHub)
- userList.json - Real Gen1 User data
- authorList.json - Real Gen1 Author data
- docList.json - Real Gen1 DocumentDetails with flat eng_title, bc_title, ak_title
- boxList.json - Real Gen1 Xbiis with xbiisOwnerId
- boxRequestList.json - Real Gen1 BoxRequest data

### Gen2 Data (src/__utils__/__fixtures__/ - for frontend tests)
- userList.json - Transformed User data
- authorList.json - Transformed Author data
- docList.json - Transformed Document with nested eng/bc/ak Summary objects
- boxList.json - Transformed Box with ownerUserId
- boxRequestList.json - Transformed BoxRequest data

### Edge Cases
- documents-with-nulls.json - Null and missing field handling

## Key Transformations Tested

### DocumentDetails → Document
```javascript
// Gen1 (flat)
{
   eng_title: "Title",
   bc_title: "BC Title",
   documentDetailsDocOwnerId: "user-1"
}

// Gen2 (nested)
{
   eng: { title: "Title" },
   bc: { title: "BC Title" },
   documentContentOwnerUserId: "user-1"
}
```

### Xbiis → Box
```javascript
// Gen1
{ xbiisOwnerId: "user-1" }

// Gen2
{ ownerUserId: "user-1" }
```

## TDD Approach

Tests were written FIRST before implementation to ensure:
- Correct behavior is defined upfront
- All edge cases are considered
- Implementation matches requirements
- No implementation bias in test design

## Notes

- All tests use mocked AWS SDK (no real API calls)
- Tests verify transformations without running actual scripts
- Fixtures provide realistic test data
- Edge cases cover null/missing field handling
