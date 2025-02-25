import { writable } from 'svelte/store'


const residentsY = writable(0);

const eventPopupY = writable(0);

const eventPopupConfig: any = writable(null);


export {
    residentsY,
    eventPopupY,
    eventPopupConfig,
};
