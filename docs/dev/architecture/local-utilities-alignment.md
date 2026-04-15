# Local-Utilities Alignment - Purpose

## Purpose

`Local-Utilities/` is a standalone Node project used for:
- Running content extraction logic locally
- Running orthography conversion locally
- Debugging ingestion and conversion without redeploying Lambdas
- Verifying that ingestion + conversion outputs match frontend expectations

**It directly imports production code to ensure parity.**
