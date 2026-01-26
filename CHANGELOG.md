# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-01-26

### Added
- **Box Requests & Email Infrastructure (Epic 9)**
  - Box request workflow (request access, approve/deny)
  - Box member management
  - Box permissions system
  - SES email sending with templated emails (BOX_REQUEST_SUBMITTED, BOX_REQUEST_APPROVED, BOX_REQUEST_DENIED)
  - Bounce and complaint handling via SNS
  - Unsubscribe functionality with JWT-based tokens
  - Email preferences management (System Announcements, Box Requests)
  - CloudWatch alarms for bounce/complaint rate monitoring
  - Custom domain for unsubscribe API (emailOptOut.api.smalgyax-files.org)
  - Email validation in OAuth authentication flow

### Changed
- Updated emailOptOutHandler to query users by userId instead of email (handles duplicate email accounts)
- Improved unsubscribe page UX with Enter key submit support

### Fixed
- Fixed OAuth login crashes when signInDetails is undefined
- Fixed Google OAuth login menu not updating after sign-in
- Fixed unsubscribe URL environment detection (dev vs prod)

### Infrastructure
- Lambda functions: emailNotifier-prod, emailOptOutHandler-prod
- API Gateway: emailOptOutApi-prod with CORS support
- SNS topics: ses-bounces-prod, ses-complaints-prod, ses-alarms-prod
- SES configuration set: hukdzen-prod
- CloudWatch alarms: SES-HighBounceRate-prod, SES-HighComplaintRate-prod

## [1.2.0] - Historical

### Added
- Collections feature
- Collection management and organization

### Changed
- **Build System**: Migrated from Create React App to Vite

### Improved
- Test improvements and optimizations
- Performance optimizations

## [1.1.0] - Historical

### Added
- Browse feature
- Document browsing interface

## [1.0.0] - Historical

### Added
- Duplicate upload checking
- Production-ready file upload system

### Fixed
- **Breaking bug fix**: Prevented duplicate document uploads

## [0.9.0] - Historical

### Added
- Initial Amplify Gen 1 application
- OpenID Connect authentication (Google, Facebook, Amazon)
- Document upload and storage (S3)
- Document search (OpenSearch)
- User management with Cognito groups
- Box (Xbiis) management for document sharing
- Multi-language support (English, Smalgyax BC/AK orthography)

[Unreleased]: https://github.com/yourusername/hukdzen/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/yourusername/hukdzen/releases/tag/v1.3.0
[1.2.0]: https://github.com/yourusername/hukdzen/releases/tag/v1.2.0
[1.1.0]: https://github.com/yourusername/hukdzen/releases/tag/v1.1.0
[1.0.0]: https://github.com/yourusername/hukdzen/releases/tag/v1.0.0
[0.9.0]: https://github.com/yourusername/hukdzen/releases/tag/v0.9.0
