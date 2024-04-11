import { Store } from '@/helpers/store';

import { STATES } from '@/config/states.cfg';

import { type WeboscketInstance } from '@/helpers/websocket';


const _default: {
    api: string,
    wso: string,
    media: string,
    start: boolean,
    loading: boolean,
    connect: boolean,
    websocket: WeboscketInstance | null,
} = Object.assign(
    {
        api: '',
        wso: '',
        media: '',
        start: false,
        loading: false,
        connect: false,
        websocket: null,
    },
    STATES
);


export const states = new Store('states', _default);
