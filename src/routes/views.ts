import type { View } from '@/libs/Router/types';


const views: { [key: string]: View } = {
	/* **** */
	'Home': () => import('@/views/Home/Home.svelte'),
	'Settings': () => import('@/views/Settings/Settings.svelte'),
	'Login': () => import('@/views/Login/Login.svelte'),
    'Registration': () => import('@/views/Registration/Registration.svelte'),
    'Events': () => import('@/views/Events/Events.svelte'),
    'Event': () => import('@/views/Event/Event.svelte'),
    'Communities': () => import('@/views/Communities/Communities.svelte'),
    'Community': () => import('@/views/Community/Community.svelte'),
    'Residents': () => import('@/views/Residents/Residents.svelte'),
    'Meetings': () => import('@/views/Meetings/Meetings.svelte'),
    'Profile': () => import('@/views/Profile/Profile.svelte'),
	/* **** */
};


export default views;
