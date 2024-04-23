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
        path: '/events/:id',
        constraints: {
            'id': '\\d+',
        },
        layout: 'Main',
        component: 'Event',
        meta: {
            name: 'Событие',
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
		path: '/residents/:id',
        constraints: {
            'id': '\\d+',
        },
		layout: 'Main',
		component: 'Profile',
		meta: {
			name: 'Профиль',
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
