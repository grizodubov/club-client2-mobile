import { request } from '@/helpers/request';


/* residentsList */
export const residentsList = {
	/* model */
	model: {
        residents: []
    },
	/* retriever */
	retriever: async function({
        usersIds = null,
    }) {
		const response = await request({
			path: '/new/user/residents',
			data: {
                users_ids: usersIds,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* residentInfo */
export const residentInfo = {
	/* model */
	model: {
        residents: []
    },
	/* retriever */
	retriever: async function({
        userId = 0,
    }) {
		const response = await request({
			path: '/new/user/resident/' + userId.toString(),
			data: {
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
