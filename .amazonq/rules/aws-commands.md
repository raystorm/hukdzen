# AWS Command Execution

## Command Execution
- User runs all AWS CLI commands directly
- User runs all npm/npx commands directly
- Do not use executeBash for AWS CLI or npm/npx commands
- Provide the command for the user to run
- Wait for user to provide the output
- Regular shell commands (mv, rm, touch, ls, etc.) can be run with executeBash

