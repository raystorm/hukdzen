# Sandbox Utilities

Scripts for seeding and managing sandbox environments.

## Quick Start (Auto-Seed)

```bash
# One command to start sandbox and auto-seed test data
./amplify/sandbox/start-sandbox.sh --profile dev
```

This will:
1. Start the sandbox
2. Wait for deployment
3. Automatically run any seed scripts that exist
4. Keep sandbox running

## Manual Setup
1. Copy the example script:
   ```bash
   cp amplify/sandbox/seed-users.example.sh amplify/sandbox/seed-users.sh
   ```

2. Edit `amplify/sandbox/seed-users.sh` to customize:
   - User emails and passwords
   - Add/remove users as needed

3. Start your sandbox:
   ```bash
   AWS_REGION=us-east-1 npx ampx sandbox
   ```

4. Run the seed script:
   ```bash
   chmod +x amplify/sandbox/seed-users.sh
   ./amplify/sandbox/seed-users.sh
   ```

The script auto-extracts User Pool ID and region from `amplify_outputs.json`.

## Document Seeding

Coming soon: Scripts to seed test documents, boxes, and collections.

## Notes
- All `seed-*.sh` scripts are gitignored to prevent committing credentials
- Sandbox resources are temporary - data is deleted when sandbox is destroyed
- For persistent data, use the deployed dev environment instead of sandbox
