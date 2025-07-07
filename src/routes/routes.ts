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
		path: '/me',
		layout: 'Main',
		component: 'Settings',
		meta: {
			name: 'Настройки профиля',
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
			name: 'Коммуникации',
		},
	},
    /* **** */
	{
		path: '/communities/:id',
        constraints: {
            'id': '\\d+',
        },
		layout: 'Main',
		component: 'Community',
		meta: {
			name: 'Сообщество',
		},
	},
    /* **** */
	{
		path: '/partners',
		layout: 'Main',
		component: 'Partners',
		meta: {
			name: 'Потенциальные партнёры',
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
		path: '/meetings',
		layout: 'Main',
		component: 'Meetings',
		meta: {
			name: 'Встречи',
		},
	},
    /* **** */
	{
		path: '/meetings/:section',
        constraints: {
            'section': '[a-z]+',
        },
		layout: 'Main',
		component: 'Meetings',
		meta: {
			name: 'Встречи',
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
	{
		path: '/register',
		layout: 'Auth',
		component: 'Registration',
		meta: {
			name: 'Регистрация',
		},
	},
    /* **** */
];


export default routes;
