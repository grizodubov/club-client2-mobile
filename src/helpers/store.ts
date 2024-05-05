import {
    type Subscriber,
    type Invalidator,
    type Unsubscriber,
    type Updater,
    writable,
    get,
} from 'svelte/store';

import {
    type StorageType,
    set as storageSet,
    get as storageGet,
    test,
} from './storage';


type Data = {
    [key: string]: any;
};

/* EXPORT: Storage */
export type Storage = Data | string | number | boolean;


/* EXPORT: Store */
export class Store {

    name: string;
    _default: Storage;
    /* methods */
    subscribe: (this: void, run: Subscriber<Storage>, invalidate?: Invalidator<Storage> | undefined) => Unsubscriber;
    set: (value: Storage) => void;
    update: (this: void, updater: Updater<Storage>) => void;

    /* Store.constructor */
    constructor(name: string, _default: Storage) {
        const temp = writable(typeof _default !== 'object' ? _default : Object.assign({}, _default));
        this.name = name;
        this._default = _default;
        this.subscribe = temp.subscribe;
        this.set = temp.set;
        this.update = temp.update;
    }

    /* Store.pull */
    pull(prop?: string): any | Storage {
        const result = get(this);
        if (prop)
            if (typeof result === 'object') {
                return result[prop];
            }
            else {
                return undefined;
            }
        return result;
    }

    /* Store.push */
    push(value: Storage): void {
        if (typeof this._default === typeof value)
            this.update((self: Storage) => {
                if (typeof value === 'object') {
                    const filteredValue: Storage = Object.keys(this._default).reduce(
                        (result: Data, key: string) => {
                            if (value.hasOwnProperty(key))
                                result[key] = value[key];
                            return result;
                        }, {}
                    );
                    return Object.assign(self, filteredValue);
                }
                else {
                    return value;
                }
            });
    }

    /* Store.reset */
	reset(): void {
		this.update((self: Storage) =>
            Object.assign(self, this._default)
        );
    }

    /* Store.save */
    save(key?: string): void {
        if (test())
            storageSet(key ? key : ':' + this.name, get(this));
        //if (test())
        //    console.log('save', this.name, get(this));
    }

    /* Store.load */
    load(key?: string): void {
        if (test()) {
            const temp: StorageType | undefined = storageGet(key ? key : ':' + this.name);
            if (typeof temp === 'object') {
                this.update(self => Object.assign(self, temp));
            }
            else if (typeof temp === 'string' || typeof temp === 'number' || typeof temp === 'boolean') {
                this.update(self => temp);
            }
        }
        //if (test())
        //    console.log('load', this.name, get(this));
    }

};
