# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

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
