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
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userInfo */
export const userInfo = {
	/* model */
    model: {
        id: 0,
        name: '',
        active: true,
        community_manager_id: null,
        agent_id: null,
        score: 0,
        curator_id: 0,
        curators: null,
        agent_name: '',
        company: '',
        position: '',
        detail: '',
        status: '',
        annual: '',
        annuaPrivacy: 'показывать',
        employees: '',
        employeesPrivacy: 'показывать',
        catalog: '',
        city: '',
        hobby: '',
        link_telegram: '',
        birthdate: null,
        birthdatePrivacy: 'показывать',
        experience: null,
        tags: '',
        interests: '',
        avatar_hash: false,
        online: false,
        contact: false,
        allow_contact: false,
    },
	/* retriever */
	retriever: async function({
        userId = 0,
    }) {
		const response = await request({
			path: '/new/user/' + userId.toString() + '/info',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userEventAdd */
export const userEventAdd = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        eventId = 0,
    }) {
		const response = await request({
			path: '/user/event/add',
			data: {
                event_id: eventId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userEventDel */
export const userEventDel = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        eventId = 0,
    }) {
		const response = await request({
			path: '/user/event/del',
			data: {
                event_id: eventId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
