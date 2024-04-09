import { Store } from '@/helpers/store';


const _default: {
    id: number,
    name: string,
    avatar_hash: string | null,
    roles: string[],
    telegram: string | null,
} = {
	id: 0,
	name: '',
    avatar_hash: null,
    roles: [],
    telegram: null,
};


export const user = new Store('user', _default);
