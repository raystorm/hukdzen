# Commit Message Standards

## Critical Rule
- ALWAYS follow the commit style guide in `docs/dev/commit-style-guide.md`
- Use plain language, imperative headers, and semantic bullets
- Order bullets by importance (production logic, tests, docs, formatting)
- Group related changes conceptually
- Wrap file names and code objects in backticks
- Use domain vocabulary consistently

## Bullet System
- `+` Added
- `*` Changed/Updated/Improved
- `-` Removed

## Example Format
```
Add searchRunner Lambda with OpenSearch integration

  + `searchRunner` Lambda queries OpenSearch with permission filtering
  + admin users search all boxes, non-admin filtered to accessible boxes
  + field selection: keywords default, 'all' option, specific field
  + pagination with limit/from/nextToken
  * relevance ranking by default, optional custom sort
  + GSIs: byUser, byOwner, byBox, byEmail, byCollection
  + `SearchResults` and `SearchResultItem` types in schema
  + comprehensive tests with nested describe blocks
  * `ingest-trigger` -> `ingestTrigger` for camelCase consistency
```
