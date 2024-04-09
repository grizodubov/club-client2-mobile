import type { Params, Query, PathMeta, PathRoute, Route, View, Guard } from './types';
import { isPathRedirect, isValueArray } from './types';

import currentRoute from './stores/state';


interface RouteParam {
	name: string;
	array: boolean;
};

interface RouterNode {
	path: string;
	pathSearch: string;
	mask: boolean;
	redirect: boolean;
	pathRedirect: string;
	params: RouteParam[];
	views: View[];
	meta: PathMeta;
};

type RouteData = Route & { views: View[] };

interface Subscriptions {
	depth: number;
	callback: () => void;
}



/* RouterTransit */
class RouterTransit {

	private routePrev: RouteData;
	private routeNext: RouteData;
	private cancelFlag: boolean;
	private guards: Guard[];
	private next: (arg0: RouteData) => void | undefined;


	/* RouterTransit.constructor */
	constructor(routePrev: RouteData, routeNext: RouteData, guards: Guard[]) {
		this.routePrev = routePrev;
		this.routeNext = routeNext;
		this.cancelFlag = false;
		this.guards = [ ...guards ];
		this.next = undefined;
	}


	/* RouterTransit.start */
	start(next: (arg0: RouteData) => void): void {
		this.next = next;
		this.handle();
	}


	/* RouterTransit.handle */
	private handle(): void {
		const call = this.guards.shift();
		if (call) {
			if (!this.cancelFlag)
				call(
                    (({ views, ...object }) => object)(this.routeNext),
					this.routePrev ? (({ views, ...object }) => object)(this.routePrev) : undefined,
					this.handle.bind(this)
				);
		}
		else {
			if (!this.cancelFlag && this.next)
				this.next(this.routeNext);
		}
	}


	/* RouterTransit.cancel */
	cancel(): void {
		this.cancelFlag = true;
	}

};


/* Router */
class Router {

	private readonly uid: string;
	private layouts: { [key: string]: View } | undefined;
	private views: { [key: string]: View } | undefined;
	private guards: Guard[] | undefined;
	private tree: RouterNode[];
	private routeCurrent: RouteData | undefined;
	private transit: RouterTransit | undefined;
	private components: View[] | undefined;
	private subscriptions: Subscriptions[];
    private records: { [key: string]: number | string | boolean };


	/* Router.constructor */
	constructor() {
		this.uid = (Math.floor(Math.random() * 89999) + 10000).toString();
		this.layouts = undefined;
		this.views = undefined;
		this.guards = undefined;
		this.tree = [];
		this.routeCurrent = undefined;
		this.transit = undefined;
		this.components = undefined;
		this.subscriptions = [];
        this.records = {};
	}


	/* Router.init */
	init(
		routes: PathRoute[] = [],
		layouts: { [key: string]: View } = {},
		views: { [key: string]: View } = {},
		guards: Guard[] = []
	): void {
		this.layouts = { ...layouts };
		this.views = { ...views };
		this.guards = [ ...guards ];
		routes.forEach(
			route => {
				this.parseRoute(route);
			}
		);
		this.update();
		addEventListener('popstate', () => this.update());
	}


	/* Router.getUID */
	getUID(): string {
		return this.uid;
	}


	/* Router.go */
	go(path: string, records: { [key: string]: string | number | boolean } = undefined): void {
        if (records)
            this.records = Object.assign(this.records, records);
		history.pushState({}, '', path);
		this.update();
	}


    /* Router.replace */
    replace(path: string, push: boolean = false): void {
        if (push) {
            history.pushState({}, '', path);
        }
        else {
            history.replaceState({}, '', path);
        }
    }


	/* Router.record */
	record(key: string, valueDefault: string | number | boolean, deleteKey: boolean = false): string | number | boolean | undefined {
        let result: string | number | boolean;
        if (key in this.records) {
            result = this.records[key];
            if (deleteKey)
                delete this.records[key];
        }
        else {
            result = valueDefault;
        }
        return result;
	}


	/* Router.getComponent */
	getComponent(level: number): View | undefined {
		return this.components[level] ? this.components[level] : undefined;
	}


	/* Router.subscribe */
	subscribe(depth: number, callback: () => void): void {
		this.subscriptions.push({ depth: depth, callback: callback });
	}


	/* Router.unsubscribe */
	unsubscribe(depth: number, callback: () => void): void {
		const i = this.subscriptions.findIndex(s => s.depth === depth && s.callback === callback);
		this.subscriptions.splice(i, 1);
	}


