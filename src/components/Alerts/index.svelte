<script lang="ts" context="module">
  import { WarningObject } from '@/components';

  const pool: any[] = [];
  
  let lock = false;
  let lane: any[] = [];
  let size = 0;
  let position = '{"top":0,"right":0}';

  let config = {
    max: 7,
    duration: 3000,
    top: 0,
    right: 0,
    bottom: undefined,
    left: undefined,
    direction: 'column',
  };

  export function setup(_config: { [key: string]: any }) {
    Object.assign(config, _config);
    const temp = {};
    [ 'top', 'right', 'bottom', 'left' ].forEach(
      k => {
        if (typeof config[k] === 'number' || typeof config[k] === 'string')
          temp[k] = config[k];
      }
    );
    position = JSON.stringify(temp);
  }

  export function push(notification: any) {
    pool.push({ 
      notification: notification,
    });
    show();
  }

  function show() {
    if (!lock) {
      lock = true;
      const n = pool.shift();
      if (n) {
        const p = JSON.parse(position);
        if (config.direction === 'column')
          p.top += size;
        const warning = new WarningObject({
          // @ts-ignore
          position: p,
          message: n.notification,
          duration: config.duration,
          onMount: (data: any) => {
            lane.push(data.self);
            size += data.height;
            updateLock();
            show();
          },
          onCloseStart: (data: any) => {
            const i = lane.indexOf(data.self);
            if (i > -1) {
              const d = {};
              if (config.direction === 'column')
                d.top = -1 * data.height;
              lane.slice(i + 1).forEach(item => item.move(d));
              size -= data.height;
              lane.splice(i, 1);
            }
          },
          onClose: () => {
            updateLock();
            show();
          },
          styling: n.styling,
        });
        warning.open();
      }
      else {
        updateLock();
      }
    }
  }
  
  function updateLock() {
    lock = lane.length < config.max ? false : true;
  }
</script>
