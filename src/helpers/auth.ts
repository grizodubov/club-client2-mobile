import { states, token, user, bindings } from '@/stores';

import {
    type ModelString,
    type ModelInteger,
    type ModelDictionary,
    validate,
} from './validate';

import { websocket } from './websocket';

import { push as notify } from '@/helpers/notification';

import { openEventRegistrationPopup } from '@/helpers/popups';


type Data = {
    [key: string]: any;
};


const MODEL: {
    _token: ModelString,
    _time: ModelInteger,
    _user: ModelDictionary,
} = {
    _token: {
        type: 'string',
        required: true,
        mask: /^[0-9A-Fa-f]{64}$/,
    },
    _time: {
        type: 'integer',
        required: true,
        valueMin: 1577836800000,
    },
    _user: {
        type: 'dictionary',
        required: true,
        model: {
            id: {
                type: 'integer',
                required: true,
            },
            name: {
                type: 'string',
                required: true,
                empty: true,
            },
            avatar_hash: {
                type: 'string',
                required: true,
                null: true,
                empty: true,
            },
            roles: {
                type: 'array',
                required: true,
                empty: true,
            },
            telegram: {
                type: 'string',
                required: true,
                null: true,
                empty: true,
            },
            status: {
                type: 'string',
                required: true,
                empty: true,
            },
            legal: {
                type: 'boolean',
                required: true,
            },
        },
    },
};


/* EXPORT: init */
export function init(): void {
    token.load();
    user.load();
    //console.log('init', token.pull());
	websocket.on('connect',
		() => {
			states.push({
				connect: true,
				websocket: websocket,
			});
			websocket.send(
				JSON.stringify({
					command: 'register',
					token: token.pull('token'),
					user_id: user.pull('id'),
                    agent: window.navigator.userAgent,
                    client: 'application',
				})
			);
		},
        false
	);
	websocket.on('disconnect',
		() => {
			states.push({
				connect: false,
				websocket: null,
			});
		},
        false
	);
	websocket.on('message',
		message => {
			const data = JSON.parse(message);
			if (data.event)
				notify('events', data.title, [ 'websocket', data ]);
		},
        false
	);
}


/* EXPORT: auth */
export function auth(data: Data): void {
	token.load();
	const timeStamp = token.pull('time');
    //console.log('auth', token.pull(), data);
    //console.log(data);
    //console.log(validate(data, MODEL));
	if (validate(data, MODEL)) {
		if (data._time > timeStamp) {
			token.push({
				token: data._token,
				time: data._time,
			});
			token.save();
            //console.log('auth', token.pull());
            //token.load();
            //console.log('auth', token.pull());
            const frUserId: number = user.pull('id');
            user.push(data._user);
			user.save();
            const toUserId: number = user.pull('id');
            const isEstablished: boolean = websocket.isEstablished();
            if (toUserId) {
                if (frUserId !== toUserId) {
                    if (isEstablished) {
                        websocket.disband();
                        websocket.on('disconnect', websocket.establish.bind(websocket), true);
                    }
                    else {
                        websocket.establish();
                    }
                }
                else {
                    if (!isEstablished)
                        websocket.establish();
                }
            }
            else {
                if (isEstablished)
                    websocket.disband();
            }
		}
	}
}


/* EXPORT: updateBindings */
export function updateBindings(data: Data): void {
	if (data.hasOwnProperty('_bindings'))
		bindings.push(data._bindings);
}


/* EXPORT: parseNotifications */
export function parseNotifications(data: Data, sourceData: any = null): void {
	if (data.hasOwnProperty('_alert') && data._alert)
		notify('alerts', data._alert, [ 'request', sourceData ]);
	if (data.hasOwnProperty('_notification') && data._notification)
		notify('notifications', data._notification, [ 'request', sourceData ]);
    /* */
    if (data.hasOwnProperty('_popup') && data._popup == 'registration')
        openEventRegistrationPopup();
}
