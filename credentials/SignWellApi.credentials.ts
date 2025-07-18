import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SignWellApi implements ICredentialType {
	name = 'signWellApi';
	displayName = 'SignWell API';
	documentationUrl = 'https://developers.signwell.com/reference/getting-started-with-your-api-1';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your SignWell API key. You can find this in your SignWell account under Settings -> API.',
		},
		{
			displayName: 'Test Mode',
			name: 'testMode',
			type: 'boolean',
			default: false,
			description: 'Whether to use test mode for API requests. Test mode requests do not count against your quota and do not send actual documents.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.signwell.com/api/v1',
			required: true,
			description: 'The base URL for the SignWell API. Usually you should not need to change this.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/me',
			method: 'GET',
		},
	};
}
