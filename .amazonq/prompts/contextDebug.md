Generate the full verbose Context Status block.

Infer all fields using only the information available in the current context window.
Do not rely on external rules or system extensions.

=== Classification Logic ===

Profile Lane:
- "Stable" if the assistant's tone, role, and behavior match the active Profile and do not show generic-assistant fallback, builder-mode phrasing, or helper-mode overreach.
- "Flicker Detected" if any sudden tone shift, generic disclaimers, builder-style language, or Profile inconsistency appears.

Workflow Lineage:
- "Intact" if the workflow ID in HANDOFF.md matches the workflow ID in MESSAGE.md.
- "Reinterpreted" if the workflow ID appears regenerated, altered, or inconsistent.
- "Missing" if no workflow ID is present.

Handoff Integrity:
- "Valid" if exactly one HANDOFF.md is present and structurally complete.
- "Missing" if no HANDOFF.md is detected.
- "Multiple" if more than one HANDOFF-like structure appears.

Rule Density:
- "Low" if rules are short, atomic, and free of examples, rationale, or ceremony.
- "Normal" if rules are clean but moderately sized.
- "High" if rules contain examples, rationale, ceremony, or exceed typical token length.

Semantic Drift Risk:
- "Low" if Profile is stable, lineage intact, handoff valid, and density low/normal.
- "Medium" if any single subsystem shows instability.
- "High" if Profile flicker, lineage reinterpretation, high density, or missing/multiple handoffs are detected.

Rule Category Breakdown:
- Count how many loaded rule files belong to each category.
- Compute each category’s percentage as:
  (filesInCategory / totalRuleFiles) * 100
- Round to the nearest whole number.
- Present categories in descending percentage order 
- If a category has 0 files, omit it.
- print results in a bulleted list, one per line, with 2 leading spaces
- on each line print category name, file count, %

=== Output Format ===

Return only this block, populated with inferred values:

=== Context Status ===

Profile: {{profileName}}
WorkflowId: {{workflowId}}

--- Load Summary ---
Rules Loaded: {{ruleFileCount}} files
Rule Categories: {{ruleCategories}}
Non-Rule Files Loaded: {{nonRuleFileCount}}

--- Context Metrics ---
Context Usage: {{contextPercent}}%
Context Sources:
- Rules: {{rulesPercent}}%
- Rule Category Breakdown:
  {{ruleCategoryBreakdown}}
- HANDOFF: {{handoffPercent}}%
- User Message: {{userPercent}}%
- System/Profile: {{systemPercent}}%

--- Stability Signals ---
Profile Lane: {{ProfileLaneStatus}}
Workflow Lineage: {{workflowLineageStatus}}
Handoff Integrity: {{handoffIntegrityStatus}}
Rule Density: {{ruleDensityStatus}}
Semantic Drift Risk: {{driftRiskStatus}}

--- System Flags ---
Unexpected Files: {{unexpectedFiles}}

======================

Do not add commentary or explanation.
Return only the block.
