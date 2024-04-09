import { Store } from '@/helpers/store';


const _default: {
    token: string,
    time: number,
} = {
	token: '',
	time: 0,
};


export const token = new Store('token', _default);
