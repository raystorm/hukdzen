# Local-Utilities Alignment

## GUIDANCE: Keep Local-Utilities in Sync

### Purpose

`Local-Utilities/` is a standalone Node project used for:
- Running content extraction logic locally
- Running orthography conversion locally
- Debugging ingestion and conversion without redeploying Lambdas
- Verifying that ingestion + conversion outputs match frontend expectations

**It directly imports production code to ensure parity.**

---

## Synchronization Requirement

Local‑Utilities **mirrors** the following logic from the backend:

- Extraction logic
- Orthography conversion logic
- Document normalization rules
- Duplicate detection rules

**When you change any of these in the backend, verify Local-Utilities still works.**

The app is built to import shared code to keep things in sync.

---

## Orthography Converter (Translator)

Even though the folder is named **Translator**, the behavior is:

### BC Orthography ↔ AK Orthography

- Same language (Smalgyax)
- No semantic translation
- Deterministic
- Reversible
- Rule‑based

Local‑Utilities must support:
- BC → AK
- AK → BC

This ensures alignment across:
- Frontend translator hooks
- Backend ingestion
- Local‑Utilities
- docs domain

---

## Testing with Local-Utilities

Use `Local-Utilities/` to test:
- Document extraction before deploying Lambda changes
- Orthography conversion rules
- Metadata normalization
- Duplicate detection logic

This allows rapid iteration without cloud deployments.

---

## testFiles/ Fixtures

`testFiles/` at the root contains real document fixtures used for:
- Ingestion testing  
- Extraction validation  
- Hashing and duplicate‑detection tests  
- Local‑Utilities  
- ingestTrigger parity tests  

**Rules:**
- Do not move or rename this folder  
- Do not add unrelated files  
- Do not delete existing fixtures  
- Do not import these files into runtime code  

It exists at the root so ingestion tools can access it without involving the frontend build system.
