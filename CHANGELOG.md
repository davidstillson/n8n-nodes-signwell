# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-07-23

### Added
- **Webhook Triggers** integrated into the main SignWell node
  - Listen for real-time SignWell events (document created, sent, signed, completed, etc.)
  - Automatic workflow triggering when document activities occur
  - HMAC-SHA256 hash verification for security
  - Event filtering to only process selected event types
  - Unified interface - no separate trigger node needed
- **Webhook Management** operations
  - List all registered webhooks
  - Create new webhook registrations
  - Delete webhook registrations
- Comprehensive webhook documentation and examples

### Changed
- Unified node design combining regular operations and webhook triggers
- Enhanced node to support both transform and trigger modes
- Updated documentation to reflect integrated webhook functionality

## [1.3.1] - 2024-07-23

### Changed
- Comprehensive README and changelog documentation updates
- Added "What's New" section highlighting latest features and capabilities
- Enhanced feature comparison table with clear use case examples
- Improved version history and migration guidance for users
- Updated documentation structure for better readability and navigation

## [1.3.0] - 2024-07-23

### Added
- **Attachment Requests** feature for document creation from templates
  - Recipients can be required to upload files during signing process
  - Configurable attachment names (e.g., "Driver's License", "Insurance Certificate")
  - Per-recipient attachment assignment via `recipient_id` field
  - Optional/required attachment settings with `required` boolean flag
  - Attachments displayed after all document fields are completed
- Enhanced documentation with attachment requests examples
- Updated test files to validate attachment requests functionality
- Updated workflow examples demonstrating attachment requests usage

### Changed
- Enhanced API structure examples to include all supported features
- Improved feature documentation with clear distinctions between variables, fields, and attachments

## [1.2.0] - 2024-07-22

### Added
- **Template Fields** feature for pre-filling form fields in documents
  - Pre-fill date fields, text inputs, checkboxes, and other form elements
  - Support for `api_id` and `value` field mapping
  - Full n8n variable expression support for dynamic field values
  - Separate functionality from template variables for actual form field values

### Fixed
- Recipients structure now uses `placeholder_name` (singular) instead of `placeholder_names` (plural)
- Improved API compatibility with SignWell specification
- Each recipient now supports single placeholder assignment

### Changed
- Enhanced documentation with clear distinction between Template Variables vs Template Fields vs Attachment Requests
- Updated examples to demonstrate proper usage of all features
- Added template fields testing and validation

## [1.1.1] - 2024-07-20

### Fixed
- Recipients API compatibility issue with SignWell template placeholders
- Proper API compliance with required recipient structure

### Added
- Required `id` field for recipients
- Optional `placeholder_name` field for mapping recipients to template placeholders

### Changed
- Updated documentation and examples with correct recipient structure
- Cleaned up unused imports and variables

## [1.1.0] - 2024-07-15

### Changed
- **BREAKING CHANGE**: Combined SignWell Documents and Templates into single unified SignWell node
- **BREAKING CHANGE**: Updated recipients structure to include required `id` field and optional `placeholder_name` field
- Improved user experience with resource-based operation selection (Document/Template)
- Cleaner package structure with single node registration

### Fixed
- Recipients API compatibility issues with SignWell template placeholders

### Added
- Unified node interface for better user experience
- Maintained all existing functionality from both previous nodes

## [1.0.0] - 2024-07-01

### Added
- Initial release of n8n-nodes-signwell
- SignWell Documents node with the following operations:
  - Create Document from Template
  - Get Document
  - Delete Document
  - Get Completed PDF
  - Send Reminder
- SignWell Templates node with the following operations:
  - Get Template
  - Create Template
  - Update Template
  - Delete Template
- SignWell API credentials node with API key authentication
- Comprehensive error handling and validation
- Test mode support for development and testing
- Rate limiting awareness and proper error messages
- Complete TypeScript implementation
- Comprehensive documentation and examples
- RV rental workflow example demonstrating real-world usage

### Features
- Full SignWell API v1 integration
- Support for template variables and dynamic content
- Multiple recipient support for document signing
- Base64 file upload support for template creation
- Proper n8n node conventions and best practices
- Extensive input validation and error handling
- Test mode for safe development and testing

### Documentation
- Complete README with installation and usage instructions
- API reference documentation
- Contributing guidelines
- Example workflows for common use cases
- Inline code documentation and TypeScript types

### Technical
- TypeScript implementation with full type safety
- ESLint and Prettier configuration for code quality
- Gulp build process for asset management
- Proper npm package configuration for n8n community nodes
- MIT license for open source usage
