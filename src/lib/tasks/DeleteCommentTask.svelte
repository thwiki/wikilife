<script lang="ts" context="module">
	import { forkSeed, fromFork } from '@utils/Random';
	import { range } from '@utils/Range';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	export class DeleteCommentTaskModel extends BaseTaskModel {
		readonly type = 'delete-comment';

		score = 4;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		generate() {
			const blockRandom = fromFork(this.random);

			const n = 5;

			const deleteIndex = this.random.int(0, n - 1);

			const paretoLikes = this.random.pareto(0.8);
			const likes = range(0, n).map(() => Math.round(paretoLikes()));

			const paretoDislikes = this.random.pareto(1);
			const dislikes = range(0, n).map(() => Math.round(paretoDislikes()));

			const maxDislikes = Math.max(...dislikes);

			this.items = [
				...likes.map((like, i) => ({
					key: `comment-${i}`,
					type: 'comment' as const,
					seed: forkSeed(blockRandom),
					color: 'white' as const,
					lines: 1,
					like,
					dislike:
						i === deleteIndex
							? maxDislikes + this.random.int(Math.round(like * 4), Math.round(like * 12))
							: this.random.int(0, Math.min(Math.max(like - 10, 0), Math.floor(like * 0.75))),
					selectable: true,
				})),
				{
					key: `comment-demo`,
					type: 'comment',
					seed: 907,
					color: 'white',
					lines: 1,
					like: 5,
					dislike: 24,
					selectable: false,
				},
			];

			this.correctKeys = [`comment-${deleteIndex}`];

			this.demoKeys = [this.items.length - 1];
			this.demoAnimations = [{ selector: `[data-key="comment-demo"]`, animation: 'select' }];

			this.editorKeys = range(0, this.items.length - 1);
			this.sourceKeys = [];
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import List from '@collections/List.svelte';
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';
	import UilThumbsDown from 'svelte-unicons/src/icons/UilThumbsDown.svelte';
	import UilThumbsUp from 'svelte-unicons/src/icons/UilThumbsUp.svelte';
	import UilTrashAlt from 'svelte-unicons/src/icons/UilTrashAlt.svelte';
	import CenterList from '../collections/CenterList.svelte';
	import DemoList from '../collections/DemoList.svelte';

	export let task: DeleteCommentTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="cyan">
		<div slot="title"><LangText key="reported-comment" /></div>
		<div slot="info">
			<DemoList items={task.items} keys={task.demoKeys} animations={task.demoAnimations} />
		</div>
		{#key reset}
			<List items={task.items} keys={task.editorKeys} disabled={task.submitted} bind:getKeys={getResponses} />
		{/key}
		<EditorBar
			slot="footer"
			{task}
			saveKey="delete"
			saveColor="red"
			on:reset={() => reset++}
			on:save={() => {
				task.submitted = true;
				submit(task.seed, task.check(getResponses()));
			}}
		>
			<UilTrashAlt slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="slate">
		<div slot="title"><LangText key="guideline" /></div>
		<CenterList>
			<div class="text-4xl leading-none flex space-x-2">
				<UilThumbsDown class="text-red-700" size="1em" />
				<LangText key="greater-than" lang="en" />
				<UilThumbsUp class="text-green-700" size="1em" />
				<LangText key="equal" lang="en" />
				<UilTrashAlt class="text-amber-700" size="1em" />
			</div>
		</CenterList>
	</Window>
</Desktop>
