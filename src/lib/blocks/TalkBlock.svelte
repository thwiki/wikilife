<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export interface TalkBlockModel {
		key?: string;
		type: 'talk';
		seed: number;
		color?: ColorName;
		lines: number;
		reaction?: 'smile' | 'confused' | 'angry';
		draggable?: boolean;
		selectable?: boolean;
	}
</script>

<script lang="ts">
	import { forkSeed, fromSeed } from '@utils/Random';
	import { UilAngry, UilConfused, UilCornerDownLeft, UilSmileBeam } from 'svelte-unicons';
	import ProceduralAvatar from '../components/ProceduralAvatar.svelte';
	import Skeleton from '../components/Skeleton.svelte';
	import ZText from '../components/ZText.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let color: ColorName = undefined;
	export let lines: number;
	export let reaction: TalkBlockModel['reaction'] = undefined;
	export let draggable = false;
	export let selectable = false;

	let titleSeed: number;
	let titleLength: number;
	let avatarSeed: number;
	let usernameSeed: number;
	let usernameLength: number;
	let contentSeed: number;

	$: {
		const random = fromSeed(seed);

		titleSeed = forkSeed(random);
		titleLength = random.int(8, 14);
		avatarSeed = forkSeed(random);
		usernameSeed = forkSeed(random);
		contentSeed = forkSeed(random);

		usernameLength = random.int(3, 8);
	}
</script>

<Block class="talk_block {className ?? ''}" key={key ?? `talk-${color}`} color={color ?? 'white'} {draggable} {selectable}>
	<div class="py-2 px-4 mb-2 -mx-4 -mt-2 {(color ?? 'white') === 'white' ? 'bg-slate-200' : `bg-${color ?? 'white'}-700`}">
		<ZText seed={titleSeed} length={titleLength} />
	</div>
	<div class="flex items-center space-x-2">
		<ProceduralAvatar seed={avatarSeed} class="flex-shrink-0 flex-grow-0 w-6 h-6" />
		<div class="leading-none"><ZText seed={usernameSeed} length={usernameLength} /></div>
	</div>
	<div class="flex space-x-2 mt-2">
		<div class="space-x-2 text-gray-400 flex flex-1 items-end">
			<div class="flex-1">
				<Skeleton
					seed={contentSeed}
					{lines}
					skeletonClassName={(color ?? 'white') === 'white' ? 'bg-slate-300' : `bg-${color ?? 'white'}-300`}
				/>
			</div>
			<div class="text-lg flex justify-end items-center space-x-2">
				{#if reaction === 'smile'}
					<UilSmileBeam class="text-green-500" size="1em" />
				{:else if reaction === 'confused'}
					<UilConfused class="text-amber-500" size="1em" />
				{:else if reaction === 'angry'}
					<UilAngry class="text-red-500" size="1em" />
				{/if}
				<UilCornerDownLeft size="1em" />
			</div>
		</div>
	</div>
</Block>
