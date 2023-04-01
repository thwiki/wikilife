<script lang="ts" context="module">
	import { forkSeed, fromFork, shuffle } from '@utils/Random';
	import { range } from '@utils/Range';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	export class DeleteProblemTaskModel extends BaseTaskModel {
		readonly type = 'delete-problem';

		score = 8;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];
		deleteSeeds: number[];

		generate() {
			const blockRandom = fromFork(this.random);

			const n = 8;

			const deleteIndex = this.random.int(0, n - 1);
			const keywordSeeds = range(0, n).map(() => forkSeed(this.random));
			this.deleteSeeds = shuffle([keywordSeeds[deleteIndex], forkSeed(this.random)], this.random);

			let time = this.random.int(0, 1440);

			this.items = [
				...keywordSeeds.map((keywordSeed, i) => ({
					key: `change-${i}`,
					type: 'change' as const,
					seed: forkSeed(blockRandom),
					color: 'white' as const,
					keywordColor: 'red' as const,
					keywordSeed,
					keywordLength: 3,
					time: (time = (1440 + time - this.random.int(0, 10)) % 1440),
					selectable: true,
				})),
				{
					key: `change-demo`,
					type: 'change' as const,
					seed: forkSeed(blockRandom),
					color: 'white' as const,
					keywordColor: 'red' as const,
					keywordSeed: this.deleteSeeds[0],
					keywordLength: 3,
					time: time,
					selectable: true,
				},
			];

			this.correctKeys = [`change-${deleteIndex}`];

			this.demoKeys = [this.items.length - 1];
			this.demoAnimations = [{ selector: `[data-key="change-demo"]`, animation: 'select' }];

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
	import { UilTrashAlt } from 'svelte-unicons';
	import CenterList from '../collections/CenterList.svelte';
	import DemoList from '../collections/DemoList.svelte';
	import ZText from '../components/ZText.svelte';

	export let task: DeleteProblemTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="cyan">
		<div slot="title"><LangText key="recent-change" /></div>
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
		<CenterList class="space-y-2">
			{#each task.deleteSeeds as deleteSeed}
				<div class="text-4xl leading-none flex space-x-2">
					<div class="text-red-500">
						<ZText seed={deleteSeed} length={3} />
					</div>
					<UilTrashAlt size="1em" />
				</div>
			{/each}
		</CenterList>
	</Window>
</Desktop>
