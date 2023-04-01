<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export interface InfoBlockModel {
		key?: string;
		type: 'info';
		seed: number;
		color?: ColorName;
		lines: number;
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import Skeleton from '@components/Skeleton.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let lines: number;
	export let color: ColorName = undefined;
	export let draggable = false;
</script>

<Block class="info_block {className ?? ''}" key={key ?? `info-${color ?? 'white'}`} {color} {draggable}>
	<Skeleton {seed} skeletonClassName={(color ?? 'white') === 'white' ? 'bg-slate-300' : `bg-${color ?? 'white'}-300`} {lines} />
</Block>
