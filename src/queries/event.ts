import { 
    request
} from '@/helpers/request';


/* eventsFeed */
export const eventsFeed = {
	/* model */
	model: {
        events: [],
    },
	/* retriever */
	retriever: async function({
        from = null,
        to = null,
        find = false,
    }) {
		const response = await request({
			path: '/event/feed',
			data: {
                from: from,
                to: to,
                find: find,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
