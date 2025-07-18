import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { signWellApiRequest } from './GenericFunctions';

export class SignWellDocuments implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SignWell Documents',
		name: 'signWellDocuments',
		icon: 'file:signwell.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with SignWell Documents API',
		defaults: {
			name: 'SignWell Documents',
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
					},
				],
				default: 'document',
			},
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

			// Create From Template parameters
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
										name: 'CC',
										value: 'cc',
									},
								],
								default: 'signer',
								description: 'The role of the recipient',
							},
						],
					},
				],
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

			// Get, Delete, Get Completed PDF, Send Reminder parameters
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

			// Send Reminder specific parameters
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		const qs: any = {};
		let responseData;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
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
							body.recipients = recipientsData.recipient.map((recipient: any) => ({
								name: recipient.name,
								email: recipient.email,
								role: recipient.role || 'signer',
							}));
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
