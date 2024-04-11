import type { View } from '@/libs/Router/types';


const views: { [key: string]: View } = {
	/* **** */
	'Home': () => import('@/views/Home/Home.svelte'),
	'Login': () => import('@/views/Login/Login.svelte'),
    'Events': () => import('@/views/Events/Events.svelte'),
    'Communities': () => import('@/views/Communities/Communities.svelte'),
    'Residents': () => import('@/views/Residents/Residents.svelte'),
	/* **** */
};


export default views;
