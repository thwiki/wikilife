<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export interface TitleBlockModel {
		key?: string;
		type: 'title';
		seed: number;
		color: ColorName;
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import LangText from '../components/LangText.svelte';
	import SkeletonInline from '../components/SkeletonInline.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let color: ColorName = undefined;
	export let draggable = false;
</script>

<Block class="title_block {className ?? ''}" key={key ?? `title-${color ?? 'white'}`} {draggable} contentClass="text-black leading-3">
	<div class="flex items-center space-x-3">
		<div class="prefix"><LangText key="code-title" lang="en" /></div>
		<SkeletonInline {seed} chars={5} skeletonClassName={(color ?? 'white') === 'white' ? 'bg-slate-500' : `bg-${color ?? 'white'}-500`} />
		<div class="suffix"><LangText key="code-title" lang="en" /></div>
	</div>
</Block>
