<script lang="ts" context="module">
	import { forkSeed, fromFork, sample } from '@utils/Random';
	import { range } from '@utils/Range';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	import type { CellBlockModel } from '@blocks/CellBlock.svelte';

	export class InputMangaTaskModel extends BaseTaskModel {
		readonly type = 'input-manga';

		score = 4;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		generate() {
			const blockRandom = fromFork(this.random);

			const yDivs = [0, this.random.int(25, 40), this.random.int(60, 75), 100];
			const xDivss: number[][] = [];
			let totalCells = 0;

			for (let xIndex = 0; xIndex < 2 * (yDivs.length - 1); xIndex++) {
				if (xIndex % 2) {
					const xDivsPrev = xDivss[xIndex - 1];

					if (xDivsPrev.length >= 4) {
						xDivss[xIndex] = [...xDivsPrev];
						const shiftIndex = this.random.int(1, xDivsPrev.length - 2);
						xDivss[xIndex][shiftIndex] = this.random.int(
							Math.round((xDivsPrev[shiftIndex - 1] + xDivsPrev[shiftIndex]) / 2),
							Math.round((xDivsPrev[shiftIndex + 1] + xDivsPrev[shiftIndex]) / 2),
						);
					} else {
						xDivss[xIndex] = xDivsPrev.map((xDivPrev) => {
							if (xDivPrev === 0 || xDivPrev === 100) {
								return xDivPrev;
							}
							if (xDivPrev < 40) {
								return xDivPrev + this.random.int(0, 20);
							}
							if (xDivPrev <= 60) {
								return xDivPrev + this.random.int(-20, 20);
							}
							return xDivPrev - this.random.int(0, 20);
						});
					}
				} else {
					if (this.random.float(0, 1) < 0.75) {
						xDivss[xIndex] = [0, this.random.int(30, 70), 100];
						totalCells += 2;
					} else {
						xDivss[xIndex] = [0, this.random.int(25, 40), this.random.int(60, 75), 100];
						totalCells += 3;
					}
				}
			}

			const n = Math.min(5, totalCells);
			const colors: CellBlockModel['color'][] = [
				'red',
				'orange',
				'yellow',
				'green',
				'blue',
				'cyan',
				'purple',
				'amber',
				'sky',
				'pink',
				'teal',
			];
			const pickedColors = sample(colors, n, this.random);
			const pickedCells = sample(range(0, totalCells), n, this.random);

			this.items = [];

			let cellIndex = 0;
			for (let yIndex = 1; yIndex < yDivs.length; yIndex++) {
				const yDivPrev = yDivs[yIndex - 1];
				const yDiv = yDivs[yIndex];

				const topLine = xDivss[yIndex * 2 - 2];
				const bottomLine = xDivss[yIndex * 2 - 1];

				for (let xIndex = 1; xIndex < topLine.length; xIndex++) {
					const topXDivPrev = topLine[xIndex - 1];
					const topXDiv = topLine[xIndex];
					const bottomXDivPrev = bottomLine[xIndex - 1];
					const bottomXDiv = bottomLine[xIndex];

					const colorIndex = pickedCells.indexOf(cellIndex);
					const hasColor = colorIndex !== -1;
					this.items.push({
						type: 'cell',
						color: hasColor ? pickedColors[colorIndex] : 'white',
						seed: forkSeed(blockRandom),
						corners: [
							[topXDivPrev, yDivPrev],
							[topXDiv, yDivPrev],
							[bottomXDiv, yDiv],
							[bottomXDivPrev, yDiv],
						],
						text: hasColor,
						draggable: true,
					});
					++cellIndex;
				}
			}

			const sortedAnswers = this.items
				.filter((item): item is CellBlockModel => item.type === 'cell' && item.color !== 'white')
				.sort((a, b) => {
					const aPoint = a.corners[1];
					const bPoint = b.corners[1];
					return aPoint[1] === bPoint[1] ? bPoint[0] - aPoint[0] : aPoint[1] - bPoint[1];
				});

			this.correctKeys = [...sortedAnswers.map((item) => `cell-${item.color}`)];

			this.demoKeys = [this.items.indexOf(sortedAnswers[0]), this.items.indexOf(sortedAnswers[1])];
			this.demoAnimations = [{ selector: `[data-key="cell-${sortedAnswers[1].color}"]`, animation: 'slide-in-right' }];

			this.editorKeys = [];
			this.sourceKeys = range(0, this.items.length);
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import DemoCollection from '@collections/DemoCollection.svelte';
	import EditorCollection from '@collections/EditorCollection.svelte';
	import SourceCollection from '@collections/SourceCollection.svelte';
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';

	export let task: InputMangaTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="yellow">
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
	<Window color="pink">
		<div slot="title"><LangText key="manga" /></div>
		{#key reset}
			<SourceCollection class="!space-y-0" items={task.items} keys={task.sourceKeys} disabled={task.submitted} />
		{/key}
	</Window>
</Desktop>

<style>
	:global(.editor_collection) :global(.cell_block),
	:global(.demo_collection) :global(.cell_block) {
		position: static !important;
		margin-left: auto;
		margin-right: auto;
	}
	:global(.editor_collection) :global(.cell_block) :global(svg),
	:global(.demo_collection) :global(.cell_block) :global(svg) {
		width: 50%;
		transform: translateX(50%);
	}
</style>
