# File Operations Rationale

## Batching File Operations

### Why Batch Multiple Files

Batching multiple files into single fsRead calls reduces user confirmation clicks.

**Why:**
- fsRead requires user confirmation per call
- Reading files one at a time = one confirmation per file
- Batching 10-20 files per call = 10-20x fewer confirmations
- Significantly improves user experience for large-scale operations

**Result:** 3 confirmations instead of 30+ for large-scale operations.

## Git File Renames

### Why Use git mv

Using `git mv` instead of regular `mv` preserves git history.

**Why:**
- Preserves git history and file lineage
- Git tracks the rename operation explicitly
- Enables `git log --follow` to trace file history across renames
- Prevents git from treating rename as delete + add