	/* Router.parseRoute */
	private parseRoute(
		route: PathRoute,
		pathParent: string = '',
		partsParent: string[] = [],
		viewsParent: View[] = [],
		meta: PathMeta = {},
	): void {
		let mask: boolean = false;
		const path: string = route.path.replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '');
		let params: RouteParam[] = [];
		const parts: string[] = path.split('/').map(p => {
			if (p.startsWith(':')) {
				mask = true;
				let k = p.slice(1);
				let r = '([^\\/]+)';
				const m = k.match(/^\[(.*)\]$/);
				if (m) {
					k = m[1];
					r = '(.+)';
				}
				params.push({ name: k, array: m ? true : false });
				return route.constraints && route.constraints[k] ? '(' + route.constraints[k] + ')' : r;
			}
			return p;
		});
		let redirect: boolean = false;
		let pathRedirect: string = undefined;
		const views: View[] = [ ...viewsParent ];
		/* **** */
		if (isPathRedirect(route)) {
			redirect = true;
			pathRedirect = '/' + route.redirect.replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '');
		}
		if (route.layout)
			if (this.layouts[route.layout]) {
				views.splice(0, 1, this.layouts[route.layout]);
			} else {
				throw new Error('Layout \'' + route.layout + '\' not found in layouts!');
			}
		if (route.component)
			if (this.views[route.component]) {
				views.push(this.views[route.component]);
			} else {
				throw new Error('Component \'' + route.layout + '\' not found in views!');
			}
		const ln = this.tree.push({
			path: pathParent + '/' + path,
			pathSearch: '^' + [ ...partsParent, ...parts ].join('/') + '$',
			mask: mask,
			redirect: redirect,
			pathRedirect: pathRedirect,
			params: params,
			views: views,
			meta: route.meta ? Object.assign(meta, route.meta) : Object.assign({} , meta),
		});
		if (route.children) {
			route.children.forEach(
				child => {
					this.parseRoute(child, this.tree[ln - 1].path, parts, views, this.tree[ln - 1].meta);
				}
			);
		}
	}


	/* Router.update */
	private update(): void {
		const query: Query = this.parseQuery();
		const routeNext: RouteData = this.findRoute();
		if (this.routeCurrent)
			this.routeCurrent.views.filter(v => v).forEach((v, i) => {
				if (!routeNext.views[i] || v !== routeNext.views[i])
					this.subscriptions.filter(s => s.depth === i).forEach(s => s.callback());
			});
		if (routeNext) {
			routeNext.query = query;
			if (this.transit)
				this.transit.cancel();
			this.transit = new RouterTransit(this.routeCurrent, routeNext, this.guards);
			this.transit.start(this.load.bind(this));
		}
		else {
			// not found
		}
	}


	/* Router.load */
	private load(route: RouteData): void {
		this.transit = undefined;
		this.routeCurrent = route;
		this.components = [ ...route.views ];
		currentRoute.assign((({ views, ...object }) => object)(route));
	}


	/* Router.findRoute */
	private findRoute(pathRedirect: string[] = undefined): RouteData {
		const pathSearch: string = location.pathname.replace(/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '');
		const path = '/' + pathSearch;
		const ln = this.tree.length;
		let route: RouteData = undefined;
		let params: Params = {};
		let i = 0;
		let pointer: number | undefined = undefined;
		while (pointer === undefined && i < ln) {
			if (this.tree[i].mask) {
				const re = new RegExp(this.tree[i].pathSearch);
				const m = pathSearch.match(re);
				if (m) {
					this.tree[i].params.forEach(
						(p, i) => {
							if (p.array) {
								params[p.name] = m[i + 1].split('/').map(v => decodeURIComponent(v));
							}
							else {
								params[p.name] = decodeURIComponent(m[i + 1]);
							}
						}
					);
					pointer = i;
				}
			}
			else {
				if (path == this.tree[i].path) {
					pointer = i;
				}
			}
			i++;
		}
		if (pointer !== undefined) {
			if (this.tree[pointer].redirect) {
				const p: string[] = pathRedirect ? [ ...pathRedirect, path ] : [ path ];
				history.replaceState({ redirect: p }, '', this.injectParams(this.tree[pointer].pathRedirect, params));
				route = this.findRoute(p);
			}
			else {
				route = {
					url: location.href,
					path: path,
					params: params,
					query: undefined,
					meta: Object.assign({}, this.tree[pointer].meta),
					views: this.tree[pointer].views,
				};
			}
		}
		return route;
	}


	/* Router.parseQuery */
	private parseQuery(): Query {
		const query: Query = location.search.slice(1).split('&').reduce(
			(q, p) => {
				const [ k, v ] = p.split('=');
				if (k) {
					if (q[k]) {
						q[k] = Array.isArray(q[k]) ? q[k].push(decodeURIComponent(v ? v : '')) : q[k] = [ q[k], decodeURIComponent(v ? v : '') ];
					}
					else {
						q[k] = decodeURIComponent(v ? v : '');
					}
				}
				return q;
			}, {}
		);
		return query;
	}


	/* Router.injectParams */
	private injectParams(path: string, params: Params): string {
		return path.replace(
			/:([^\/\[\]]+)|:\[([^\/]+)\]/g,
			(m, ps, pa) => {
				if (ps && params.hasOwnProperty(ps)) {
					if (isValueArray(params[ps])) {
						return params[ps][0];
					}
					else {
						return params[ps];
					}
				}
				else if (pa && params.hasOwnProperty(pa)) {
					if (isValueArray(params[pa])) {
						return params[pa]['join']('/');
					}
					else {
						return params[pa];
					}
				}
				throw new Error('Missing redirect parameter for path \'' + path + '\'');
			}
		);
	}

};


/* router */
const router = new Router();


export default router;


// TODO:
// not found location
// ? decodeURIComponent for non-params path parts
