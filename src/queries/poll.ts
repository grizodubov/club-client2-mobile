import { request } from '@/helpers/request';


/* addVote */
export const addVote = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        pollId = 0,
        answer = 0,
    }) {
		const response = await request({
			path: '/poll/add/vote',
			data: {
                poll_id: pollId,
                answer: typeof answer === 'number' ? [ answer ] : answer,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* getRatingPolls */
export const getRatingPolls = {
	/* model */
	model: {
        polls: [],
        choice: '',
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/poll/rating/list',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
