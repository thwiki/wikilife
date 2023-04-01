<script lang="ts">
	import { createEventDispatcher, onDestroy, type ComponentProps, type SvelteComponent } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import modalJpg from '../assets/images/modal.png';

	export let content: typeof SvelteComponent;
	export let props: ComponentProps<SvelteComponent>;

	const dispatch = createEventDispatcher();

	onDestroy(() => {
		dispatch('destroy');
	});

	function onClickBackdrop() {
		dispatch('destroy');
	}
</script>

<div in:fade out:fade class="fixed inset-0 bg-black/50 pointer-events-auto" on:click={onClickBackdrop}>
	<div
		in:fly={{ y: 100 }}
		out:fly={{ y: -100 }}
		class="w-[720px] h-[580px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center overflow-hidden px-16 pt-32 pb-10"
	>
		<img class="absolute inset-0 -z-10 pointer-events-none" src={modalJpg} alt="" width="720" height="580" />
		<svelte:component this={content} {...props} />
	</div>
</div>
