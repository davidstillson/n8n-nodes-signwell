import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

export async function signWellApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('signWellApi');

	const options: IRequestOptions = {
		method,
		body,
		qs,
		uri: uri || `${credentials.baseUrl}${resource}`,
		headers: {
			'X-Api-Key': credentials.apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			...headers,
		},
		json: true,
	};

	try {
		if (Object.keys(body as IDataObject).length === 0) {
			delete options.body;
		}

		const response = await this.helpers.request(options);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function signWellApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.page = 1;
	query.per_page = 100;

	do {
		responseData = await signWellApiRequest.call(this, method, endpoint, body, query);
		query.page++;
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
	} while (responseData[propertyName] && responseData[propertyName].length !== 0);

	return returnData;
}

export async function signWellApiRequestHook(
	this: IHookFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('signWellApi');

	const options: IRequestOptions = {
		method,
		body,
		qs,
		uri: uri || `${credentials.baseUrl}${resource}`,
		headers: {
			'X-Api-Key': credentials.apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			...headers,
		},
		json: true,
	};

	try {
		if (Object.keys(body as IDataObject).length === 0) {
			delete options.body;
		}

		console.log('SignWell API Request:', {
			method,
			url: options.uri,
			body: options.body,
			headers: options.headers
		});

		const response = await this.helpers.request(options);
		console.log('SignWell API Response:', response);
		return response;
	} catch (error: any) {
		console.error('SignWell API Error:', {
			message: error.message,
			status: error.response?.status,
			statusText: error.response?.statusText,
			data: error.response?.data,
			config: {
				method: error.config?.method,
				url: error.config?.url,
				data: error.config?.data
			}
		});
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
