<script lang="ts" context="module">
	import { forkSeed, fromFork, shuffle } from '@utils/Random';
	import { range } from '@utils/Range';
	import type { TalkBlockModel } from '../blocks/TalkBlock.svelte';

	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	export class CloseTalkTaskModel extends BaseTaskModel {
		readonly type = 'close-talk';

		score = 3;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		generate() {
			const blockRandom = fromFork(this.random);

			const n = 4;

			const reactions: TalkBlockModel['reaction'][] = ['smile', 'angry', ...range(0, n - 2).map(() => 'confused' as const)];
			const shuffledReactions = shuffle(reactions, this.random);
			const closeIndex = shuffledReactions.indexOf('smile');

			this.items = [
				...shuffledReactions.map((reaction, index) => ({
					key: `talk-${index}`,
					type: 'talk' as const,
					seed: forkSeed(blockRandom),
					color: 'white' as const,
					lines: 1,
					reaction,
					selectable: true,
				})),
				{
					type: 'talk',
					key: 'talk-demo',
					seed: forkSeed(blockRandom),
					color: 'white',
					lines: 1,
					reaction: 'smile',
				},
			];

			this.correctKeys = [`talk-${closeIndex}`];

			this.demoKeys = range(this.items.length - 1, this.items.length);
			this.demoAnimations = [{ selector: `[data-key="talk-demo"]`, animation: 'select' }];

			this.editorKeys = range(0, this.items.length - 1);
			this.sourceKeys = range(0, this.items.length);
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import CenterList from '@collections/CenterList.svelte';
	import DemoList from '@collections/DemoList.svelte';
	import List from '@collections/List.svelte';
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';
	import UilCheck from 'svelte-unicons/src/icons/UilCheck.svelte';
	import UilSmileBeam from 'svelte-unicons/src/icons/UilSmileBeam.svelte';

	export let task: CloseTalkTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="cyan">
		<div slot="title"><LangText key="talk" /></div>
		<div slot="info">
			<DemoList items={task.items} keys={task.demoKeys} animations={task.demoAnimations} />
		</div>
		{#key reset}
			<List items={task.items} keys={task.editorKeys} disabled={task.submitted} bind:getKeys={getResponses} />
		{/key}
		<EditorBar
			slot="footer"
			{task}
			saveKey="close-talk"
			saveColor="green"
			on:reset={() => reset++}
			on:save={() => {
				task.submitted = true;
				submit(task.seed, task.check(getResponses()));
			}}
		>
			<UilCheck slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="slate">
		<div slot="title"><LangText key="guideline" /></div>
		<CenterList class="space-y-2">
			<div class="text-4xl leading-none flex space-x-2">
				<div class="text-green-500">
					<UilSmileBeam size="1em" />
				</div>
				<UilCheck size="1em" />
			</div>
		</CenterList>
	</Window>
</Desktop>
