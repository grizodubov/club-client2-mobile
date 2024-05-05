import WarningView from './WarningView.svelte';

export class Warning {

    position: any;
    icon: any;
    message: any;
    duration: any;
    onMount: any;
    onClose: any;
    onCloseStart: any;
    styling: any;
    _height: any;
    _warningView: any;

    /* Warning.constructor */
    constructor({
        position = { top: 0, right: 0 },
        icon = undefined,
        message = '',
        duration = 0,
        onMount = null,
        onClose = null,
        onCloseStart = null,
        styling = '',
    }) {
        this.position = position;
        this.icon = icon;
        this.message = message;
        this.duration = duration;
        this.onMount = onMount;
        this.onClose = onClose;
        this.onCloseStart = onCloseStart;
        this.styling = styling;
        this._height = 0;
        this._warningView = null;
    }

    /* Warning.open */
    open() {
        this._warningView = new WarningView({
            target: document.body,
            props: {
                position: JSON.parse(JSON.stringify(this.position)),
                message: this.message,
                duration: this.duration,
                _state: '',
                _events: {
                    _onMount: this._setHeight.bind(this),
                    _onClose: this._destroy.bind(this),
                    _onCloseStart: this._closeStart.bind(this),
                },
        },
        });
        setTimeout(() => { this._warningView.$set({ _state: 'open' }); }, 10);
    }

    /* Warning.getHeight */
    getHeight() {
        return this._height;
    }

    /* Warning.move */
    move(d: any) {
        Object.keys(d).forEach(
            k => {
                if (k in this.position)
                    this.position[k] += d[k];
            }
        );
        this._warningView.$set({ position: JSON.parse(JSON.stringify(this.position)) });
    }

    /* Warning._setHeight */
    _setHeight(data: any) {
        this._height = data.height;
        if (this.onMount)
            this.onMount(this._getData());
    }

    /* Warning._destroy */
    _destroy() {
        if (this.onClose)
            this.onClose(this._getData());
        if (this._warningView)
            this._warningView.$destroy();
    }

    /* Warning._closeStart */
    _closeStart() {
        if (this.onCloseStart)
            this.onCloseStart(this._getData());
    }

    /* Warning._getData */
    _getData() {
        return {
            self: this,
            height: this._height,
        };
    }

};
