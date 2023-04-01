<script lang="ts">
	import Collection from '@collections/Collection.svelte';
	import type Sortable from 'sortablejs';
	import type { ComponentProps } from 'svelte';

	let className: string = undefined;

	export { className as class };
	export let items: ComponentProps<Collection>['items'] = [];
	export let keys: number[];
	export let targetable: Sortable.GroupOptions['put'] = undefined;
	export let sortable = false;
	export let removable = true;
	export let disabled = false;

	export let list: HTMLElement = undefined;
	export let getKeys: () => string[] = undefined;
</script>

<Collection
	bind:getKeys
	bind:list
	class="editor_collection {className ?? ''}"
	{items}
	{keys}
	targetable={targetable ?? true}
	sortable={sortable ?? false}
	removable={removable ?? true}
	{disabled}
/>
