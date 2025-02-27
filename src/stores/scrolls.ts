import { writable } from 'svelte/store'


const residentsY = writable(0);

const eventPopupY = writable(0);

const eventPopupConfig: any = writable(null);

const homePopupY = writable(0);

const homePopupConfig: any = writable(null);

export {
    residentsY,
    eventPopupY,
    eventPopupConfig,
    homePopupY,
    homePopupConfig,
};
