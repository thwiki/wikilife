<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';

	export interface UserBlockModel {
		key?: string;
		type: 'user';
		color: ColorName;
		badges: ColorName[];
		seed: number;
		like: number;
		dislike: number;
		draggable?: boolean;
		selectable?: boolean;
	}
</script>

<script lang="ts">
	import { forkSeed, fromSeed } from '@utils/Random';
	import { UilAngry, UilSmile } from 'svelte-unicons';
	import Badge from '../components/Badge.svelte';
	import ProceduralAvatar from '../components/ProceduralAvatar.svelte';
	import ZText from '../components/ZText.svelte';
	import Block from './Block.svelte';

	let className: string = undefined;

	export { className as class };

	export let key: string = undefined;
	export let seed: number;
	export let color: ColorName;
	export let badges: ColorName[];
	export let like: number = undefined;
	export let dislike: number = undefined;
	export let draggable = false;
	export let selectable = false;

	let avatarSeed: number;
	let usernameSeed: number;
	let usernameLength: number;

	$: {
		const random = fromSeed(seed);

		avatarSeed = forkSeed(random);
		usernameSeed = forkSeed(random);

		usernameLength = random.int(3, 8);
	}
</script>

<Block class="user_block {className ?? ''}" key={key ?? `user`} {color} {draggable} {selectable}>
	<div class="grid grid-cols-12 gap-2 items-center">
		<div class="col-span-5"><ProceduralAvatar class="mx-auto w-24 h-24" seed={avatarSeed} /></div>
		<div class="col-span-7">
			<div><ZText seed={usernameSeed} length={usernameLength} /></div>
			<div class="mt-2 flex space-x-2">
				{#each badges as badge}
					<Badge color={badge} />
				{/each}
			</div>
		</div>
		<div class="col-span-12" />
		<div class="col-span-5" />
		<div class="col-span-2"><UilSmile class="block text-green-500" size="1em" /></div>
		<div class="col-span-5">{like ?? 0}</div>
		<div class="col-span-5" />
		<div class="col-span-2"><UilAngry class="block text-red-500" size="1em" /></div>
		<div class="col-span-5">{dislike ?? 0}</div>
	</div>
</Block>
