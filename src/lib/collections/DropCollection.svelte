<script lang="ts">
	import Collection from '@collections/Collection.svelte';
	import type Sortable from 'sortablejs';
	import type { ComponentProps } from 'svelte';
	import { UilFileUpload } from 'svelte-unicons';
	import InfoBlock from '../blocks/InfoBlock.svelte';
	import LangText from '../components/LangText.svelte';

	let className: string = undefined;

	export { className as class };
	export let items: ComponentProps<Collection>['items'] = [];
	export let keys: number[];
	export let limit = 1;
	export let sortable = false;
	export let removable = true;
	export let disabled = false;

	let length: number = keys.length;

	const targetable: Sortable.GroupOptions['put'] = (to) => {
		return to.el.children.length < limit;
	};

	export let getKeys: () => string[] = undefined;
</script>

<Collection
	bind:getKeys
	bind:length
	class="drop_collection {className ?? ''}"
	{items}
	{keys}
	{targetable}
	sortable={sortable ?? false}
	removable={removable ?? true}
	{disabled}
>
	<div slot="prefix" class="absolute inset-0 flex flex-col items-center justify-center text-3xl pointer-events-none text-blue-500">
		<div class="mt-auto flex flex-col items-center space-y-2" class:hidden={length !== 0}>
			<UilFileUpload size="5rem" class="inline" />
			<LangText key="select-file" />
		</div>
		<div class="mt-auto w-full p-4"><InfoBlock seed={565} lines={4} /></div>
	</div>
</Collection>
