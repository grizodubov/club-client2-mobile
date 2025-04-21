import { states, token } from '@/stores';

import { BINDINGS } from '@/config/bindings.cfg';

import { auth, updateBindings, parseNotifications } from './auth';


/* EXPORT: ResponseData */
export type Data = {
    [key: string]: any;
};

/* EXPORT: ResponseData */
export type ResponseData = {
    _alert?: string;
    _notification?: string;
    _bindings?: { [key: string]: string | number | boolean  };
    [key: string]: any;
};

/* EXPORT: HTTPResponse */
export type HTTPResponse = {
    status: number;
    data: ResponseData;
};

type RequestOptions = {
    path: string;
    data: Data;
};

type RequestAjaxOptions = {
    method: 'GET' | 'POST' | 'PUT';
    url: string;
    body: Data | string;
};


const EXCEPTIONS: {
    [key: string]: [ number, string ]
} = {
    'timeoutException': [ 504, 'Незавершённый запрос' ],
    'abortException': [ 500, 'Прерванный запрос' ],
    'errorException': [ 500, 'Непредвиденная ошибка' ],
    'parseException': [ 520, 'Ошибка обработки ответа' ],
    'responseException': [ 520, 'Неверный ответ сервера' ],
    'initializationException': [ 523, 'Сервер не инициализирован' ],
};


/* EXPORT: request */
export async function request({ path, data }: RequestOptions): Promise<HTTPResponse> {
    states.push({
		loading: true,
	});
    const result: HTTPResponse = await APIRequest(path, data);
    states.push({
		loading: false,
	});
	return result;
}


/* APIRequest */
async function APIRequest(path: string, data: Data): Promise<HTTPResponse> {
    token.load();
    const t: string | undefined = token.pull('token');
    const req: RequestAjaxOptions = {
        method: 'POST',
        url: states.pull('api') + path,
        body: Object.assign(data ? data : {}, { _token: t ? t : '' }),
    };
    let result: HTTPResponse = { 
        status: 0,
        data: {},
    };
    let success: boolean = true;
    try {
        result = await ajaxRequest(req);
    }
    catch (error: unknown) {
        success = false;
        result = error as HTTPResponse;
    }
    if (success) {
        auth(result.data);
        updateBindings(result.data);
    }
    parseNotifications(result.data, req);
    return result;
}


/* ajaxRequest */
function ajaxRequest({ method, url, body }: RequestAjaxOptions): Promise<HTTPResponse> {
	return new Promise<HTTPResponse>(
		(resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url);
            /* headers */
			if ([ 'POST', 'PUT' ].indexOf(method) > -1)
				xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            /* timeout */
			xhr.timeout = 10000;
            /* timeout exception */
			xhr.ontimeout = () => {
				reject({
                    status: EXCEPTIONS['timeoutException'][0],
                    data: { _alert: EXCEPTIONS['timeoutException'][1] },
                });
			};
            /* abort exception */
			xhr.onabort = () => {
                reject({
                    status: EXCEPTIONS['abortException'][0],
                    data: { _alert: EXCEPTIONS['abortException'][1] },
                });
			};
            /* error exception */
			xhr.onerror = () => {
                reject({
                    status: EXCEPTIONS['errorException'][0],
                    data: { _alert: EXCEPTIONS['errorException'][1] },
                });
			};
            /* load */
			xhr.onload = () => {
				let data: Data = {};
				if (xhr.responseText) {
					try {
						data = JSON.parse(xhr.responseText);
					}
					catch (error: unknown) {
                        /* parse exception */
                        reject({
                            status: EXCEPTIONS['parseException'][0],
                            data: { _alert: EXCEPTIONS['parseException'][1] },
                        });
                        return;
					}
					data['_bindings'] = {};
					BINDINGS.forEach(
						(header: string) => {
							const result: string | null = xhr.getResponseHeader('x-binding-' + header);
							if (result !== null)
								data['_bindings'][header.replace(/-/g, '_')] = parseInt(result);
						}
					);
					if (xhr.status == 200) {
						resolve({
                            status: xhr.status,
                            data: data,
                        });
					}
					else {
						reject({
                            status: xhr.status,
                            data: data,
                        });
					}
				}
				else {
                    /* response exception */
                    reject({
                        status: EXCEPTIONS['responseException'][0],
                        data: { _alert: EXCEPTIONS['responseException'][1] },
                    });
				}
			};
            /* send */
			xhr.send(body && typeof body === 'object' ? JSON.stringify(body) : '');
		}
	);
}
