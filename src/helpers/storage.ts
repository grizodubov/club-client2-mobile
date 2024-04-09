type Data = {
    [key: string]: any;
};


/* EXPORT: StorageType */
export type StorageType = Data | string | number | boolean;


/* EXPORT: test */
export function test(): boolean {
	try {
		localStorage.setItem('___test', 'test');
		localStorage.removeItem('___test');
	}
	catch(error) {
		return false;
	}
	return true;
};


/* EXPORT: set */
export function set(key: string, data: StorageType): void {
	const t = typeof data;
    switch (t) {
        case 'object':
            localStorage.setItem('___' + key, t + '|' + JSON.stringify(data));
        case 'string':
            localStorage.setItem('___' + key, t + '|' + data);
        case 'number':
            localStorage.setItem('___' + key, t + '|' + data.toString());
        case 'boolean':
            localStorage.setItem('___' + key, t + '|' + (data ? '1' : '0'));
    }
};


/* EXPORT: get */
export function get(key: string): StorageType | undefined {
	const data = localStorage.getItem('___' + key);
	if (typeof data === 'string') {
		const result = /^(object|string|number|boolean)\|(.*)/.exec(data);
		if (result && result[1])
            switch (result[1]) {
                case 'object':
                    return JSON.parse(result[2]);
                case 'string':
                    return result[2];
                case 'number':
                    return Number(result[2]);
                case 'boolean':
                    return parseInt(result[2]) ? true : false;
            }
	}
	return undefined;
};


/* EXPORT: clear */
export function clear(): void {
	localStorage.clear();
};
