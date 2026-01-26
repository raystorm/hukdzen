# Versioning and Release Process

## Semantic Versioning

This project follows [Semantic Versioning 2.0.0](https://semver.org/):

**MAJOR.MINOR.PATCH** (e.g., 1.2.3)

- **MAJOR**: Breaking changes (incompatible API changes, major infrastructure changes)
- **MINOR**: New features (backward-compatible functionality)
- **PATCH**: Bug fixes (backward-compatible fixes)

## Version Guidelines

### MAJOR (1.0.0 → 2.0.0)
- Amplify Gen 1 → Gen 2 migration
- Breaking API changes
- Major authentication changes
- Database schema breaking changes

### MINOR (1.0.0 → 1.1.0)
- New features (email notifications, new pages, new APIs)
- New infrastructure components
- Epic completions

### PATCH (1.0.0 → 1.0.1)
- Bug fixes
- Security patches
- Performance improvements
- Documentation updates

## Release Process

### 1. Update CHANGELOG.md
```bash
# Move changes from [Unreleased] to new version section
# Add release date
# Update comparison links at bottom
```

### 2. Commit Changes
```bash
git add CHANGELOG.md
git commit -m "chore: prepare release v1.0.0"
git push
```

### 3. Create Tag
```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0 - Email Infrastructure (Epic 9)"

# Push tag
git push origin v1.0.0
```

### 4. Deploy to Production
```bash
amplify publish --yes
```

### 5. Verify Deployment
- Check application works
- Monitor CloudWatch logs
- Verify new features functional

## Current Version

**v1.3.0** - Box Requests & Email Infrastructure (Epic 9)

## Version History

- **v1.0.0** - Duplicate upload checking (production-ready)
- **v1.1.0** - Browse feature
- **v1.2.0** - Collections, Vite migration, test improvements
- **v1.3.0** - Box requests & email infrastructure (Epic 9)

## Next Versions (Planned)

- **v1.4.0** - Epic 10 (TBD)
- **v1.5.0** - Epic 11 (TBD)
- **v2.0.0** - Amplify Gen 2 Migration (Epic 6)

## Tag Naming Convention

- Production releases: `v1.0.0`
- Pre-releases: `v1.0.0-rc.1`, `v1.0.0-beta.1`
- Development: Use branch names, not tags

## GitHub Releases

After creating a tag, create a GitHub Release:

1. Go to: https://github.com/yourusername/hukdzen/releases/new
2. Select the tag
3. Copy content from CHANGELOG.md for that version
4. Publish release

## Hotfix Process

For urgent production fixes:

```bash
# Create hotfix branch from main
git checkout -b hotfix/v1.0.1 main

# Make fixes
# Update CHANGELOG.md with [1.0.1] section

# Commit and tag
git commit -m "fix: critical bug description"
git tag -a v1.0.1 -m "Hotfix v1.0.1 - Critical bug fix"

# Merge back to main
git checkout main
git merge hotfix/v1.0.1
git push origin main v1.0.1

# Deploy
amplify publish --yes
```

## Notes

- Always update CHANGELOG.md before tagging
- Use annotated tags (`-a`) for releases
- Tag message should summarize the release
- Deploy immediately after tagging
- Monitor for 24 hours after release
