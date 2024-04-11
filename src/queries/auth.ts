import { 
    type Data,
    type ResponseData, 
    type HTTPResponse,
    request
} from '@/helpers/request';


/* EXPORT: userLogin */
export const userLogin = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        account,
        password,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/login',
			data: {
                account: account,
                password: password,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* EXPORT: userSetCode */
export const userSetCode = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        type,
        account,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/login/' + type,
			data: {
                account: account,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* EXPORT: userValidateCode */
export const userValidateCode = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        type,
        account,
        code,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/login/' + type + '/validate',
			data: {
                account: account,
                code: code,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
