import type { View } from '@/libs/Router/types';


const views: { [key: string]: View } = {
	/* **** */
	'Home': () => import('@/views/Home.svelte'),
	'Login': () => import('@/views/Login.svelte'),
	/* **** */
};


export default views;
