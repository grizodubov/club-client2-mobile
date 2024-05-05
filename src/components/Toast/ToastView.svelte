<script lang="ts">
	import { onMount } from 'svelte';

	export let position = null;
	export let message = '';
	export let duration = 0;

	export let _state = 'open';
	export let _events: any = null;

	let wrapper: any;
	let height = 0;
	let tm: any = null;
	let lock = false;

	$: pos = position ?
		Object.entries(position).map(
			(p: any) => [ p[0], ': ', p[1].toString(), typeof p[1] === 'number' ? 'px' : '' ].join('')
		).join('; ') + ';' :
		'';

	onMount(() => {
		height = wrapperHeight();
		if (_events && _events._onMount) {
			const callback = _events._onMount;
			callback({ height: height });
		}
		if (duration) {
			tm = setTimeout(close, duration);
		}
	});

	const eventName = 'WebkitTransition' in document.documentElement.style ? 'webkitTransitionEnd' : 'transitionend';
	
	function close() {
		if (!lock) {
			lock = true;
			if (tm)
				clearTimeout(tm);
			if (_events && _events._onCloseStart) {
				const callback = _events._onCloseStart;
				callback({ height: height });
			}
			wrapper.addEventListener(eventName, () => {
				if (_events && _events._onClose) {
					const callback = _events._onClose;
					callback({ height: height });
				}
				else {
					wrapper.parentNode.removeChild(wrapper);
				}
			}, { once: true });
			_state = 'close';
		}
	}
	
	function wrapperHeight() {
		const styles = window.getComputedStyle(wrapper);
		return wrapper.offsetHeight + Math.round(parseFloat(styles['marginBottom']));
	}
</script>


<style>
	.positioned {
		position: absolute;
		z-index: 102;
	}

	.opened {
		margin-top: 0px;
		opacity: 1;
	}
	
	.closed {
		margin-top: 0px;
		opacity: 0;
	}
</style>


<div
	class="flex justify-between items-start box-border p-4 w-[240px] bg-scene text-base-100 rounded-lg mt-3 mb-6 text-sm transition-all opacity-0 border-2 border-base-100"
	class:positioned="{pos}"
	class:opened="{_state == 'open'}"
	class:closed="{_state == 'close'}"
	style="{pos}"
	bind:this="{wrapper}"
>
	<div class="text-sm">{message}</div>
</div>
