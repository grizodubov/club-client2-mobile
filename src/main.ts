import App from './App.svelte';
import './style.css';

import { router } from '@/libs/Router';
import { init } from '@/helpers/auth';
import { routes, layouts, views, guards } from '@/routes';


init();


router.init(routes, layouts, views, guards);


const app = new App({ target: <Element>document.getElementById('app') });

export default app;
