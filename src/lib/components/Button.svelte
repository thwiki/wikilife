<script lang="ts">
	import type { ColorName } from '../../utils/Colors';

	let className: string = undefined;

	export { className as class };

	export let color: ColorName;
</script>

<button
	class="inline-flex items-stretch content-center whitespace-nowrap select-none text-xl leading-none text-white bg-{color}-500 shadow-md active:shadow-none hover:bg-{color}-700 transition-colors px-4 py-2 space-x-2 {className ??
		''}"
	on:click
>
	{#if $$slots.prefix}
		<div class="prefix flex flex-shrink-0 flex-grow-0 basis-auto items-center pointer-events-none"><slot name="prefix" /></div>
	{/if}
	<div class="label inline-block"><slot /></div>
	{#if $$slots.suffix}
		<div class="suffix flex flex-shrink-0 flex-grow-0 basis-auto items-center pointer-events-none"><slot name="suffix" /></div>
	{/if}
</button>
