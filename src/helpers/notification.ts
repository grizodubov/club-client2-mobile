type Subscriptions = {
    [key: string]: Subscription[];
};

type Message = {
    message: string;
    source: [ string, any ] | undefined;
};

type MessageData = Message | { channel: string };


const subscriptions: Subscriptions = {};


/* EXPORT: subscribe */
export function subscribe(channel: string, cb: (msg: MessageData) => void, cbInterval: number = 0): Subscription {
    const subscription = new Subscription(channel, cb, cbInterval);
    if (!subscriptions.hasOwnProperty(channel))
        subscriptions[channel] = [];
    subscriptions[channel].push(subscription);
    return subscription;
};


/* EXPORT: push */
export function push(channel: string, message: string, source: [ string, any ] | undefined = undefined) {
    if (subscriptions.hasOwnProperty(channel))
        subscriptions[channel].forEach(
            subscription => subscription.push(message, source)
        );
};


/* Subscription */
class Subscription {
    channel: string;
    cb: (msg: MessageData) => void;
    cbInterval: number;
    pool: Message[];
    timer: ReturnType<typeof setTimeout> | null;
    busy: boolean;

    constructor(channel: string, cb: (msg: MessageData) => void, cbInterval: number = 0) {
        this.channel = channel;
        this.cb = cb;
        this.cbInterval = cbInterval;
        this.pool = [];
        this.timer = null;
        this.busy = false;
    }
    
    push(message: string, source: [ string, any ] | undefined): void {
        this.pool.push({ message: message, source: source });
        this.next();
    }

    next(): void {
        if (!this.busy)
            if (this.pool.length) {
                this.busy = true;
                const message = this.pool.shift();
                if (message)
                    if (this.cbInterval) {
                        this.timer = setTimeout(() => this.process(message), this.cbInterval);
                    }
                    else {
                        this.process(message);
                    }
            }
    }

    process(message: Message): void {
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = null;
        this.cb(Object.assign({ channel: this.channel }, message));
        this.busy = false;
        this.next();
    }

    close() {
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = null;
        this.pool.splice(0, this.pool.length);
        subscriptions[this.channel].splice(subscriptions[this.channel].indexOf(this), 1);
    }

}
