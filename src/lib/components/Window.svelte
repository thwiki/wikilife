<script lang="ts">
	import { ClickOutside } from '@utils/ClickOutside';
	import type { ColorName } from '@utils/Colors';
	import UilQuestion from 'svelte-unicons/src/icons/UilQuestion.svelte';
	import { fade } from 'svelte/transition';

	export let color: ColorName = undefined;

	let showInfo = false;
</script>

<div class="relative w-full h-full bg-white overflow-hidden flex flex-col">
	{#if $$slots.title}
		<div class="title text-xl bg-{color ?? 'slate'}-500 text-white px-4 flex items-center justify-center h-10"><slot name="title" /></div>
	{/if}
	{#if $$slots.info}
		<button
			class="absolute right-2 top-2 text-slate-900 bg-white shadow-md active:shadow-none hover:bg-slate-200 transition-colors rounded-full p-0"
			class:bg-slate-200={showInfo}
			on:click={() => {
				showInfo = !showInfo;
			}}
			use:ClickOutside={() => {
				showInfo = false;
			}}
		>
			<UilQuestion class="text-{color}-500" size="1.5rem" />
		</button>
		{#if showInfo}
			<div
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 200 }}
				class="info absolute top-8 right-0 mt-2 z-10 bg-white border border-slate-300 rounded-md shadow-md w-9/12 p-4"
				role="tooltip"
				on:click|stopPropagation
			>
				<div
					class="absolute w-0 h-0 border-t-0 border-x-6 border-b-8 border-transparent border-b-white bottom-full right-2 -translate-x-1/2"
				/>
				<slot name="info" />
			</div>
		{/if}
	{/if}
	{#if $$slots.header}
		<div class="header bg-slate-200 p-2"><slot name="header" /></div>
	{/if}
	<div class="body flex-1 overflow-hidden"><slot /></div>
	{#if $$slots.footer}
		<div class="footer bg-slate-200 px-4 flex items-center h-12"><slot name="footer" /></div>
	{/if}
</div>
