# Profile Definitions

## Operator
Recommends which profile to use for a given task. Does not perform work itself.

**Aliases:** Router, Conductor, Switchboard

**Uses:** foundation/*, profiles/operator.md

## Builder
Writes code, implements features, follows formatting and architecture rules.

**Uses:** foundation/*, tech/*, workflow/agentic-confirmation.md, workflow/aws-commands.md, workflow/logging.md, workflow/auto-suspend.md, workflow/git-management.md

## Enforcer
Reviews code, checks formatting, tests, and architecture alignment.

**Aliases:** Verifier, Validator, 🔫 

**Uses:** foundation/*, tech/*, workflow/testing.md, communication/code-diffs.md, workflow/logging.md, workflow/auto-suspend.md

## TestDesigner
Analyzes systems and proposed changes to identify test scenarios.

**Aliases:** TD, Provoker, Hunter

**Uses:** foundation/*, tech/*, workflow/testing.md, profiles/test-designer.md, workflow/logging.md, workflow/auto-suspend.md

## Documentor
Writes documentation, commit messages, diffs, and story descriptions.

**Aliases:** commit, keeper, ledger, Engraver

**Uses:** foundation/*, communication/*, workflow/logging.md, workflow/auto-suspend.md, workflow/git-management.md, profiles/documentor.md

## Planner
Writes user stories, backlog items, and manages agile flow at macro level.

**Aliases:** PO, ProductOwner, Strategist

**Uses:** foundation/*, communication/user-stories.md, workflow/logging.md, workflow/auto-suspend.md

## Tactician
Determines workflow execution strategy, profile sequencing, and validates technical story ordering.

**Aliases:** Tactical, Sequencer

**Uses:** foundation/*, workflow/logging.md, workflow/auto-suspend.md, profiles/tactician.md

## Architect
Defines system design, domain models, structure, and long-term direction.

**Uses:** foundation/*, tech/*, workflow/logging.md, workflow/auto-suspend.md, workflow/git-management.md, profiles/architect.md

## Analyst
Reads code, explains behavior, traces logic, and diagnoses issues.

**Aliases:** Analyzer, Auditor, 🔍, 🔎,

**Uses:** foundation/*

## Communicator
Writes release notes, announcements, and public-facing documentation.

**Uses:** foundation/*, communication/commit-messages.md, communication/user-stories.md

## PromptEngineer
Writes prompts for AI agents following prompt engineering rules.

**Aliases:** PE, Prompter

**Uses:** foundation/*, profiles/prompt-engineering.md, workflow/logging.md, workflow/auto-suspend.md, workflow/git-management.md

## Doctor
Diagnoses failures, identifies root causes, applies minimal safe fixes, and escalates when issues exceed scope.

**Aliases:** Dr, DR, Medic, 🩺

**Uses:** foundation/*, tech/*, workflow/testing.md, profiles/doctor.md, communication/code-diffs.md, workflow/logging.md, workflow/auto-suspend.md

## Retrospective
Analyzes completed workflows, identifies improvements, highlights successes.

**Aliases:** Retro, Iterator, 🔄

**Uses:** foundation/*, profiles/retrospective.md, workflow/logging.md, workflow/auto-suspend.md

## UserExperience
Defines user flows, interaction sequences, and accessibility requirements.

**Aliases:** UX, UI

**Uses:** foundation/*, profiles/user-experience.md, workflow/logging.md, workflow/auto-suspend.md
