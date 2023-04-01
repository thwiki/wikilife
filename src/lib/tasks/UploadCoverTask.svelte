<script lang="ts" context="module">
	import { forkSeed, sample, shuffle } from '@utils/Random';

	import { CoverVariants, type CoverBlockModel } from '@blocks/CoverBlock.svelte';
	import { BaseTaskModel } from '@tasks/BaseTask.svelte';
	import { range } from '@utils/Range';

	export class UploadCoverTaskModel extends BaseTaskModel {
		readonly type = 'upload-cover';

		score = 5;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		generate() {
			const blockSeed = forkSeed(this.random);

			const n = this.random.int(3, 5);
			const colors: CoverBlockModel['color'][] = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
			const [bgColor, fgColor, color] = sample(colors, 3, this.random);
			const pickedVariants = shuffle([CoverVariants[0], ...sample(CoverVariants.slice(1), n, this.random)], this.random);

			this.items = [
				...pickedVariants.map((variant, index) => ({
					type: 'cover' as const,
					key: `cover-${index}`,
					seed: blockSeed,
					bgColor,
					fgColor,
					color,
					variant,
					draggable: true,
				})),
				{
					key: 'cover',
					type: 'cover',
					seed: 9961.514,
					bgColor: 'sky',
					fgColor: 'amber',
					color: 'slate',
					variant: 'original',
				},
				{
					type: 'info',
					seed: 565,
					lines: 4,
				},
			];

			this.correctKeys = [`cover-${pickedVariants.indexOf('original')}`];

			this.demoKeys = [this.items.length - 2, this.items.length - 1];
			this.demoAnimations = [{ selector: `[data-key="cover"]`, animation: 'slide-in-right' }];

			this.editorKeys = [];
			this.sourceKeys = range(0, this.items.length - 2);
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import DemoCollection from '@collections/DemoCollection.svelte';
	import DropCollection from '@collections/DropCollection.svelte';
	import SourceCollection from '@collections/SourceCollection.svelte';
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';
	import { UilUpload } from 'svelte-unicons';

	export let task: UploadCoverTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="yellow">
		<div slot="title"><LangText key="upload-file" /></div>
		<div slot="info">
			<DemoCollection items={task.items} keys={task.demoKeys} animations={task.demoAnimations} />
		</div>
		{#key reset}
			<DropCollection items={task.items} keys={task.editorKeys} sortable={true} disabled={task.submitted} bind:getKeys={getResponses} />
		{/key}
		<EditorBar
			slot="footer"
			{task}
			saveKey="upload"
			on:reset={() => reset++}
			on:save={() => {
				task.submitted = true;
				submit(task.seed, task.check(getResponses()));
			}}
		>
			<UilUpload slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="indigo">
		<div slot="title"><LangText key="reference" /></div>
		{#key reset}
			<SourceCollection
				class="grid grid-cols-2 !space-y-0 gap-2 auto-rows-max"
				items={task.items}
				keys={task.sourceKeys}
				disabled={task.submitted}
			/>
		{/key}
	</Window>
</Desktop>

<style>
	:global(.drop_collection) > :global(.cover_block),
	:global(.demo_collection) > :global(.cover_block) {
		aspect-ratio: 1 / 1;
		position: relative;
	}

	:global(.drop_collection) > :global(.cover_block) :global(.cover),
	:global(.demo_collection) > :global(.cover_block) :global(.cover) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: scale(2) translate(-50%, -50%);
		transform-origin: top left;
	}
</style>
