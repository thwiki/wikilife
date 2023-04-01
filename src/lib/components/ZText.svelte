<script lang="ts">
	import { fromSeed } from '@utils/Random';
	import type { ComponentProps } from 'svelte';
	import { range } from '../../utils/Range';
	import LangText from './LangText.svelte';

	export let seed = 0;
	export let length = 0;
	export let charClass = '';
	export let svg: boolean = undefined;

	const CharList: ComponentProps<LangText>['key'][] = [
		'z01',
		'z02',
		'z03',
		'z04',
		'z05',
		'z06',
		'z07',
		'z08',
		'z09',
		'z10',
		'z11',
		'z12',
		'z13',
	];
	let chars: (typeof CharList)[number][] = [];

	$: {
		const random = fromSeed(seed);

		chars = range(0, length).map(() => random.choice(CharList));
	}
</script>

{#each chars as char}
	<LangText key={char} lang="zs" class={charClass} {svg} />
{/each}
