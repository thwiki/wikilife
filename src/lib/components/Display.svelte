<script lang="ts">
	import { getContext } from 'svelte';
	import type { AppState, GameModel } from '../../Game.svelte';
	import { TaskComponentMap, type TaskModel } from '../tasks';
	import LoadingTask from '../tasks/LoadingTask.svelte';

	const state = getContext<AppState>('state');
	const { taskCursor, taskLoading } = state;
	const { tasks } = getContext<GameModel>('game');

	let task: TaskModel & any;
	let type: TaskModel['type'];

	$: {
		task = tasks.get($taskCursor);
		type = task?.type;
	}

	const submit = (seed: number, correct: boolean) => {
		tasks.submit(state, seed, correct);
	};
</script>

<div class="w-full h-full">
	{#if task == null}
		<LoadingTask />
	{:else}
		{#key task}
			<svelte:component this={TaskComponentMap[type]} {task} {submit} />
		{/key}
	{/if}
	<div class="absolute inset-0" class:hidden={!$taskLoading}>
		<LoadingTask />
	</div>
</div>
