# n8n-nodes-signwell

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node package that provides integration with the [SignWell API](https://www.signwell.com/api/) for electronic document signing and template management.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-signwell` as the npm package name
4. Agree to the risks of using community nodes
5. Select **Install**

### Manual Installation

To install the node locally for development:

```bash
# Clone the repository
git clone https://github.com/davidstillson/n8n-nodes-signwell.git
cd n8n-nodes-signwell

# Install dependencies
pnpm install

# Build the package
pnpm build

# Link to your n8n installation
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-signwell
```

## Prerequisites

You need a SignWell account and API key to use this node. You can get your API key from your SignWell account under **Settings > API**.

## Credentials

This package includes a **SignWell API** credential type. Configure it with:

- **API Key**: Your SignWell API key
- **Test Mode**: Enable for testing (optional)
- **Base URL**: SignWell API base URL (default: `https://www.signwell.com/api/v1`)

## Nodes

### SignWell

A unified node for interacting with the SignWell API, supporting both document and template operations.

#### Resources

The SignWell node provides two main resources:

##### Documents

Interact with SignWell documents for electronic signing.

**Operations:**
- **Create From Template**: Create a new document from an existing template (supports recipients, template variables, template fields, and attachment requests)
- **Get**: Retrieve document information
- **Delete**: Delete a document
- **Get Completed PDF**: Download the completed signed PDF
- **Send Reminder**: Send a signing reminder to recipients

**Create From Template Example:**

```json
{
  "template_id": "template_123",
  "draft": false,
  "test_mode": false,
  "recipients": [
    {
      "id": "recipient_1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "signer",
      "placeholder_names": ["renter", "customer"]
    }
  ],
  "template_variables": {
    "customer_name": "John Doe",
    "rental_dates": "2024-01-15 to 2024-01-22",
    "total_amount": "$1,250.00"
  },
  "template_fields": [
    {
      "api_id": "start_date",
      "value": "2024-01-15"
    },
    {
      "api_id": "end_date",
      "value": "2024-01-22"
    }
  ],
  "attachment_requests": [
    {
      "name": "Driver's License",
      "recipient_id": "recipient_1",
      "required": true
    },
    {
      "name": "Insurance Certificate",
      "recipient_id": "recipient_1",
      "required": false
    }
  ]
}
```

**Template Variables vs Template Fields vs Attachment Requests:**

- **Template Variables**: Used for text replacement in the document content (e.g., replacing `{{customer_name}}` placeholders in the document text)
- **Template Fields**: Used to pre-fill form fields in the document (e.g., setting values for date fields, text inputs, checkboxes, etc.)
- **Attachment Requests**: Used to request file uploads from recipients during the signing process (e.g., driver's license, insurance certificates, etc.)

##### Templates

Manage SignWell document templates.

**Operations:**
- **Get**: Retrieve template information
- **Create**: Create a new template
- **Update**: Update an existing template
- **Delete**: Delete a template

**Create Template Example:**

```json
{
  "name": "RV Rental Agreement",
  "file": "base64_encoded_pdf_data",
  "filename": "rv-rental-agreement.pdf",
  "test_mode": false
}
```

## Usage Examples

### RV Rental Management Workflow

This package is designed to integrate with RV rental management systems. Here's a typical workflow:

1. **Customer Books RV** → Triggers n8n workflow
2. **Admin Approves Booking** → Triggers document creation
3. **Create Document From Template** → Uses SignWell Documents node
4. **Send for Signing** → Document automatically sent to customer
5. **Monitor Completion** → Use webhooks to track signing status

### Example Workflow: Create Rental Agreement

```json
{
  "nodes": [
    {
      "name": "Create Rental Agreement",
      "type": "n8n-nodes-signwell.signWell",
      "parameters": {
        "resource": "document",
        "operation": "createFromTemplate",
        "templateId": "{{ $json.template_id }}",
        "draft": false,
        "recipients": {
          "recipient": [
            {
              "id": "recipient_1",
              "name": "{{ $json.customer_name }}",
              "email": "{{ $json.customer_email }}",
              "role": "signer",
              "placeholder_names": "renter, customer"
            }
          ]
        },
        "templateVariables": "{{ JSON.stringify($json.rental_details) }}",
        "templateFields": {
          "field": [
            {
              "api_id": "start_date",
              "value": "{{ $json.start_date }}"
            },
            {
              "api_id": "end_date",
              "value": "{{ $json.end_date }}"
            }
          ]
        },
        "attachmentRequests": {
          "attachmentRequest": [
            {
              "name": "Driver's License",
              "recipient_id": "recipient_1",
              "required": true
            },
            {
              "name": "Insurance Certificate",
              "recipient_id": "recipient_1",
              "required": false
            }
          ]
        }
      }
    }
  ]
}
```

## API Reference

This package implements the following SignWell API endpoints:

### Documents
- `POST /document_templates/documents` - Create document from template
- `GET /documents/{id}` - Get document
- `DELETE /documents/{id}` - Delete document
- `GET /documents/{id}/completed_pdf` - Get completed PDF
- `POST /documents/{id}/remind` - Send reminder

### Templates
- `GET /document_templates/{id}` - Get template
- `POST /template` - Create template
- `PUT /document_templates/{id}` - Update template
- `DELETE /document_templates/{id}` - Delete template

## Error Handling

The nodes include comprehensive error handling:

- **API Errors**: Properly formatted error messages from SignWell API
- **Validation Errors**: Input validation with helpful error messages
- **Network Errors**: Retry logic and timeout handling
- **Continue on Fail**: Option to continue workflow execution on errors

## Test Mode

SignWell provides a test mode for development and testing:

- Test mode requests don't count against your quota
- Documents created in test mode are not actually sent
- Perfect for workflow development and testing

Enable test mode in the credential configuration or per-operation.

## Rate Limits

SignWell API has the following rate limits:

- **General requests**: 100 requests per 60 seconds
- **Test mode**: 20 requests per minute
- **Document/template creation**: 30 requests per minute

The nodes automatically handle rate limiting with appropriate error messages.

## Support

- [SignWell API Documentation](https://developers.signwell.com/)
- [n8n Community Forum](https://community.n8n.io/)
- [GitHub Issues](https://github.com/davidstillson/n8n-nodes-signwell/issues)

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests to the GitHub repository.

## License

[MIT](LICENSE.md)

## Changelog

### 1.1.1
- Fixed recipients API compatibility issue with SignWell template placeholders
- Added required `id` field for recipients
- Added optional `placeholder_names` field for mapping recipients to template placeholders
- Updated documentation and examples with correct recipient structure
- Cleaned up unused imports and variables

### 1.1.0
- **BREAKING CHANGE**: Combined SignWell Documents and Templates into a single unified SignWell node
- **BREAKING CHANGE**: Updated recipients structure to include required `id` field and optional `placeholder_names` field
- Improved user experience with resource-based operation selection (Document/Template)
- Fixed recipients API compatibility issues with SignWell template placeholders
- Maintained all existing functionality from both previous nodes
- Updated documentation to reflect new combined node structure and recipient format
- Cleaner package structure with single node registration

### 1.0.0
- Initial release
- SignWell Documents node with all major operations
- SignWell Templates node with CRUD operations
- Comprehensive error handling and validation
- Test mode support
- Rate limiting awareness
