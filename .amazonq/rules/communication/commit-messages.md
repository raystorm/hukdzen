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

## Bullet Semantic Integrity
- `+` bullets MUST use additive language (added, new, created, introduced)
- `-` bullets MUST use subtractive language (removed, deleted, dropped)
- `*` bullets for changes that aren't pure additions or removals

## Renames
- Use arrow syntax (`->`) for renames in summary line and bullets
- Example summary: `oldName -> newName for consistency`
- Example bullet: `* AlertMessage -> AlertView`

## Example Format
```
Add searchRunner Lambda with OpenSearch integration

  + new `searchRunner` Lambda queries OpenSearch with permission filtering
    * admin users search all boxes, non-admin filtered to accessible boxes
    * updated field selection: keywords default, 'all' option, specific field
    + added pagination with limit/from/nextToken
    * uses relevance ranking by default, optional custom sort
  + added GSIs: byUser, byOwner, byBox, byEmail, byCollection
  + added `SearchResults` and `SearchResultItem` types in schema
  + added comprehensive tests with nested describe blocks
  * `ingest-trigger` -> `ingestTrigger` for camelCase consistency
```
