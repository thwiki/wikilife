<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import LangText from './components/LangText.svelte';
	import type { AppState } from './Game.svelte';
	import type { TaskModel } from './tasks';

	export let seed: TaskModel['seed'];
	export let type: TaskModel['type'];
	export let score: TaskModel['score'];
	export let pristine: TaskModel['pristine'];

	const { taskCursor, taskLoading } = getContext<AppState>('state');

	let active = false;
	let disabled = false;

	$: {
		active = $taskCursor === seed;
		if (active) {
			pristine = false;
		}
	}
	$: disabled = active || $taskLoading;

	function onClick() {
		if (disabled) return;

		$taskCursor = seed;
	}
</script>

<div
	in:fly={{ x: 100 }}
	out:fly={{ x: 100 }}
	class="relative -ml-8 pl-12 pr-6 py-3 flex items-center transition-all whitespace-nowrap leading-none {active
		? 'bg-slate-700 text-sky-50'
		: 'bg-white hover:bg-sky-100 cursor-pointer'}"
	on:click={onClick}
>
	<div class="w-2 h-2 rounded-full bg-red-500 mr-2" class:invisible={!pristine} />
	<div>
		<LangText key={type} />
	</div>
	<div class="ml-auto text-green-500">+{score}</div>
</div>
