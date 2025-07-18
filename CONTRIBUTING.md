# Contributing to n8n-nodes-signwell

Thank you for your interest in contributing to the SignWell n8n integration! This document provides guidelines for contributing to this project.

## Development Setup

### Prerequisites

- Node.js 18.10 or higher
- pnpm 8.1 or higher
- n8n instance for testing

### Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/davidstillson/n8n-nodes-signwell.git
cd n8n-nodes-signwell
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the project:
```bash
pnpm build
```

4. Link to your n8n instance for testing:
```bash
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-signwell
```

## Development Workflow

### Making Changes

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the coding standards
3. Test your changes thoroughly
4. Run linting and formatting:
```bash
pnpm lint
pnpm format
```

5. Build the project:
```bash
pnpm build
```

### Testing

- Test all operations with both valid and invalid inputs
- Test error handling scenarios
- Test with both test mode and production mode
- Verify rate limiting behavior
- Test with different SignWell account configurations

### Code Style

- Use TypeScript for all code
- Follow the existing code structure and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Follow n8n node development best practices

## Submitting Changes

### Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add or update tests for new functionality
4. Ensure all tests pass
5. Update the CHANGELOG.md with your changes
6. Submit a pull request with a clear description

### Pull Request Guidelines

- Use a clear and descriptive title
- Describe what changes you made and why
- Reference any related issues
- Include screenshots for UI changes
- Ensure CI checks pass

## Adding New Features

### New Operations

When adding new SignWell API operations:

1. Add the operation to the appropriate node (Documents or Templates)
2. Add proper parameter validation
3. Add comprehensive error handling
4. Update the README with usage examples
5. Test thoroughly with the SignWell API

### New Nodes

If adding entirely new nodes:

1. Follow the existing node structure
2. Add proper credentials integration
3. Include comprehensive documentation
4. Add the node to package.json n8n configuration
5. Create appropriate icons and resources

## Documentation

- Update README.md for user-facing changes
- Update inline code documentation
- Add examples for new features
- Keep API reference up to date

## Issue Reporting

When reporting issues:

- Use the issue templates
- Provide clear reproduction steps
- Include relevant error messages
- Specify your n8n and node versions
- Include SignWell API responses if relevant

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the n8n community guidelines

## Questions?

If you have questions about contributing:

- Check the existing documentation
- Search existing issues and discussions
- Ask in the n8n community forum
- Open a discussion on GitHub

Thank you for contributing to make SignWell integration better for everyone!
