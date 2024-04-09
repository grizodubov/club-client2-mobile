import type { ComponentType } from 'svelte';


interface Params {
	[key: string]: string | string[];
};

interface Query {
	[key: string]: string | string[];
};

interface Meta {
	[key: string]: any;
};

/* **** */

interface PathConstraints {
	[key: string]: string;
};

interface Path {
	path: string;
	constraints?: PathConstraints;
	layout?: string;
	meta?: PathMeta;
	children?: PathRoute[];
};

interface PathMeta {
	name?: string;
	[key: string]: any;
};

interface PathRedirect extends Path {
	component?: string;
	redirect: string;
};

interface PathContent extends Path {
	component: string;
};

type PathRoute = PathRedirect | PathContent;

function isPathRedirect(value: PathRoute): value is PathRedirect {
	return value.hasOwnProperty('redirect');
}

function isValueArray(value: string | string[]): value is string[] {
	return Array.isArray(value);
}

/* **** */

interface Route {
	url: string;
	path: string;
	params: Params;
	query: Query;
	meta: Meta;
};

interface Next {
	(): void;
};

/* **** */

type View = () => Promise<{ default: ComponentType }>;

/* **** */

type Guard = (to: Route, from: Route, next: Next) => void | Promise<void>;


export {
	type Params,
	type Query,
	type Meta,
	type PathConstraints,
	type PathMeta,
	type PathRedirect,
	type PathContent,
	type PathRoute,
	type Route,
	type Next,
	type View,
	type Guard,
	isPathRedirect,
	isValueArray,
}
