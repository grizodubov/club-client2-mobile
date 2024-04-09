import {
    type Storage,
    Store
} from '@/helpers/store';

import { compare } from '@/helpers/compare';


type Data = {
    [key: string]: any;
};

type CallBack = () => void;

type CallBackWithData = (data: Data) => void;

type Entry = {
    name: string;
    handler: (data: Data) => Storage;
};

/* EXPORT: Retriever */
export type Retriever = (params: Data) => Promise<Data | null>;

type EntityWithData = [ Entity, Data ];


/* EXPORT: Entity */
export class Entity {

    model: Data;
    retriever: Retriever;
    entries: Entry[];
    onUpdate: CallBackWithData | null;
    onSuccess: CallBackWithData | null;
    onFailure: CallBack | null;
    data: Data;
    loading: typeof Store.prototype;
    [key: string]: any;

	/* Entity.constructor */
	constructor({
		model,
		retriever,
		entries = [],
		onUpdate = null,
		onSuccess = null,
		onFailure = null,
	}: {
        model: Data;
        retriever: Retriever;
        entries: Entry[];
        onUpdate: CallBackWithData | null;
        onSuccess: CallBackWithData | null;
        onFailure: CallBack | null;
    }) {
		this.model = model;
		this.retriever = retriever;
		this.entries = entries;
		this.onUpdate = onUpdate;
		this.onSuccess = onSuccess;
		this.onFailure = onFailure;
		this.data = Object.assign({}, model);
		this.loading = new Store('token', false);
        entries.forEach(
			(entry: Entry) => this[entry.name] = new Store(entry.name, entry.handler(this.model))
		);
	}

	/* Entity.retrieve */
	async retrieve(params: Data): Promise<void> {
		this.loading.push(true);
		const temp = await this.retriever(params);
		if (temp) {
			this.data = temp;
			this.update();
			if (this.onSuccess)
				this.onSuccess(this.data);
		}
		else {
			if (this.onFailure)
				this.onFailure();
		}
		this.loading.push(false);
	}

	/* Entity.update */
	update(): void {
		this.entries.forEach(
			(entry: Entry) => this[entry.name].push(entry.handler(this.data))
		);
		if (this.onUpdate)
			this.onUpdate(this.data);
	}

}


/* EXPORT: Collector */
export class Collector {
    busy: boolean;
    next: EntityWithData[] | null;

	/* Collector.constructor */
	constructor() {
		this.busy = false;
		this.next = null;
	}

	/* Collector.get */
	get(pool: EntityWithData[]): void {
		if (this.busy) {
			this.next = this.next ? [ ...this.next, ...pool ] : pool;
		}
		else {
			this.busy = true;
			this._get(pool);
		}
	}

	/* Collector._get */
	_get(pool: EntityWithData[]): void {
        const temp: EntityWithData[] = this._filter(pool);
		Promise.all(
			temp.map((item: EntityWithData) => item[0].retrieve(item[1]))
		).then(
			() => {
				if (this.next) {
					const next = this.next;
					this.next = null;
					this._get(next);
				}
				else {
					this.busy = false;
				}
			}
		);
	}

    /* Collector._filter */
    _filter(pool: EntityWithData[]): EntityWithData[] {
        const ln: number = pool.length;
        if (ln < 2)
            return [ ...pool ];
        const temp: EntityWithData[] = [];
        for (let i = ln - 1; i > 0; i--) {
            let check: boolean = false;
            for (let j = i - 1; j > -1; j--) {
                if (pool[i][0] == pool[j][0] || compare(pool[i][1], pool[j][1])) {
                    check = true;
                    break;
                }
            }
            if (!check)
                temp.unshift(pool[i]);
        }
        temp.unshift(pool[0]);
        return temp;
    }

};


/* EXPORT: collector */
export const collector = new Collector;
