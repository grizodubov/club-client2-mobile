import { request } from '@/helpers/request';


/* viewItem */
export const viewItem = {
	/* model */
	model: {
        item_id: 0,
        time_view: null,
    },
	/* retriever */
	retriever: async function({
        itemId = 0,
    }) {
		const response = await request({
			path: '/item/' + itemId.toString() + '/view',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* viewItems */
export const viewItems = {
	/* model */
	model: {
        items_ids: [],
        time_view: null,
    },
	/* retriever */
	retriever: async function({
        itemsIds = [],
    }) {
		const response = await request({
			path: '/item/view',
			data: {
                ids: itemsIds,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
