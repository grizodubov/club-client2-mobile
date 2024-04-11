import type { PathRoute } from '@/libs/Router/types';


const routes: PathRoute[] = [
	/* **** */
	{
		path: '/',
		redirect: '/home',
	},
	/* **** */
	{
		path: '/home',
		layout: 'Main',
		component: 'Home',
		meta: {
			name: 'Монитор',
		},
	},
	/* **** */
	{
		path: '/events',
		layout: 'Main',
		component: 'Events',
		meta: {
			name: 'События',
		},
	},
	/* **** */
	{
		path: '/communities',
		layout: 'Main',
		component: 'Communities',
		meta: {
			name: 'Сообщества',
		},
	},
	/* **** */
	{
		path: '/residents',
		layout: 'Main',
		component: 'Residents',
		meta: {
			name: 'Резиденты',
		},
	},
    /* **** */
	{
		path: '/auth',
		layout: 'Auth',
		component: 'Login',
		meta: {
			name: 'Аутентификация',
		},
	},
	/* **** */
];


export default routes;
