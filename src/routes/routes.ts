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
			name: 'Лента',
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
