import { request } from '@/helpers/request';


/* notificationList */
export const notificationList = {
	/* model */
	model: {
        notifications: [],
        stats: { all: 0, new: 0 },
    },
	/* retriever */
	retriever: async function({
        timeBreakpoint = null,
        limit = null,
    }) {
		const response = await request({
			path: '/notification/1/list',
			data: {
                time_breakpoint: timeBreakpoint,
                limit: limit,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* notificationView */
export const notificationView = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        timeNotify = null,
    }) {
		const response = await request({
			path: '/notification/1/view',
			data: {
                time_notify: timeNotify,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* notificationViewAll */
export const notificationViewAll = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/notification/1/view/all',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
