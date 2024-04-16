import type { ComponentType } from 'svelte';

import { CupertinoPane } from 'cupertino-pane';

import { Store } from '@/helpers/store';


export type Modal = {
    instance: typeof CupertinoPane.prototype | null,
    component: ComponentType | null,
    params: undefined | { [key: string]: any },
    state: boolean,
};


const _default: Modal = {
	instance: null,
    component: null,
    params: undefined,
    state: false,
};


export const modal = new Store('modal', _default);


export function modalCreate(component: ComponentType, params: undefined | { [key: string]: any }) {
    const modalInstance = new CupertinoPane('#modal', {
        bottomClose: true,
        backdrop: true,
        backdropOpacity: 0.2,
        animationDuration: 300,
        initialBreak: 'top',
        buttonDestroy: false,
        fitHeight: true,
        fitScreenHeight: true,
        breaks: {
            middle: {
                enabled: false,
            },
        },
        cssClass: 'modal-fix',
    });
    modalInstance.on('onBackdropTap', () => {
        modalInstance.hide();
    });
    modalInstance.on('onDidPresent', () => {
        modal.push({ state: true });
    });
    modal.push({ 
        instance: modalInstance,
        component: component,
        params: params,
        state: false,
    });
};


export function modalShow() {
    const temp = modal.pull();
    if (temp.instance) {
        temp.instance.present({ animate: true });
    }
};


export function modalDestroy() {
    const temp = modal.pull();
    if (temp.instance) {
        if (temp.state)
            temp.instance.destroy();
        modal.push({ 
            instance: null,
            component: null,
            params: undefined,
            state: false,
        });
    }
};
