<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount, type ComponentProps, type SvelteComponent } from 'svelte';
	import { fly } from 'svelte/transition';
	import popupJpg from '../assets/images/popup.png';

	export let content: typeof SvelteComponent;
	export let props: ComponentProps<SvelteComponent>;
	export let duration = 1000;

	const dispatch = createEventDispatcher();

	let timeout: number;

	onMount(() => {
		setTimeout(() => {
			dispatch('destroy');
		}, duration);
	});

	onDestroy(() => {
		clearTimeout(timeout);
		dispatch('destroy');
	});
</script>

<div in:fly={{ y: 100 }} out:fly={{ y: -100 }} class="w-[360px] h-[140px] relative flex justify-center overflow-hidden p-4 pt-14">
	<img class="absolute inset-0 -z-10" src={popupJpg} alt="" width="360" height="140" />
	<svelte:component this={content} {...props} />
</div>
