import type { ComponentType } from 'svelte';

import { CupertinoPane } from 'cupertino-pane';

import { Store } from '@/helpers/store';

import { states } from '@/stores';


export type Log = {
    instance: typeof CupertinoPane.prototype | null,
    component: ComponentType | null,
    params: undefined | { [key: string]: any },
    state: boolean,
    onOpen: any,
    onClose: any,
    componentInstance: any,
};


const _default: Log = {
	instance: null,
    component: null,
    params: undefined,
    state: false,
    onOpen: null,
    onClose: null,
    componentInstance: null,
};


export const log = new Store('log', _default);


export function logCreate(component: ComponentType, params: undefined | { [key: string]: any }, onOpen: any = null, onClose: any = null) {
    const logInstance = new CupertinoPane('#log', {
        backdrop: true,
        backdropOpacity: 0.5,
        bottomClose: false,
        buttonDestroy: false,
        showDraggable: false,
        animationDuration: 300,
        fitScreenHeight: true,
        bottomOffset: 32 + states.pull('safeBottom'),
        cssClass: 'log-fix',
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
    logInstance.on('onBackdropTap', () => {
        if (logInstance.rendered && !logInstance.isHidden())
            logInstance.hide();
    });
    logInstance.on('onDidPresent', () => {
        log.push({ state: true });
    });
    logInstance.on('onTransitionEnd', () => {
        if (!logInstance.rendered || logInstance.isHidden()) {
            const call = log.pull('onClose');
            if (call)
                call();
        }
        else {
            const call = log.pull('onOpen');
            if (call)
                call();
        }
    });
    log.push({ 
        instance: logInstance,
        component: component,
        params: params,
        state: false,
        onOpen: onOpen,
        onClose: onClose,
        componentInstance: null,
    });
};


export function logShow() {
    const temp = log.pull();
    if (temp.instance) {
        temp.instance.present({ animate: true });
    }
};


export function logHide() {
    const temp = log.pull();
    if (temp.instance) {
        temp.instance.hide();
    }
};


export function logDestroy(animate: boolean = false) {
    const temp = log.pull();
    if (temp.instance) {
        if (temp.state) {
            if (animate) {
                temp.instance.destroy({ animate: true });
            }
            else {
                temp.instance.destroy();
            }
        }
        log.push({ 
            instance: null,
            component: null,
            params: undefined,
            state: false,
            componentInstance: null,
        });
    }
};


export function logUpdate(params: undefined | { [key: string]: any }) {
    const temp = log.pull();
    if (temp.componentInstance)
        temp.componentInstance.update(params);
};
