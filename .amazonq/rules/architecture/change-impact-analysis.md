# Change Impact Analysis & Validation Strategy

## CRITICAL: Pre-Implementation Impact Analysis

**MANDATORY for:**
- Structural changes  
- Type or contract changes  
- Cross-domain changes
- Schema modifications affecting frontend
- Changes affecting 5+ files
- Changes combining multiple change types

---

## Change Classification

### Structure Changes

Changes to the shape, structure, or contract of data types or interfaces

**Examples:**
- Adding nested interfaces (Content, Summary)
- Flat fields → nested objects
- Adding/removing/Modifying required fields
- Introducing new interface layers
- Changing field types (string → number)

**Impact:**
- Breaks consumers expecting the old structure
- Data type expectations change
- Frontend type usage breaks
- Component prop types need updates
- Test mock data needs restructuring
- Saga response handling changes

### Renames

Changing names of types, fields, entities, or operations without changing structure.

**Examples:**
- DocumentDetails → Document
- `getDocumentList` → `listDocuments`
- `authorId` → `userId`

**Impact:**
- Import statements break
- GraphQL query/mutation names change
- File references need updates
- Documentation becomes outdated
- Test expectations need updates

### Cross-Domain Changes

Changes that affect multiple domains or global concerns.

**Examples:**
- Changing shared types (Content, Summary)
- Updating global utilities
- Changing system-wide conventions
- Adjusting shared workflows
- Modifying schema types used by multiple domains
- Changing authentication/authorization patterns

**Impact:**
- Multiple domains break simultaneously
- Unpredictable cascade effects
- Difficult to isolate failures
- Large manual fix burden

---

## Pre-Implementation Analysis Steps

### 1. Identify Change Type

Classify the change: type structure, rename, cross-domain, or combination.

### 2. Search for Usage

Identify all direct and indirect usage of the affected entity.

**For type structure changes:**
```bash
grep -r "TypeName" src/
grep -r "\.fieldName\." src/
```

**For schema changes:**
```bash
grep -r "queryName" src/
grep -r "mutationName" src/
```

### 3. Identify Affected Domains

List all domains that will be affected:
- Direct usage (imports or references the type)
- Indirect usage (uses related types)
- Test files

### 4. Predict Breaking Changes

**Type structure changes:**
- Component props expecting old structure
- Saga response handling expecting old shape
- Code expecting old structure, shape, or type
- Test mocks using old structure
- Utilities accessing old fields

**Renames:**
- Import statements
- GraphQL operation names
- File references
- Type annotations
- Type usage / references

**Cross-domain:**
- All domains using the shared type
- Global utilities
- Shared components

### 5. Flag High-Risk Changes

**High risk indicators:**
- Affects 5+ files
- Affects multiple domains
- Combines multiple change types
- Combines type change + rename
- Changes schema types used by frontend

**Action:** Recommend phase splitting.

---

## Phase Splitting Strategy

### When to Split

Split when change is:
- High risk (5+ files, multiple domains)
- Combines multiple change types
- Schema type change + rename
- Cross-domain impact

### How to Split

**Principle:** One change type per phase.

**Example: Document Migration**

**❌ Too large:**
- Content Interface + Summary + DocumentDetails → Document + RSF migration (all at once)

**✅ Split into phases:**

**Phase 1: Type Structure Change**
- Add Content Interface to Document
- Implement nested Summary structure
- Update frontend to use nested fields
- Tests alongside changes
- Validate + Commit

**Phase 2: Rename**
- DocumentDetails → Document
- Update imports and references
- Update GraphQL operation names
- Tests alongside changes
- Validate + Commit

**Phase 3: RSF Migration**
- Switch to guarded mutations
- Update saga patterns
- Tests alongside changes
- Validate + Commit

**Benefits:**
- Each phase is validatable
- Smaller fixes if something breaks
- Can stop/adjust between phases
- Reduces manual fix burden

---

## Validation Strategy

### Schema Type Changes

**Before implementation:**
1. Identify all frontend files using the type
2. List expected breaking changes
3. Create validation checklist

**After implementation:**
1. Run TypeScript compiler on affected files
2. Run tests for affected domains
3. Manual spot-check critical paths

**Validation checklist example:**
```
□ Component props updated for new structure
□ Saga response handling updated
□ Test mocks restructured
□ Utilities updated for new field access
□ No TypeScript errors in affected files
□ All tests passing in affected domains
```

### Cross-Domain Changes

**Before implementation:**
1. List all affected domains
2. Identify domain boundaries
3. Plan validation per domain

**After implementation:**
1. Validate each affected domain separately
2. Check domain boundaries (no unintended coupling)
3. Run full test suite (not just affected domains)

**Validation per domain:**
```
□ Domain A: types updated, tests passing
□ Domain B: types updated, tests passing
□ Domain C: types updated, tests passing
□ Cross-domain: no unintended coupling
```

### Rename Changes

**Before implementation:**
1. Search for all usages
2. List files to update
3. Verify no dynamic references (string-based lookups)

**After implementation:**
1. Verify all imports/references updated
2. Verify all GraphQL operations updated
3. Run TypeScript compiler (catch missed references)
4. Run full test suite

---

## Profile Integration

### Architect

- Performs pre-implementation impact analysis
- Classifies change type
- Flags high-risk changes
- Recommends phase splitting
- Hands off to Tactician with analysis

### Tactician

- Receives impact analysis from Architect
- Defines phase sequence
- Plans validation checkpoints
- Creates execution strategy
- Hands off to PromptEngineer with phase plan

### PromptEngineer

- Receives phase plan from Tactician
- Creates Builder prompt with:
  - Change classification
  - Predicted breaking changes
  - Validation checklist
  - Phase boundaries (if split)

### Builder

- Implements one phase at a time
- Follows validation checklist
- Reports unexpected breaks
- Hands off to Enforcer after each phase

### Enforcer

- Validates against checklist
- Checks predicted breaking changes were addressed
- Verifies no unexpected breaks
- Approves phase or escalates


