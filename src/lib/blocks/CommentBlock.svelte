<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export interface CommentBlockModel {
		key?: string;
		type: 'comment';
		seed: number;
		color: ColorName;
		lines: number;
		like?: number;
		dislike?: number;
		draggable?: boolean;
		selectable?: boolean;
	}
</script>

<script lang="ts">
	import { forkSeed, fromSeed } from '@utils/Random';
	import UilThumbsDown from 'svelte-unicons/src/icons/UilThumbsDown.svelte';
	import UilThumbsUp from 'svelte-unicons/src/icons/UilThumbsUp.svelte';
	import ProceduralAvatar from '../components/ProceduralAvatar.svelte';
	import Skeleton from '../components/Skeleton.svelte';
	import ZText from '../components/ZText.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let color: ColorName;
	export let lines: number;
	export let like: number = undefined;
	export let dislike: number = undefined;
	export let draggable = false;
	export let selectable = false;

	let avatarSeed: number;
	let usernameSeed: number;
	let usernameLength: number;
	let contentSeed: number;

	$: {
		const random = fromSeed(seed);

		avatarSeed = forkSeed(random);
		usernameSeed = forkSeed(random);
		contentSeed = forkSeed(random);

		usernameLength = random.int(3, 8);
	}
</script>

<Block class="comment_block {className ?? ''}" key={key ?? `comment`} {color} {draggable} {selectable}>
	<div class="flex space-x-2">
		<ProceduralAvatar seed={avatarSeed} class="flex-shrink-0 flex-grow-0 mt-1 w-12 h-12" />
		<div class="space-y-2 text-gray-400 flex flex-col flex-1">
			<div class="leading-none"><ZText seed={usernameSeed} length={usernameLength} /></div>
			<div>
				<Skeleton
					seed={contentSeed}
					{lines}
					skeletonClassName={(color ?? 'white') === 'white' ? 'bg-slate-300' : `bg-${color ?? 'white'}-300`}
				/>
			</div>
			<div class="text-lg flex justify-end items-center space-x-2">
				<div class="text-green-700 flex items-center">
					<UilThumbsUp size="1em" />
					<div class="ml-1 leading-none" lang="en">{like ?? 0}</div>
				</div>
				<div class="text-red-700 flex items-center">
					<UilThumbsDown size="1em" />
					<div class="ml-1 leading-none" lang="en">{dislike ?? 0}</div>
				</div>
			</div>
		</div>
	</div>
</Block>
