<script lang="ts">
	import Collection from '@collections/Collection.svelte';
	import type { ComponentProps } from 'svelte';

	let className: string = undefined;

	export { className as class };
	export let items: ComponentProps<Collection>['items'] = [];
	export let keys: number[];
	export let disabled = false;

	export let getKeys: () => string[] = undefined;
</script>

<Collection bind:getKeys class="source_collection {className ?? ''}" {items} {keys} sourceable={true} {disabled} />
