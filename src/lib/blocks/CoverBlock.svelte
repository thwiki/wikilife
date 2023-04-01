<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export const CoverVariants = ['original', 'textless', 'blur', 'crop', 'rotate', 'line', 'tint'] as const;

	export type CoverVariantName = (typeof CoverVariants)[number];

	export interface CoverBlockModel {
		key?: string;
		type: 'cover';
		seed: number;
		bgColor: ColorName;
		fgColor: ColorName;
		color: ColorName;
		variant: CoverVariantName;
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import ProceduralCover from '@components/ProceduralCover.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let bgColor: ColorName;
	export let fgColor: ColorName;
	export let color: ColorName;
	export let variant: CoverVariantName;
	export let draggable = false;
</script>

<Block class="cover_block {className ?? ''}" key={key ?? `cover`} color="white" {draggable} fit={true}>
	<ProceduralCover {seed} size="9rem" {bgColor} {fgColor} {color} {variant} />
</Block>
