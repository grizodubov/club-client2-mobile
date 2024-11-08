import { 
    request
} from '@/helpers/request';


/* connectionsHot */
export const connectionsHot = {
	/* model */
	model: {
        events: [],
        offline: [],
    },
	/* retriever */
	retriever: async function() {
        const dt = new Date();
		const response = await request({
			path: '/connections/hot',
			data: {
                dt: dt.getFullYear().toString() + '-' + ('0' + (dt.getMonth() + 1).toString()).slice(-2) + '-' + ('0' + dt.getDate().toString()).slice(-2),
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
