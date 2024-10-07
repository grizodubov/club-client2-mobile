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


/* userRecommendations */
export const userRecommendations = {
	/* model */
	model: {
        recommendations: [],
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/user/recommendations',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userContacts */
export const userContacts = {
	/* model */
	model: {
        contacts: [],
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/user/contacts',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userUpdate */
export const userUpdate = {
	/* model */
	model: {},
	/* retriever */
	retriever: async function({
        id = 0,
        name = '',
        company = '',
        position = '',
        tags = '',
        interests = '',
        annual = '',
        annualPrivacy = '',
        employees = '',
        employeesPrivacy = '',
        catalog = '',
        city = '',
        hobby = '',
        birthdate = '',
        birthdatePrivacy = '',
        experience = 0,
        detail = '',
        tags1CompanyScope = '',
        tags1CompanyNeeds = '',
        tags1Licenses = '',
        tags1PersonalExpertise = '',
        tags1PersonalNeeds = '',
        tags1Hobbies = '',
    }) {
		const response = await request({
			path: '/new/user/update',
			data: {
                id: id,
                name: name,
                company: company,
                position: position,
                tags: tags,
                interests: interests,
                annual: annual,
                annual_privacy: annualPrivacy,
                employees: employees,
                employees_privacy: employeesPrivacy,
                catalog: catalog,
                city: city,
                hobby: hobby,
                birthdate: birthdate,
                birthdate_privacy: birthdatePrivacy,
                experience: experience,
                detail: detail,
                tags_1_company_scope: tags1CompanyScope,
                tags_1_company_needs: tags1CompanyNeeds,
                tags_1_licenses: tags1Licenses,
                tags_1_personal_expertise: tags1PersonalExpertise,
                tags_1_personal_needs: tags1PersonalNeeds,
                tags_1_hobbies: tags1Hobbies,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userContactAdd */
export const userContactAdd = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        contactId = 0,
    }) {
		const response = await request({
			path: '/user/contact/add',
			data: {
                contact_id: contactId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userContactDel */
export const userContactDel = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        contactId = 0,
    }) {
		const response = await request({
			path: '/user/contact/del',
			data: {
                contact_id: contactId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};


/* userProfileView */
export const userProfileView = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        userId = 0,
    }) {
		const response = await request({
			path: '/user/profile/view',
			data: {
                user_id: userId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};



/* userFavorites */
export const userFavorites = {
	/* model */
	model: {
        users: [],
    },
	/* retriever */
	retriever: async function() {
		const response = await request({
			path: '/user/favorites/select',
			data: {},
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};



/* userFavoritesSet */
export const userFavoritesSet = {
	/* model */
	model: {
    },
	/* retriever */
	retriever: async function({
        targetId = 0,
        flag = false,
    }) {
		const response = await request({
			path: '/user/favorites/set',
			data: {
                target_id: targetId,
                flag: flag,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};



/* userEventsConnections */
export const userEventsConnections = {
	/* model */
	model: {
        events: [],
    },
	/* retriever */
	retriever: async function({
        targetId = 0,
    }) {
		const response = await request({
			path: '/user/events/connections',
			data: {
                target_id: targetId,
            },
		});
		if (response.status == 200)
			return response.data;
		return null;
	}
};
