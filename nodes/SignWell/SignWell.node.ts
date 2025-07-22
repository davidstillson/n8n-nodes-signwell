import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { signWellApiRequest } from './GenericFunctions';

export class SignWell implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SignWell',
		name: 'signWell',
		icon: 'file:signwell.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with SignWell API for documents and templates',
		defaults: {
			name: 'SignWell',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'signWellApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
						description: 'Work with SignWell documents',
					},
					{
						name: 'Template',
						value: 'template',
						description: 'Work with SignWell templates',
					},
				],
				default: 'document',
			},

			// Document Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Create From Template',
						value: 'createFromTemplate',
						description: 'Create a new document from a template',
						action: 'Create a document from template',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a document',
						action: 'Get a document',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
						action: 'Delete a document',
					},
					{
						name: 'Get Completed PDF',
						value: 'getCompletedPdf',
						description: 'Get the completed PDF of a document',
						action: 'Get completed PDF of a document',
					},
					{
						name: 'Send Reminder',
						value: 'sendReminder',
						description: 'Send a reminder for document signing',
						action: 'Send reminder for document signing',
					},
				],
				default: 'createFromTemplate',
			},

			// Template Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['template'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a template',
						action: 'Get a template',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new template',
						action: 'Create a template',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a template',
						action: 'Update a template',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a template',
						action: 'Delete a template',
					},
				],
				default: 'get',
			},

			// Document Parameters - Create From Template
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['createFromTemplate'],
					},
				},
				default: '',
				description: 'The ID of the template to create the document from',
			},
			{
				displayName: 'Draft',
				name: 'draft',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['createFromTemplate'],
					},
				},
				default: false,
				description: 'Whether to create the document as a draft (not sent for signing)',
			},
			{
				displayName: 'Test Mode',
				name: 'testMode',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['createFromTemplate'],
					},
				},
				default: false,
				description: 'Whether to create the document in test mode',
			},
			{
				displayName: 'Recipients',
				name: 'recipients',
				placeholder: 'Add Recipient',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['createFromTemplate'],
					},
				},
				default: {},
				options: [
					{
						name: 'recipient',
						displayName: 'Recipient',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								required: true,
								default: '',
								description: 'Unique identifier for the recipient (e.g., "recipient_1", "recipient_2")',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'The name of the recipient',
							},
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								placeholder: 'name@email.com',
								default: '',
								description: 'The email address of the recipient',
							},
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								options: [
									{
										name: 'Signer',
										value: 'signer',
									},
									{
										name: 'Viewer',
										value: 'viewer',
									},
								],
								default: 'signer',
								description: 'The role of the recipient',
							},
							{
								displayName: 'Placeholder Name',
								name: 'placeholder_name',
								type: 'string',
								default: '',
								description: 'The name of the placeholder you want this recipient assigned to (e.g., "renter" or "document sender")',
							},
						],
					},
				],
				description: 'Recipients who will receive the document for signing',
			},
			{
				displayName: 'Template Variables',
				name: 'templateVariables',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['createFromTemplate'],
					},
				},
				default: '{}',
				description: 'Template variables to populate in the document as JSON object',
			},

			// Document Parameters - Get, Delete, Get Completed PDF, Send Reminder
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'delete', 'getCompletedPdf', 'sendReminder'],
					},
				},
				default: '',
				description: 'The ID of the document',
			},

			// Document Parameters - Send Reminder specific
			{
				displayName: 'Recipient Email',
				name: 'recipientEmail',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['sendReminder'],
					},
				},
				default: '',
				description: 'The email address of the recipient to send the reminder to',
			},

			// Template Parameters - Get, Update, Delete
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the template',
			},

			// Template Parameters - Create
			{
				displayName: 'Template Name',
				name: 'templateName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the template',
			},
			{
				displayName: 'File Data',
				name: 'fileData',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Base64 encoded file data for the template document',
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The file name (e.g., "contract-template.pdf")',
			},

			// Template Parameters - Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Template Name',
						name: 'templateName',
						type: 'string',
						default: '',
						description: 'The new name for the template',
					},
					{
						displayName: 'File Data',
						name: 'fileData',
						type: 'string',
						default: '',
						description: 'Base64 encoded file data to replace the template document',
					},
					{
						displayName: 'File Name',
						name: 'fileName',
						type: 'string',
						default: '',
						description: 'The new file name (e.g., "updated-contract.pdf")',
					},
				],
			},

			// Template Parameters - Test Mode for Create/Update
			{
				displayName: 'Test Mode',
				name: 'testMode',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['template'],
						operation: ['create', 'update'],
					},
				},
				default: false,
				description: 'Whether to create/update the template in test mode',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				// Document operations
				if (resource === 'document') {
					if (operation === 'createFromTemplate') {
						// Create Document From Template operation
						const templateId = this.getNodeParameter('templateId', i) as string;
						const draft = this.getNodeParameter('draft', i, false) as boolean;
						const testMode = this.getNodeParameter('testMode', i, false) as boolean;

						const body: any = {
							template_id: templateId,
							draft,
						};

						if (testMode) {
							body.test_mode = true;
						}

						// Add recipients if provided
						const recipientsData = this.getNodeParameter('recipients', i, {}) as any;
						if (recipientsData.recipient && recipientsData.recipient.length > 0) {
							body.recipients = recipientsData.recipient.map((_: any, recipientIndex: number) => {
								// Use getNodeParameter to properly resolve variables for each recipient field
								const recipientId = this.getNodeParameter(`recipients.recipient[${recipientIndex}].id`, i) as string;
								const recipientName = this.getNodeParameter(`recipients.recipient[${recipientIndex}].name`, i) as string;
								const recipientEmail = this.getNodeParameter(`recipients.recipient[${recipientIndex}].email`, i) as string;
								const recipientRole = this.getNodeParameter(`recipients.recipient[${recipientIndex}].role`, i, 'signer') as string;
								const placeholderName = this.getNodeParameter(`recipients.recipient[${recipientIndex}].placeholder_name`, i, '') as string;

								const recipientObj: any = {
									id: recipientId,
									name: recipientName,
									email: recipientEmail,
									role: recipientRole,
								};

								// Add placeholder_name if provided
								if (placeholderName && placeholderName.trim()) {
									recipientObj.placeholder_name = placeholderName.trim();
								}

								return recipientObj;
							});
						}

						// Add template variables if provided
						const templateVariables = this.getNodeParameter('templateVariables', i, {}) as object;
						if (Object.keys(templateVariables).length > 0) {
							body.template_variables = templateVariables;
						}

						responseData = await signWellApiRequest.call(
							this,
							'POST',
							'/document_templates/documents',
							body,
						);
					} else if (operation === 'get') {
						// Get Document operation
						const documentId = this.getNodeParameter('documentId', i) as string;

						responseData = await signWellApiRequest.call(this, 'GET', `/documents/${documentId}`);
					} else if (operation === 'delete') {
						// Delete Document operation
						const documentId = this.getNodeParameter('documentId', i) as string;

						responseData = await signWellApiRequest.call(
							this,
							'DELETE',
							`/documents/${documentId}`,
						);
					} else if (operation === 'getCompletedPdf') {
						// Get Completed PDF operation
						const documentId = this.getNodeParameter('documentId', i) as string;

						responseData = await signWellApiRequest.call(
							this,
							'GET',
							`/documents/${documentId}/completed_pdf`,
						);
					} else if (operation === 'sendReminder') {
						// Send Reminder operation
						const documentId = this.getNodeParameter('documentId', i) as string;
						const recipientEmail = this.getNodeParameter('recipientEmail', i) as string;

						const body = {
							recipient_email: recipientEmail,
						};

						responseData = await signWellApiRequest.call(
							this,
							'POST',
							`/documents/${documentId}/remind`,
							body,
						);
					}
				}

				// Template operations
				if (resource === 'template') {
					if (operation === 'get') {
						// Get Template operation
						const templateId = this.getNodeParameter('templateId', i) as string;

						responseData = await signWellApiRequest.call(
							this,
							'GET',
							`/document_templates/${templateId}`,
						);
					} else if (operation === 'create') {
						// Create Template operation
						const templateName = this.getNodeParameter('templateName', i) as string;
						const fileData = this.getNodeParameter('fileData', i) as string;
						const fileName = this.getNodeParameter('fileName', i) as string;
						const testMode = this.getNodeParameter('testMode', i, false) as boolean;

						const body: any = {
							name: templateName,
							file: fileData,
							filename: fileName,
						};

						if (testMode) {
							body.test_mode = true;
						}

						responseData = await signWellApiRequest.call(this, 'POST', '/template', body);
					} else if (operation === 'update') {
						// Update Template operation
						const templateId = this.getNodeParameter('templateId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						const testMode = this.getNodeParameter('testMode', i, false) as boolean;

						const body: any = {};

						// Properly resolve variables for update fields
						if (updateFields.templateName) {
							const templateName = this.getNodeParameter('updateFields.templateName', i) as string;
							body.name = templateName;
						}
						if (updateFields.fileData) {
							const fileData = this.getNodeParameter('updateFields.fileData', i) as string;
							body.file = fileData;
						}
						if (updateFields.fileName) {
							const fileName = this.getNodeParameter('updateFields.fileName', i) as string;
							body.filename = fileName;
						}
						if (testMode) {
							body.test_mode = true;
						}

						responseData = await signWellApiRequest.call(
							this,
							'PUT',
							`/document_templates/${templateId}`,
							body,
						);
					} else if (operation === 'delete') {
						// Delete Template operation
						const templateId = this.getNodeParameter('templateId', i) as string;

						responseData = await signWellApiRequest.call(
							this,
							'DELETE',
							`/document_templates/${templateId}`,
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
