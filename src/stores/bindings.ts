import { BINDINGS } from '@/config/bindings.cfg';

import { Store } from '@/helpers/store';


const _default: {} = BINDINGS.reduce((a: any, v: any) =>({ ...a, [v]: 0 }), {});


export const bindings = new Store('bindings', _default);
