<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export interface ChangeBlockModel {
		key?: string;
		type: 'change';
		seed: number;
		color: ColorName;
		keywordColor: ColorName;
		keywordSeed: number;
		keywordLength: number;
		time: number;
		draggable?: boolean;
		selectable?: boolean;
	}
</script>

<script lang="ts">
	import { forkSeed, fromSeed } from '@utils/Random';
	import LangText from '../components/LangText.svelte';
	import ProceduralAvatar from '../components/ProceduralAvatar.svelte';
	import ZText from '../components/ZText.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let color: ColorName;
	export let keywordColor: ColorName;
	export let keywordSeed: number;
	export let keywordLength: number;
	export let time: number;
	export let draggable = false;
	export let selectable = false;

	let prefixSeed: number;
	let prefixLength: number;
	let suffixSeed: number;
	let suffixLength: number;
	let avatarSeed: number;
	let changeLength: number;

	$: {
		const random = fromSeed(seed);

		prefixSeed = forkSeed(random);
		prefixLength = random.int(0, 3);
		suffixSeed = forkSeed(random);
		suffixLength = random.int(0, 3);

		avatarSeed = forkSeed(random);
		changeLength = random.int(0, 32) * 3;
	}
</script>

<Block class="change_block {className ?? ''}" key={key ?? `change`} {color} {draggable} {selectable}>
	<div class="flex space-x-4">
		<div class="text-slate-700">
			{Math.floor(time / 60)
				.toFixed(0)
				.padStart(2, '0')}:{(time % 60).toFixed(0).padStart(2, '0')}
		</div>
		<div>
			<ZText seed={prefixSeed} length={prefixLength} /><span class="text-{keywordColor}-500"
				><ZText seed={keywordSeed} length={keywordLength} /></span
			><ZText seed={suffixSeed} length={suffixLength} />
		</div>
		<div>..</div>
		<div class={changeLength < 0 ? 'text-red-700' : 'text-green-700'}>
			<LangText key="open-bracket" />{changeLength < 0 ? '' : '+'}{changeLength}<LangText key="close-bracket" />
		</div>
		<div>..</div>
		<div class="flex items-center space-x-1">
			<ProceduralAvatar seed={avatarSeed} class="w-6 h-6" />
		</div>
	</div>
</Block>
