  import ToastView from './ToastView.svelte';

	export class Toast {

    position: any;
    message: any;
    duration: any;
    onMount: any;
    onClose: any;
    onCloseStart: any;
    onClick: any;
    _height: any;
    _toastView: any;

    /* Toast.constructor */
	constructor({
      position = { top: 0, right: 0 },
      message = '',
      duration = 0,
      onMount = null,
      onClose = null,
      onCloseStart = null,
      onClick = null,
    }: any) {
      this.position = position;
      this.message = message;
      this.duration = duration;
      this.onMount = onMount;
      this.onClose = onClose;
      this.onCloseStart = onCloseStart;
      this.onClick = onClick;
      this._height = 0;
      this._toastView = null;
		}

    /* Toast.open */
    open() {
      this._toastView = new ToastView({
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
            _onClick: this._onClick.bind(this),
          },
        },
      });
      setTimeout(() => { this._toastView.$set({ _state: 'open' }); }, 10);
    }

    /* Toast.getHeight */
    getHeight() {
      return this._height;
    }
    
    /* Toast.move */
    move(d: any) {
      Object.keys(d).forEach(
        k => {
          if (k in this.position)
            this.position[k] += d[k];
        }
      );
      this._toastView.$set({ position: JSON.parse(JSON.stringify(this.position)) });
    }

    /* Toast._setHeight */
    _setHeight(data: any) {
      this._height = data.height;
      if (this.onMount)
        this.onMount(this._getData());
    }

    /* Toast._destroy */
    _destroy() {
      if (this.onClose)
        this.onClose(this._getData());
      if (this._toastView)
        this._toastView.$destroy();
    }
    
    /* Toast._closeStart */
    _closeStart() {
      if (this.onCloseStart)
        this.onCloseStart(this._getData());
    }


    /* Toast._onClick */
    _onClick() {
        if (this.onClick)
            this.onClick();
    }
    

    /* Toast._getData */
    _getData() {
      return {
        self: this,
        height: this._height,
      };
    }

	};
