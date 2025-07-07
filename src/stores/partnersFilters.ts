import { Store } from '@/helpers/store';


export type PartnersFilters = {
    sort: number
    name: string;
};


const _default: PartnersFilters = {
	sort: 0,
    name: '',
};


export const partnersFilters = new Store('partnersFilters', _default);
