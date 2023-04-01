<script lang="ts" context="module">
	import { forkSeed, fromFork, sample } from '@utils/Random';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';
	import { range } from '@utils/Range';

	import type { InfoBlockModel } from '../blocks/InfoBlock.svelte';

	export class CreatePageTaskModel extends BaseTaskModel {
		readonly type = 'create-page';

		score = 4;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		generate() {
			const blockRandom = fromFork(this.random);

			const n = this.random.int(2, 3) + this.random.int(1, 2);
			const colors: InfoBlockModel['color'][] = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
			const shuffledColors = sample(colors, n + 1, this.random);
			const pickedColors = sample(shuffledColors, n, this.random);

			this.items = [
				{ type: 'info', seed: forkSeed(blockRandom), lines: blockRandom.int(1, 3) },
				...pickedColors.map((color) => ({ type: 'title' as const, seed: forkSeed(blockRandom), color })),
				{ type: 'info', seed: forkSeed(blockRandom), lines: blockRandom.int(2, 4) },
				...shuffledColors.flatMap((color) => [
					{ type: 'info' as const, seed: forkSeed(blockRandom), lines: blockRandom.int(1, 2) + blockRandom.int(0, 2) },
					{ type: 'info' as const, seed: forkSeed(blockRandom), color, lines: blockRandom.int(1, 3), draggable: true },
				]),
				{ type: 'info' as const, seed: forkSeed(blockRandom), lines: blockRandom.int(1, 2) + blockRandom.int(0, 2) },
			];

			this.correctKeys = ['info-white', ...pickedColors.flatMap((color) => [`title-${color}`, `info-${color}`]), 'info-white'];

			this.demoKeys = [0, 1, shuffledColors.indexOf(pickedColors[0]) * 2 + n + 3, n + 1];
			this.demoAnimations = [{ selector: `[data-key="info-${(this.items[1] as InfoBlockModel).color}"]`, animation: 'slide-in-right' }];

			this.editorKeys = range(0, n + 2);
			this.sourceKeys = range(n + 2, this.items.length);
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import EditorCollection from '@collections/EditorCollection.svelte';
	import SourceCollection from '@collections/SourceCollection.svelte';
	import DemoCollection from '../collections/DemoCollection.svelte';
	import Desktop from '../components/Desktop.svelte';
	import EditorBar from '../components/EditorBar.svelte';
	import LangText from '../components/LangText.svelte';
	import Window from '../components/Window.svelte';

	export let task: CreatePageTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="amber">
		<div slot="title"><LangText key="create" /></div>
		<div slot="info">
			<DemoCollection items={task.items} keys={task.demoKeys} animations={task.demoAnimations} />
		</div>
		{#key reset}
			<EditorCollection items={task.items} keys={task.editorKeys} sortable={true} disabled={task.submitted} bind:getKeys={getResponses} />
		{/key}
		<EditorBar
			slot="footer"
			{task}
			on:reset={() => reset++}
			on:save={() => {
				task.submitted = true;
				submit(task.seed, task.check(getResponses()));
			}}
		/>
	</Window>
	<Window color="indigo">
		<div slot="title"><LangText key="reference" /></div>
		{#key reset}
			<SourceCollection items={task.items} keys={task.sourceKeys} disabled={task.submitted} />
		{/key}
	</Window>
</Desktop>
