import { request } from '@/helpers/request';


/* tagList */
export const tagList = {
	/* model */
	model: {
        tags: [],
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/tag/list',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
