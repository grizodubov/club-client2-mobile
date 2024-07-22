import { request } from '@/helpers/request';


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
