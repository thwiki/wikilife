<script lang="ts" context="module">
	import { forkSeed, fromFork, sample } from '@utils/Random';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';
	import { range } from '@utils/Range';
	import type { InfoBlockModel } from '../blocks/InfoBlock.svelte';

	export class FixOrderTaskModel extends BaseTaskModel {
		readonly type = 'fix-order';

		score = 3;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		generate() {
			const blockRandom = fromFork(this.random);

			const n = this.random.int(2, 3);
			const add = this.random.int(1, 2);
			const colors: InfoBlockModel['color'][] = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
			const shuffledColors = sample(colors, n + add, this.random);
			const pickedColors = sample(shuffledColors, n, this.random);
			const titleSeeds = shuffledColors.map(() => forkSeed(blockRandom));

			this.items = [
				{ type: 'info', seed: forkSeed(blockRandom), lines: blockRandom.int(2, 3) },
				...shuffledColors.flatMap((color) => [
					...(pickedColors.includes(color) ? [] : [{ type: 'title' as const, seed: titleSeeds[shuffledColors.indexOf(color)], color }]),
					{ type: 'info' as const, seed: forkSeed(blockRandom), lines: blockRandom.int(1, 3), color },
					{ type: 'info' as const, seed: forkSeed(blockRandom), lines: blockRandom.int(1, 3), color },
					{ type: 'info' as const, seed: forkSeed(blockRandom), lines: blockRandom.int(1, 3), color },
				]),
				{ type: 'info', seed: forkSeed(blockRandom), lines: blockRandom.int(2, 4) },
				...shuffledColors.map((color, i) => ({
					type: 'title' as const,
					seed: titleSeeds[i],
					color,
					draggable: true,
				})),
			];

			this.correctKeys = [
				'info-white',
				...shuffledColors.flatMap((color) => [`title-${color}`, `info-${color}`, `info-${color}`, `info-${color}`]),
				'info-white',
			];

			const demoKey = this.items.findIndex((item) => item.type === 'info' && item.color === pickedColors[0]);
			this.demoKeys = [demoKey - 1, this.items.length - n - add + shuffledColors.indexOf(pickedColors[0]), demoKey, demoKey + 1];
			this.demoAnimations = [{ selector: `[data-key="title-${pickedColors[0]}"]`, animation: 'slide-in-right' }];

			this.editorKeys = range(0, 2 + 3 * n + 4 * add);
			this.sourceKeys = range(this.items.length - n - add, this.items.length);
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

	export let task: FixOrderTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="blue">
		<div slot="title"><LangText key="edit" /></div>
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
	<Window color="slate">
		<div slot="title"><LangText key="code" /></div>
		{#key reset}
			<SourceCollection items={task.items} keys={task.sourceKeys} disabled={task.submitted} />
		{/key}
	</Window>
</Desktop>
