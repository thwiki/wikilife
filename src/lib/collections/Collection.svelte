<script lang="ts">
	import type { BlockModel } from '@blocks/index';
	import RenderBlock from '@blocks/RenderBlock.svelte';
	import SortableList from '@components/SortableList.svelte';
	import type Sortable from 'sortablejs';
	import { Svrollbar } from 'svrollbar';

	let className: string = undefined;

	export { className as class };
	export let viewportClass: string = undefined;
	export let items: BlockModel[] = [];
	export let keys: number[];
	export let sourceable: Sortable.GroupOptions['pull'] = false;
	export let targetable: Sortable.GroupOptions['put'] = false;
	export let removable = false;
	export let sortable = false;
	export let disabled = false;

	export function getKeys(): string[] {
		return [...list.querySelectorAll<HTMLElement>('[data-key]')].map((element) => element.dataset.key).filter((key) => key != null);
	}

	let viewport: HTMLElement = undefined;
	export let list: HTMLElement = undefined;
	export let length: number = keys.length;

	function updateLength(event: CustomEvent<Sortable.SortableEvent>) {
		length = event.detail.target.children.length;
	}
</script>

<div class="w-full h-full relative">
	<slot name="prefix" />
	<div
		class="viewport w-full h-full p-4 relative overflow-y-scroll overflow-x-hidden touch-auto {viewportClass ?? ''}"
		bind:this={viewport}
	>
		<SortableList
			bind:list
			class="relative min-h-full space-y-2 {className ?? ''}"
			filter=".undraggable"
			group={{ name: 'shared', put: targetable, pull: sourceable ? 'clone' : false }}
			animation={150}
			sort={sortable}
			removeOnSpill={removable}
			{disabled}
			on:add={updateLength}
			on:end={updateLength}
		>
			{#each keys as key}
				<RenderBlock block={items[key]} />
			{/each}
		</SortableList>
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
