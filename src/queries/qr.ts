import { request } from '@/helpers/request';



/* QRShow */
export const QRShow = {
	/* model */
	model: {
        url: '',
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/qr/show',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};



/* QREventRegistration */
export const QREventRegistration = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        eventId = 0,
    }) {
		const response = await request({
			path: '/qr/event/register',
			data: {
                event_id: eventId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
