import {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';

import * as crypto from 'crypto';

import { signWellApiRequestHook } from './GenericFunctions';

export class SignWellTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SignWell Trigger',
		name: 'signWellTrigger',
		icon: 'file:signwell.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when SignWell events occur',
		defaults: {
			name: 'SignWell Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'signWellApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Document Created',
						value: 'document_created',
						description: 'When a document is created',
					},
					{
						name: 'Document Sent',
						value: 'document_sent',
						description: 'When a document is sent',
					},
					{
						name: 'Document Viewed',
						value: 'document_viewed',
						description: 'When a signer views a document',
					},
					{
						name: 'Document In Progress',
						value: 'document_in_progress',
						description: 'When a document has started to be completed',
					},
					{
						name: 'Document Signed',
						value: 'document_signed',
						description: 'When a document is signed by a recipient',
					},
					{
						name: 'Document Completed',
						value: 'document_completed',
						description: 'When a document is completed (signed by all recipients)',
					},
					{
						name: 'Document Expired',
						value: 'document_expired',
						description: 'When a document has expired',
					},
					{
						name: 'Document Canceled',
						value: 'document_canceled',
						description: 'When a document is canceled by the sender',
					},
					{
						name: 'Document Declined',
						value: 'document_declined',
						description: 'When a document is declined by a signer',
					},
					{
						name: 'Document Bounced',
						value: 'document_bounced',
						description: 'When the email delivery to a signer bounced',
					},
					{
						name: 'Document Error',
						value: 'document_error',
						description: 'When there\'s an error creating or updating a document',
					},
					{
						name: 'Template Created',
						value: 'template_created',
						description: 'When a template is created',
					},
					{
						name: 'Template Error',
						value: 'template_error',
						description: 'When there\'s an error creating or updating a template',
					},
				],
				default: ['document_completed'],
				required: true,
				description: 'The events to listen for',
			},
			{
				displayName: 'Verify Hash',
				name: 'verifyHash',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the webhook hash for security (recommended)',
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhooks = await signWellApiRequestHook.call(this, 'GET', '/hooks');

				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl) {
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				const body = {
					url: webhookUrl,
				};

				const responseData = await signWellApiRequestHook.call(this, 'POST', '/hooks', body);

				if (responseData.id === undefined) {
					// Required data is missing so was not successful
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.id as string;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await signWellApiRequestHook.call(this, 'DELETE', `/hooks/${webhookData.webhookId}`);
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events') as string[];
		const verifyHash = this.getNodeParameter('verifyHash', true) as boolean;

		// Extract event information
		const event = bodyData.event as IDataObject;
		const eventType = event?.type as string;

		// Check if this event type should be processed
		if (!events.includes(eventType)) {
			return {
				noWebhookResponse: true,
			};
		}

		// Verify webhook hash if enabled
		if (verifyHash) {
			const webhookData = this.getWorkflowStaticData('node');
			const webhookId = webhookData.webhookId as string;

			if (webhookId && event?.hash && event?.time && event?.type) {
				const expectedHash = event.hash as string;
				const eventTime = event.time as number;
				const data = `${eventType}@${eventTime}`;

				const calculatedHash = crypto
					.createHmac('sha256', webhookId)
					.update(data)
					.digest('hex');

				if (calculatedHash !== expectedHash) {
					throw new Error('Webhook hash verification failed - invalid signature');
				}
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
