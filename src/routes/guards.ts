import { sleep } from '@/helpers/utils';
import {type Route, type Next, type Guard } from '@/libs/Router/types';
import { router } from '@/libs/Router';
import { request } from '@/helpers/request';
import { states, user } from '@/stores';


/* authentication */
function authentication(to: Route, from: Route, next: Next): void {
    const userId = user.pull('id');
    if (userId) {
		if (to.path === '/auth') {
			router.go('/');
		}
		else {
			next();
		}
	}
	else {
		if (to.path === '/auth' || to.path === '/register') {
			next();
		}
		else {
			router.go('/auth', { onLogin: to.url });
		}
	}
};


/* start */
async function start() {
    if (!states.pull('start'))
        while (true) {
            const result = await request({ path: '/', data: {} });
            if (result.status == 200)
                break;
            await sleep(5000);
        }
}


/* wrapper */
function wrapper(to: Route, from: Route, next: Next) {
    start().then(() => {
        states.push({ start: true });
        next();
    });
}


const guards: Guard[] = [ wrapper, authentication ];


export default guards;
