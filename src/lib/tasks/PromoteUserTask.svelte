<script lang="ts" context="module">
	import type { ColorName } from '@utils/Colors';
	import { forkSeed, fromFork, sample, shuffle } from '@utils/Random';

	import type { InfoBlockModel } from '@blocks/InfoBlock.svelte';
	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	export class PromoteUserTaskModel extends BaseTaskModel {
		readonly type = 'promote-user';

		score = 10;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		badges: {
			color: ColorName;
			like: number;
			dislike: number;
		}[] = [];

		generate() {
			const blockRandom = fromFork(this.random);

			const isAllow = this.random.bool();
			const colors: InfoBlockModel['color'][] = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];

			const pickedColors = sample(colors, 4, this.random);
			const extraColor = pickedColors.shift();
			const matchedColor = this.random.choice(pickedColors);
			const matchedValue = this.random.int(1, 3);
			const badges = shuffle([matchedColor, extraColor], this.random);

			const userLike = this.random.int(100, 500);
			const userDislike = this.random.int(30, 60);

			this.items = [
				{
					type: 'user',
					color: 'white',
					badges,
					seed: forkSeed(blockRandom),
					like: userLike,
					dislike: userDislike,
				},
			];

			this.badges = pickedColors.map((color) => {
				let like = 0;
				let dislike = 0;

				if (color === matchedColor) {
					if (isAllow) {
						like = this.random.int(userLike - 100, userLike - 5); // < user
						dislike = this.random.int(userDislike + 5, userDislike + 60); // > user
					} else {
						if (matchedValue === 1) {
							like = this.random.int(userLike + 5, userLike + 100); // > user
							dislike = this.random.int(userDislike + 5, userDislike + 60); // > user
						} else if (matchedValue === 2) {
							like = this.random.int(userLike - 100, userLike - 5); // < user
							dislike = this.random.int(20, userDislike - 5); // < user
						} else {
							like = this.random.int(userLike + 5, userLike + 100); // > user
							dislike = this.random.int(20, userDislike - 5); // < user
						}
					}
				} else {
					like = this.random.int(userLike - 100, userLike + 100);
					dislike = this.random.int(20, userDislike + 60);
				}

				return {
					color,
					like,
					dislike,
				};
			});

			this.correctKeys = [isAllow ? 'user-approve' : 'user-reject'];

			this.editorKeys = [0];
			this.sourceKeys = [];
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import Block from '@blocks/Block.svelte';
	import RenderBlock from '@blocks/RenderBlock.svelte';
	import CenterList from '@collections/CenterList.svelte';
	import Badge from '@components/Badge.svelte';
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';
	import { UilAngry, UilCheck, UilMultiply, UilSmile } from 'svelte-unicons';

	export let task: PromoteUserTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;
</script>

<Desktop>
	<Window color="cyan">
		<div slot="title"><LangText key="user-info" /></div>
		{#key reset}
			<CenterList>
				<RenderBlock class="w-full text-3xl leading-none" block={task.items[task.editorKeys[0]]} />
			</CenterList>
		{/key}
		<EditorBar
			slot="footer"
			{task}
			resetKey="reject"
			resetColor="red"
			saveKey="approve"
			saveColor="green"
			on:reset={() => {
				task.submitted = true;
				submit(task.seed, task.check(['user-reject']));
			}}
			on:save={() => {
				task.submitted = true;
				submit(task.seed, task.check(['user-approve']));
			}}
		>
			<UilMultiply slot="resetIcon" size="1em" />
			<UilCheck slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="slate">
		<div slot="title"><LangText key="approve-criteria" /></div>
		<CenterList class="space-y-2 text-3xl">
			{#each task.badges as badge}
				<Block key="" class="w-full" contentClass="flex space-x-4 items-center">
					<div class="">
						<Badge color={badge.color} />
					</div>
					<div class="">
						<div class="flex space-x-2 items-center">
							<UilSmile class="text-green-500" size="1em" />
							<LangText key="greater-than" lang="en" />
							<div>{badge.like}</div>
						</div>
						<div class="flex space-x-2 items-center">
							<UilAngry class="text-red-500" size="1em" />
							<LangText key="less-than" lang="en" />
							<div>{badge.dislike}</div>
						</div>
					</div>
				</Block>
			{/each}
		</CenterList>
	</Window>
</Desktop>
