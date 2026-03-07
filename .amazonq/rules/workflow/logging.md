# Workflow Logging Specification

## CRITICAL: MANDATORY for All Profiles

**All profiles that reference this file MUST:**
- Log workflow_start on activation
- Log key events (file changes, handoffs, test results, user interactions)
- Use fsWrite append to `.amazonq/workflow.log`
- Follow JSONL format specified below

**This is not optional. Logging enables retrospective analysis and workflow improvement.**

---

## Purpose

Track workflow execution to enable retrospective analysis of:
- System behavior (drift, corrections, broken tests, fixes)
- User behavior (clarification requests, information gathering)
- Improvement opportunities for both AI and user

## Log Location

`.amazonq/workflow.log` (JSONL format)

## Event Types

### 1. Workflow Start

```typescript
{
  type: "workflow_start";
  id: string;              // Auto-generated UUID
  parentId?: string;       // Set if nested workflow
  timestamp: string;       // ISO 8601
  trigger: "user" | "handoff";
  profile: string;         // Profile name
  goal: string;            // Extracted from "As Profile, [goal]"
}
```

**When to log:**
- User activates a profile with explicit goal
- Profile receives handoff from another profile

### 2. Event

```typescript
{
  type: "event";
  workflowId: string;      // Links to workflow_start.id
  timestamp: string;       // ISO 8601
  source: "system" | "user";
  actor: string;           // Profile name or "user"
  eventType: string;       // See Event Types below
  what: string;            // Brief description
  why: string;             // Reason or context
  context?: object;        // Additional structured data
}
```

## Event Types

### System Events
- `profile_activated` - Profile started work
- `file_modified` - File changed
- `file_created` - New file created
- `test_failed` - Test failure detected
- `test_fixed` - Test failure resolved
- `drift_detected` - Code doesn't follow patterns
- `drift_corrected` - Drift fixed
- `validation_failed` - Enforcer found issues
- `validation_passed` - Enforcer approved
- `handoff_sent` - Work passed to another profile
- `handoff_received` - Work received from another profile
- `escalation` - Doctor escalated issue
- `blocker` - Work blocked, needs resolution

### User Events
- `clarification_requested` - User asked for more info
- `confirmation_given` - User approved changes
- `confirmation_denied` - User rejected changes
- `direction_changed` - User changed requirements
- `information_provided` - User answered question

## How to Log

Profiles must use `fsWrite` with `append` command to add JSONL entries to `.amazonq/workflow.log`.

### Workflow Start Logging

When a profile is activated with an explicit goal, append a workflow_start entry:

```typescript
fsWrite({
  command: "append",
  path: "/home/tburton/IdeaProjects/hukdzen/.amazonq/workflow.log",
  fileText: JSON.stringify({
    type: "workflow_start",
    id: "wf-" + Date.now(),  // Simple unique ID
    timestamp: new Date().toISOString(),
    trigger: "user",
    profile: "ProfileName",
    goal: "extracted goal from user request"
  }) + "\n"
});
```

### Event Logging

When significant events occur, append an event entry:

```typescript
fsWrite({
  command: "append",
  path: "/home/tburton/IdeaProjects/hukdzen/.amazonq/workflow.log",
  fileText: JSON.stringify({
    type: "event",
    workflowId: "wf-123",  // Use current workflow ID
    timestamp: new Date().toISOString(),
    source: "system",
    actor: "ProfileName",
    eventType: "file_modified",
    what: "Updated file.ts",
    why: "Added new feature"
  }) + "\n"
});
```

### When to Log

**Workflow Start:**
- Profile activated with explicit goal ("As Profile, do X")
- Profile receives handoff from another profile

**Events:**
- Before/after file modifications
- Test failures and fixes
- Validation results
- Handoffs sent/received
- Escalations
- User clarifications

## Example Log Entries

```jsonl
{"type":"workflow_start","id":"wf-001","timestamp":"2024-01-15T10:30:00Z","trigger":"user","profile":"Architect","goal":"update profiles to add TestDesigner"}
{"type":"event","workflowId":"wf-001","timestamp":"2024-01-15T10:31:00Z","source":"system","actor":"Architect","eventType":"file_modified","what":"Updated _PROFILES.md","why":"Replaced Tester with TestDesigner"}
{"type":"event","workflowId":"wf-001","timestamp":"2024-01-15T10:32:00Z","source":"system","actor":"Architect","eventType":"file_created","what":"Created profiles/test-designer.md","why":"Define TestDesigner behavior"}
{"type":"event","workflowId":"wf-001","timestamp":"2024-01-15T10:33:00Z","source":"user","actor":"user","eventType":"clarification_requested","what":"Asked about Gherkin format","why":"Wanted scenarios easily convertible to Gherkin"}
{"type":"event","workflowId":"wf-001","timestamp":"2024-01-15T10:34:00Z","source":"system","actor":"Architect","eventType":"file_modified","what":"Updated test-designer.md","why":"Added Gherkin-compatible output format requirement"}
```

## Retrospective Analysis

Retro profile reads workflow.log and analyzes:
- Workflow nesting depth
- Handoff frequency
- Clarification frequency
- Fix/correction frequency
- Blocker patterns
- Decision quality

Output: Keep/Stop/Start recommendations
