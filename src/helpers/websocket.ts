import { states, user } from '@/stores';

import { push as notify } from '@/helpers/notification';


type Event = [
    cb: (data: any) => void,
    once: boolean,
];

type Subscriptions = {
    connect: Event[];
    disconnect: Event[];
    message: Event[];
}

/* EXPORT WeboscketInstance */
export type WeboscketInstance = {
    /* states */
    lock: boolean;
    handler: WebSocket | null;
    reconnectState: boolean;
    reconnectTimer: ReturnType<typeof setInterval> | null;
    inspectorState: boolean;
    inspectorTimer: ReturnType<typeof setInterval> | null;
    /* subscriptions */
    subscriptions: Subscriptions;
    /* methods */
    establish: () => void;
    ping: () => void;
    dispatch: (event: keyof Subscriptions, data: any) => void;
    on: (event: keyof Subscriptions, cb: (data: any) => void, once: boolean) => void;
    off: (event: keyof Subscriptions, cb: (data: any) => void, once: boolean) => void;
    disband: () => void;
    send: (message: any) => void;
    isEstablished: () => boolean;
};


const serviceInterval: number = 5000;


/* EXPORT: websocket */
export const websocket: WeboscketInstance = {
    lock: false,
    handler: null,
    reconnectState: false,
	reconnectTimer: null,
	inspectorState: true,
	inspectorTimer: null,
	subscriptions: {
		connect: [],
		disconnect: [],
		message: [],
	},

    /* establish */
	establish: function() {
		new Promise(
			(resolve, reject) => {
				if (this.handler || this.lock) {
					reject(undefined);
					return;
				}
				this.lock = true;
				const wso = states.pull('wso');
				if (!wso) {
                    this.lock = false;
					notify('system', 'Websocket соединения не может быть открыто');
					reject(undefined);
					return;
				}
				const socket = new WebSocket(wso + '/ws');
				/* open */
				socket.onopen = () => {
					notify('system', 'Websocket соединение открыто');
					this.handler = socket;
					if (this.reconnectTimer) {
						clearInterval(this.reconnectTimer);
						this.reconnectTimer = null;
					}
					this.reconnectState = true;
					this.inspectorState = true;
					this.inspectorTimer = setInterval(() => this.ping(), serviceInterval);
					this.lock = false;
					this.dispatch('connect', null);
					resolve(undefined);
				};
				/* close */
				socket.onclose = () => {
					if (this.handler)
						notify('system', 'Websocket соединение закрыто');
					this.handler = null;
					if (this.inspectorTimer) {
						clearInterval(this.inspectorTimer);
						this.inspectorTimer = null;
					}
					if (this.reconnectState)
						this.reconnectTimer = setInterval(() => this.establish(), serviceInterval);
					this.lock = false;
					this.dispatch('disconnect', null);
					reject(undefined);
				};
				/* message */
				socket.onmessage = (event) => {
					if (event.data === 'pong') {
						this.inspectorState = true;
						return;
					}
					this.dispatch('message', event.data);
				};
			}
		).then(() => undefined).catch(() => undefined);
	},

    /* ping */
	ping: function() {
        if (this.handler)
            if (this.inspectorState) {
                this.inspectorState = false;
                this.handler.send('ping');
            }
            else {
                this.handler.close();
            }
	},

	/* dispatch */
	dispatch: function(event, data) {
        if (user.pull('id')) {
            this.subscriptions[event].forEach(
                call => {
                    call[0](data);
                    if (call[1])
                        this.off(event, call[0], call[1])
                }
            );
        }
	},

	/* on */
	on: function(event, cb, once) {
		this.subscriptions[event].push([ cb, once ]);
	},

	/* off */
	off: function(event, cb, once) {
		const len = this.subscriptions[event].length;
        const temp = [];
        for (let i = len - 1; i >= 0; i--)
            if (this.subscriptions[event][i][0] === cb && this.subscriptions[event][i][1] === once)
                temp.push(i);
        temp.forEach(
            i => this.subscriptions[event].splice(i, 1)
        );
	},

	/* disband */
	disband: function() {
		if (this.reconnectTimer) {
			clearInterval(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		this.reconnectState = false;
		if (this.handler)
			this.handler.close();
        this.handler = null;
	},

	/* send */
	send: function(message) {
        if (this.handler)
    		this.handler.send(message);
	},

	/* isEstablished */
	isEstablished() {
		return this.handler ? true : false;
	},

};
