# Q Profile Handoff System

## Overview

Coordinate work between Q profiles without copy/paste using shared context files.

---

## Workflow

1. **Start work:** `@prompt start`
2. **Work with profile** (normal back-and-forth)
3. **End work:** `@prompt handoff next=NextProfile`
4. **Next profile:** `@prompt start`

---

## Example Session

**Chat 1 - Builder:**
```
You: @prompt start
Builder: [reads HANDOFF.md, acts as Builder]
[... work happens ...]
You: @prompt handoff next=Tester
Builder: [writes to HANDOFF.md]
```

**Chat 2 - Tester:**
```
You: @prompt start
Tester: [reads HANDOFF.md, acts as Tester]
[... testing happens ...]
You: @prompt handoff next=Verifier
Tester: [writes to HANDOFF.md]
```

**Chat 3 - Verifier:**
```
You: @prompt start
Verifier: [reads HANDOFF.md, reviews work]
Verifier: ✅ All checks pass
```

---

## Files

- `.amazonq/prompts/` - Prompt templates (version controlled)
- `.amazonq/work/HANDOFF.md` - Current handoff (gitignored, ephemeral)
- `.amazonq/work/README.md` - This file (version controlled)
- `~/.aws/amazonq/prompts/` - Active prompts (user-specific)

---

## Profiles

- **Builder** - Implements features
- **Tester** - Writes tests
- **Verifier** - Reviews code
- **Enforcer** - Validates compliance
- **Documentor** - Writes documentation
- **Architect** - Designs systems
- **Analyst** - Explains code

See `.amazonq/rules/_PROFILES.md` for full profile definitions.

---

## Setup

See `.amazonq/prompts/README.md` for prompt installation instructions.
