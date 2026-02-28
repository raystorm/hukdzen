# Q Saved Prompts

## Installation

Copy prompt templates to your global prompts directory:

```bash
cp .amazonq/prompts/*.md ~/.aws/amazonq/prompts/
```

---

## Available Prompts

### `@prompt start`
Reads `.amazonq/work/HANDOFF.md` and activates the profile specified in "To:" field.

### `@prompt handoff next=ProfileName`
Writes handoff for next profile to `.amazonq/work/HANDOFF.md`.

**Examples:**
```
@prompt handoff next=Tester
@prompt handoff next=Verifier
@prompt handoff next=Builder
```

### `@prompt epr`
Enforcer reviews prompt and response for rule compliance.

---

## Usage

See `.amazonq/work/README.md` for the complete handoff system workflow.
