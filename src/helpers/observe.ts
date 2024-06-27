/* Observer */

export class Observer {

    params: { [key: string]: any };
    observer: IntersectionObserver;


    /* Observer.constructor */
	constructor(params) {
        this.params = Object.assign(
            {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            },
            params
        );
		this.observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const intersecting = entry.isIntersecting;
                    if (this.params.onUpdate)
                        params.onUpdate(intersecting);
                    if (intersecting) {
                        if (params.once)
                            this.observer.unobserve(entry.target);
                        if (params.onEnter) {
                            let p: string | null = null;
                            if (entry.target.hasAttribute('data-observer-temp-data'))
                                p = entry.target.getAttribute('data-observer-temp-data');
                            params.onEnter(entry.target, p);
                        }
                    }
                    else {
                        if (params.onLeave) {
                            let p: string | null = null;
                            if (entry.target.hasAttribute('data-observer-temp-data'))
                                p = entry.target.getAttribute('data-observer-temp-data');
                            params.onLeave(entry.target, p);
                        }
                    }
                });
            },
            {
                root: params.root,
                rootMargin: params.rootMargin,
                threshold: params.threshold,
            }
        );
	}


    /* observe */
	observe(el, data: string | null = null) {
        if (data !== null)
            el.setAttribute('data-observer-temp-data', data);
        this.observer.observe(el);
	}


    /* unobserve */
	unobserve(el) {
        if (el.hasAttribute('data-observer-temp-data'))
            el.removeAttribute('data-observer-temp-data');
        this.observer.unobserve(el);
	}

};
