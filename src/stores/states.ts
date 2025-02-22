import { Store } from '@/helpers/store';

import { STATES } from '@/config/states.cfg';


const _default: {
    api: string,
    wso: string,
    media: string,
    start: boolean,
    hot: boolean,
    loading: boolean,
    connect: boolean,
    websocket: any,
    lockEvents: boolean,
    safeTop: number,
    safeBottom: number,
    keyboardHeight: number;
    displayHeight: number;
} = Object.assign(
    {
        api: '',
        wso: '',
        media: '',
        start: false,
        hot: false,
        loading: false,
        connect: false,
        websocket: null,
        lockEvents: false,
        safeTop: 0,
        safeBottom: 0,
        keyboardHeight: 0,
        displayHeight: 0,
    },
    STATES
);


export const states = new Store('states', _default);
