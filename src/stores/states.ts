import { Store } from '@/helpers/store';

import { STATES } from '@/config/states.cfg';


const _default: {
    api: string,
    wso: string,
    media: string,
    start: boolean,
    loading: boolean,
    connect: boolean,
    websocket: any,
    lockEvents: boolean,
    safeTop: number,
    safeBottom: number,
} = Object.assign(
    {
        api: '',
        wso: '',
        media: '',
        start: false,
        loading: false,
        connect: false,
        websocket: null,
        lockEvents: false,
        safeTop: 0,
        safeBottom: 0,
    },
    STATES
);


export const states = new Store('states', _default);
