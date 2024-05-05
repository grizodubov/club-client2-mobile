import type { View } from '@/libs/Router/types';
export const prerender = true;


const layouts: { [key: string]: View } = {
	/* **** */
	'Main': () => import('@/layouts/Main/index.svelte'),
	'Auth': () => import('@/layouts/Auth/index.svelte'),
	/* **** */
};


export default layouts;
