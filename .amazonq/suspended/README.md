# Suspended Contexts

This folder contains suspended workflow contexts for multi-level workflows.

## Purpose

When working on features that split into multiple stories/cycles at different levels (Architect → Planner → Tactician), you can suspend context at each level and resume later.

## Commands

- `@suspend [name]` - Save current context
- `@resume [name]` - Load saved context
- `@list` - Show all suspended contexts

## Files

- `README.md` - This file (version controlled)
- `INDEX.md` - List of suspended contexts (git ignored)
- `[context-name].md` - Suspended context files (git ignored)
- Helper files referenced by context files (git ignored)

## Git Ignore

All files except README.md and .gitignore are git ignored to keep suspended contexts local.

## Use Cases

### Multi-Story Feature
1. Architect analyzes Feature X
2. `@suspend architect-feature-x`
3. Planner creates Story 1
4. Work on Story 1 (multiple tabs/cycles)
5. `@resume architect-feature-x`
6. Planner creates Story 2

### Multi-Phase Story
1. Planner creates Story with 3 phases
2. `@suspend planner-story-backend`
3. Work on Phase 1
4. `@resume planner-story-backend`
5. Work on Phase 2

### Context Recovery
1. Working on complex workflow
2. Accidentally close tab
3. `@list`
4. `@resume [context-name]`
5. Continue from checkpoint
