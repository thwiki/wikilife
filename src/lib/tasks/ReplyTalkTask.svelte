<script lang="ts" context="module">
	import { BaseTaskModel } from '@tasks/BaseTask.svelte';
	import { forkSeed, fromFork } from '@utils/Random';
	import { range } from '@utils/Range';
	import type { TalkBlockModel } from '../blocks/TalkBlock.svelte';

	export class ReplyTalkTaskModel extends BaseTaskModel {
		readonly type = 'reply-talk';

		score = 6;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		waiting = false;
		reply = 2;
		lastScore = 0;

		generate() {
			const blockRandom = fromFork(this.random);

			const colors: TalkBlockModel['color'][] = ['amber', 'emerald', 'cyan', 'purple'];
			const color = this.random.choice(colors);

			const seed1 = forkSeed(blockRandom);
			const seed2 = forkSeed(blockRandom);

			this.items = [
				{
					type: 'talk',
					seed: seed1,
					color: 'white',
					lines: 2,
				},
				{
					type: 'talk',
					seed: seed2,
					color,
					lines: 2,
					draggable: true,
				},
				{
					type: 'talk',
					seed: seed1,
					color: 'white',
					lines: 1,
				},
				{
					type: 'talk',
					seed: seed2,
					color,
					lines: 1,
					draggable: true,
				},
				{
					type: 'text',
					color: 'yellow',
					text: 'later',
				},
			];

			this.correctKeys = [`talk-white`, `talk-${color}`];

			this.demoKeys = range(0, 2);
			this.demoAnimations = [{ selector: `[data-key="talk-${color}"]`, animation: 'slide-in-right' }];

			this.editorKeys = [0];
			this.sourceKeys = [1];
		}

		check(responseKeys: string[]) {
			return responseKeys.join('|') === this.correctKeys.join('|');
		}
	}
</script>

<script lang="ts">
	import Desktop from '@components/Desktop.svelte';
	import EditorBar from '@components/EditorBar.svelte';
	import LangText from '@components/LangText.svelte';
	import Window from '@components/Window.svelte';
	import { getContext } from 'svelte';
	import { UilMessage } from 'svelte-unicons';
	import type { AppState } from '../../Game.svelte';
	import DemoCollection from '../collections/DemoCollection.svelte';
	import EditorCollection from '../collections/EditorCollection.svelte';
	import SourceCollection from '../collections/SourceCollection.svelte';

	const { score } = getContext<AppState>('state');

	export let task: ReplyTalkTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	function reply(correct: boolean) {
		if (!correct) {
			task.submitted = true;
			submit(task.seed, false);
			return;
		}

		if (task.reply > 0) {
			task.editorKeys = [0, 1, 4];
			task.reply--;
			task.lastScore = $score;
		}

		if (task.reply === 0) {
			task.waiting = false;
			task.submitted = true;
			submit(task.seed, true);
		} else {
			reset++;
		}
	}

	$: {
		if ($score !== task.lastScore && task.waiting) {
			task.pristine = true;
			task.waiting = false;
			task.editorKeys = [0, 1, 2];
			task.sourceKeys = [3];
			task.correctKeys = [task.correctKeys[0], task.correctKeys[1], task.correctKeys[0], task.correctKeys[1]];
		}
	}

	let getResponses: () => string[];
</script>

<Desktop>
	<Window color="emerald">
		<div slot="title"><LangText key="talk" /></div>
		<div slot="info">
			<DemoCollection items={task.items} keys={task.demoKeys} animations={task.demoAnimations} />
		</div>
		{#key reset}
			<EditorCollection items={task.items} keys={task.editorKeys} disabled={task.submitted || task.waiting} bind:getKeys={getResponses} />
		{/key}
		<EditorBar
			slot="footer"
			{task}
			saveKey={task.waiting ? 'waiting' : 'reply'}
			saveColor={task.waiting ? 'slate' : 'emerald'}
			on:reset={() => {
				if (task.waiting) return;
				reset++;
			}}
			on:save={() => {
				if (task.waiting) return;
				task.waiting = true;
				reply(task.check(getResponses()));
			}}
		>
			<UilMessage slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="slate">
		<div slot="title"><LangText key="reply" /></div>
		{#key reset}
			<SourceCollection items={task.items} keys={task.sourceKeys} disabled={task.submitted || task.waiting} />
		{/key}
	</Window>
</Desktop>

<style>
	:global([key='text-yellow-later']) {
		text-align: center;
	}
</style>
