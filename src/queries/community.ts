import { 
    request
} from '@/helpers/request';


/* communitiesList */
export const communitiesList = {
	/* model */
	model: {
        communities: [],
        stats: {},
        community_root_id: null,
        community_id: 0,
        posts: [],
        polls: [],
    },
	/* retriever */
	retriever: async function({
        communityId = null,
    }) {
		const response = await request({
			path: '/community/list',
			data: {
                community_id: communityId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* addPost */
export const addPost = {
	/* model */
	model: {
        posts: [],
    },
	/* retriever */
	retriever: async function({
        communityId = 0,
        text = '',
        replyToPostId = null,
    }) {
		const response = await request({
			path: '/community/post/add',
			data: {
                community_id: communityId,
                text: text,
                reply_to_post_id: replyToPostId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* updatePost */
export const updatePost = {
	/* model */
	model: {
        posts: [],
    },
	/* retriever */
	retriever: async function({
        postId = 0,
        closed = null,
        helpful = null,
    }) {
		const response = await request({
			path: '/community/post/update',
			data: {
                post_id: postId,
                closed: closed,
                helpful: helpful,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
