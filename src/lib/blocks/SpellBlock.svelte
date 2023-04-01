<script lang="ts" context="module">
	export interface SpellBlockModel {
		key?: string;
		type: 'spell';
		seed: number;
		frame: number;
		draggable?: boolean;
	}
</script>

<script lang="ts">
	import ProceduralSpell from '@components/ProceduralSpell.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let frame: number;
	export let draggable = false;
</script>

<Block class="spell_block {className ?? ''}" key={key ?? `spell-${Math.floor(frame)}`} color="white" {draggable} fit={true}>
	<ProceduralSpell {seed} {frame} />
</Block>
