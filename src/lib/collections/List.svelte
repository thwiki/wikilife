<script lang="ts">
	import type { BlockModel } from '@blocks/index';
	import RenderBlock from '@blocks/RenderBlock.svelte';
	import { Svrollbar } from 'svrollbar';
	import SelectableList from '../components/SelectableList.svelte';

	let className: string = undefined;

	export { className as class };
	export let viewportClass: string = undefined;
	export let items: BlockModel[] = [];
	export let keys: number[];
	export let disabled = false;

	export function getKeys(): string[] {
		return [...list.querySelectorAll<HTMLElement>('.selectable-selected[data-key]')]
			.map((element) => element.dataset.key)
			.filter((key) => key != null);
	}

	let viewport: HTMLElement = undefined;
	export let list: HTMLElement = undefined;
	export const length: number = keys.length;
</script>

<div class="w-full h-full relative">
	<slot name="prefix" />
	<div
		class="viewport w-full h-full p-4 relative overflow-y-scroll overflow-x-hidden touch-auto {viewportClass ?? ''}"
		bind:this={viewport}
	>
		<SelectableList
			bind:list
			class="relative min-h-full space-y-2 {className ?? ''}"
			filter=".unselectable"
			selectedClass="selectable-selected"
			{disabled}
		>
			{#each keys as key}
				<RenderBlock block={items[key]} />
			{/each}
		</SelectableList>
	</div>
	<slot name="suffix" />
	<Svrollbar {viewport} contents={list} alwaysVisible={true} />
</div>

<style>
	.viewport {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.viewport::-webkit-scrollbar {
		display: none;
	}
</style>
