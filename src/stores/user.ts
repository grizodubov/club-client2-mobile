import { derived } from 'svelte/store';

import { Store } from '@/helpers/store';


export type User = {
    id: number;
    name: string;
    avatar_hash: string | null;
    roles: string[];
    telegram: string | null;
    legal: boolean;
    status: string;
};


const _default: User = {
	id: 0,
	name: '',
    avatar_hash: null,
    roles: [],
    telegram: null,
    legal: false,
    status: 'бронзовый',
};


export const user = new Store('user', _default);

export const userFirstName = derived(user, $user => {
    const temp = ($user as User).name.split(/\s+/, 2);
    return temp.length > 1 ? temp[1] : temp[0];
});
