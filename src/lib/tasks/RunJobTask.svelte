<script lang="ts" context="module">
	import { BaseTaskModel } from '@tasks/BaseTask.svelte';

	export class RunJobTaskModel extends BaseTaskModel {
		readonly type = 'run-job';

		score = 4;

		editorKeys: number[] = [];
		sourceKeys: number[] = [];
		correctKeys: string[] = [];

		jobs = 0;

		generate() {
			this.jobs = this.random.int(10, 20);

			this.items = [];

			this.correctKeys = [];
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
	import UilWrench from 'svelte-unicons/src/icons/UilWrench.svelte';
	import CenterList from '../collections/CenterList.svelte';

	export let task: RunJobTaskModel;

	export let submit: (seed: number, correct: boolean) => void;

	let reset = 0;

	function run(correct: boolean) {
		if (!correct) {
			task.submitted = true;
			submit(task.seed, false);
			return;
		}

		if (task.jobs > 0) {
			task.jobs--;
		}

		if (task.jobs === 0) {
			task.submitted = true;
			submit(task.seed, true);
		} else {
			reset++;
		}
	}
</script>

<Desktop>
	<Window color="emerald">
		<div slot="title"><LangText key="job" /></div>
		{#key reset}
			<CenterList>
				<div class="w-full text-3xl grid grid-cols-2 gap-2">
					<div class="col-span-1 place-self-end">
						<LangText key="awaiting" /><LangText key="colon" />
					</div>
					<div class="col-span-1 place-self-start">
						{task.jobs}
					</div>
				</div>
			</CenterList>
		{/key}
		<EditorBar
			slot="footer"
			{task}
			saveKey="run"
			saveColor="emerald"
			on:reset={() => {
				reset++;
			}}
			on:save={() => {
				run(task.check([]));
			}}
		>
			<UilWrench slot="saveIcon" size="1em" />
		</EditorBar>
	</Window>
	<Window color="slate" />
</Desktop>

<style>
	:global([key='text-yellow-later']) {
		text-align: center;
	}
</style>
