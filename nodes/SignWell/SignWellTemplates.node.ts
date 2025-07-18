import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { signWellApiRequest } from './GenericFunctions';

export class SignWellTemplates implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SignWell Templates',
		name: 'signWellTemplates',
		icon: 'file:signwell.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with SignWell Templates API',
		defaults: {
			name: 'SignWell Templates',
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
						name: 'Template',
						value: 'template',
					},
				],
				default: 'template',
			},
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

			// Get, Update, Delete parameters
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

			// Create parameters
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
				description: 'The name of the file (e.g., "contract.pdf")',
			},

			// Update parameters
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

			// Common optional parameters
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

						if (updateFields.templateName) {
							body.name = updateFields.templateName;
						}
						if (updateFields.fileData) {
							body.file = updateFields.fileData;
						}
						if (updateFields.fileName) {
							body.filename = updateFields.fileName;
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
