import type { ComponentType } from 'svelte';

import { CupertinoPane } from 'cupertino-pane';

import { Store } from '@/helpers/store';

import { states } from '@/stores';


export type Info = {
    instance: typeof CupertinoPane.prototype | null,
    component: ComponentType | null,
    params: undefined | { [key: string]: any },
    state: boolean,
    onOpen: any,
    onClose: any,
    componentInstance: any,
};


const _default: Info = {
	instance: null,
    component: null,
    params: undefined,
    state: false,
    onOpen: null,
    onClose: null,
    componentInstance: null,
};


export const info = new Store('info', _default);


export function infoCreate(component: ComponentType, params: undefined | { [key: string]: any }, onOpen: any = null, onClose: any = null) {
    const infoInstance = new CupertinoPane('#info', {
        backdrop: true,
        backdropOpacity: 0.5,
        bottomClose: false,
        buttonDestroy: false,
        showDraggable: false,
        animationDuration: 300,
        fitScreenHeight: true,
        bottomOffset: 32 + states.pull('safeBottom'),
        cssClass: 'info-fix',
        initialBreak: 'bottom',
        dragBy: ['.pane .dummy'],
        breaks: {
            top: {
                enabled: false,
            },
            middle: {
                enabled: false,
            },
            bottom: {
                enabled: true,
                height: states.pull('displayHeight') - 64 - states.pull('safeTop') - states.pull('safeBottom'),
            },
        },
    });
    infoInstance.on('onBackdropTap', () => {
        if (infoInstance.rendered && !infoInstance.isHidden())
            infoInstance.hide();
    });
    infoInstance.on('onDidPresent', () => {
        info.push({ state: true });
    });
    infoInstance.on('onTransitionEnd', () => {
        if (!infoInstance.rendered || infoInstance.isHidden()) {
            const call = info.pull('onClose');
            if (call)
                call();
        }
        else {
            const call = info.pull('onOpen');
            if (call)
                call();
        }
    });
    info.push({ 
        instance: infoInstance,
        component: component,
        params: params,
        state: false,
        onOpen: onOpen,
        onClose: onClose,
        componentInstance: null,
    });
};


export function infoShow() {
    const temp = info.pull();
    if (temp.instance) {
        temp.instance.present({ animate: true });
    }
};


export function infoHide() {
    const temp = info.pull();
    if (temp.instance) {
        temp.instance.hide();
    }
};


export function infoDestroy(animate: boolean = false) {
    const temp = info.pull();
    if (temp.instance) {
        if (temp.state) {
            if (animate) {
                temp.instance.destroy({ animate: true });
            }
            else {
                temp.instance.destroy();
            }
        }
        info.push({ 
            instance: null,
            component: null,
            params: undefined,
            state: false,
            componentInstance: null,
        });
    }
};


export function infoUpdate(params: undefined | { [key: string]: any }) {
    const temp = info.pull();
    if (temp.componentInstance)
        temp.componentInstance.update(params);
};

