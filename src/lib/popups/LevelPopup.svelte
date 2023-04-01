<script lang="ts">
	import LangText from '../components/LangText.svelte';
	import { TaskComponentMap, TaskModels } from '../tasks';

	export let level: 0 | 1 | 2 | 3 = 0;

	let tasks: (keyof typeof TaskComponentMap)[] = [];

	$: {
		tasks = TaskModels.slice(4 * level, 4 * (level + 1)).map((t) => new t(0).type);
	}
</script>

<div class="flex flex-col items-center text-2xl pointer-events-auto" on:click|stopPropagation>
	<div class="text-4xl mb-6 mb text-sky-700"><LangText key={level === 0 ? 'new-life' : 'level-up'} /></div>
	<div class="text-center text-gray-900"><LangText key="level-story{level}" /></div>

	{#if tasks.length !== 0}
		<div class="w-3/4 mt-auto grid grid-cols-4 gap-1 border-2 border-white text-gray-700 py-1 px-4 text-base bg-slate-500/20">
			<div class="col-span-4 text-center pb-1 border-b border-gray-700">
				<LangText key={level === 0 ? 'available-task' : 'new-available-task'} />
			</div>
			{#each tasks as task}
				<div class="col-span-2 text-center"><LangText key={task} /></div>
			{/each}
		</div>
	{/if}
</div>
