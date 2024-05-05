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


/* EXPORT: userLogout */
export const userLogout = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/logout',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* EXPORT: userChangeEmail */
export const userChangeEmail = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        account,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/change/email',
			data: {
                account: account,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* EXPORT: userChangeEmailValidate */
export const userChangeEmailValidate = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        account,
        code,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/change/email/validate',
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


/* EXPORT: userChangePhone */
export const userChangePhone = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        account,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/change/mobile',
			data: {
                account: account,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* EXPORT: userChangePhoneValidate */
export const userChangePhoneValidate = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        account,
        code,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/change/mobile/validate',
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


/* EXPORT: userChangeCredentials */
export const userChangeCredentials = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        code,
    }: Data): Promise<ResponseData | null>
    {
		const response: HTTPResponse = await request({
			path: '/change/credentials',
			data: {
                code: code,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* EXPORT: userTerminate */
export const userTerminate = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/terminate',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userRegister */
export const userRegister = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        name = '',
        email = '',
        phone = '',
        emailCode = '',
        phoneCode = '',
        company = '',
        position = '',
        password = '',
        annual = '',
        annualPrivacy = '',
        employees = '',
        employeesPrivacy = '',
        catalog = '',
        tags = '',
        interests = '',
        city = '',
        hobby = '',
        birthdate = null,
        birthdatePrivacy = '',
        experience = null,
    }) {
		const response = await request({
			path: '/new/register',
			data: {
                name: name,
                email: email,
                phone: phone,
                email_code: emailCode,
                phone_code: phoneCode,
                company: company,
                position: position,
                password: password,
                annual: annual,
                annual_privacy: annualPrivacy,
                employees: employees,
                employees_privacy: employeesPrivacy,
                catalog: catalog,
                tags: tags,
                interests: interests,
                city: city,
                hobby: hobby,
                birthdate: birthdate,
                birthdate_privacy: birthdatePrivacy,
                experience: experience,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userValidate */
export const userValidate = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        email = '',
        phone = '',
        emailCode = '',
        phoneCode = '',
    }) {
		const response = await request({
			path: '/new/validate',
			data: {
                email: email,
                phone: phone,
                email_code: emailCode,
                phone_code: phoneCode,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* deviceRegister */
export const deviceRegister = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        deviceId = null,
        deviceInfo = null,
        deviceToken = null,
    }) {
		const response = await request({
			path: '/register/device',
			data: {
                device_id: deviceId,
                device_info: deviceInfo,
                device_token: deviceToken,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
