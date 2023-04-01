<script lang="ts" context="module">
	import { forkSeed, fromSeed } from '@utils/Random';
	import type { Random } from 'random';
	import { Levels, type Level } from '../Game.svelte';

	import { TaskModels, type TaskModel } from './tasks';

	export class TaskListModel extends Array<TaskModel> {
		random: Random;

		constructor(public seed: number) {
			super();
			this.random = fromSeed(this.seed);
		}

		preloadTask(level: number): [seed: number, type: number] {
			const seed = forkSeed(this.random);
			const type = this.random.int(0, Math.min(4 * (level + 1), TaskModels.length) - 1);
			//const type = this.random.int(10, 10);

			return [seed, type];
		}

		createTask(seed: number, type: number) {
			const task = new TaskModels[type](seed);

			task.pristine = true;
			task.typeIndex = type;
			task.generate();
			this.unshift(task);

			return task;
		}

		generateTask(state: AppState) {
			const level = get(state.level);

			const [seed, type] = this.preloadTask(level);

			const task = this.createTask(seed, type);

			state.availableTasks.set(this.getAvailableTaskSeeds());
			state.latestTask.set(task.seed);

			return task;
		}

		getAvailableTasks() {
			return this.filter((task) => !task.submitted);
		}

		getAvailableTaskSeeds() {
			return this.getAvailableTasks().map((task) => task.seed);
		}

		get(seed: number) {
			return this.find((task) => task.seed === seed);
		}

		delete(task: TaskModel) {
			const index = this.indexOf(task);
			if (index !== -1) {
				this.splice(index, 1);
			}
		}

		isSingleType() {
			return (
				this.getAvailableTasks()
					.map((task) => task.type)
					.filter((v, i, a) => a.indexOf(v) === i).length < 2
			);
		}

		fillTasks(state: AppState): TaskModel | null {
			const limit = Levels[get(state.level)].limit;
			let newTask: TaskModel = null;
			while (this.length < limit || (this.isSingleType() && this.length < 3 * limit)) {
				newTask = this.generateTask(state);
			}
			return newTask;
		}

		submit(state: AppState, seed: number, correct: boolean) {
			const task = this.get(seed);

			if (task == null || task.submitted !== true) return;

			const addScore = correct ? task.score : -Math.ceil(task.score / 2);

			const levelMin = Levels[(get(state.level) - 1) as Level]?.target ?? 0;

			state.score.update((score) => Math.max(levelMin, score + addScore));

			if (correct) {
				state.countTasks.update((countTasks) => {
					countTasks[task.typeIndex] = (countTasks[task.typeIndex] ?? 0) + 1;
					return countTasks;
				});
			}

			state.popups.update((p) => {
				p.push({ content: ScorePopup, props: { score: addScore }, duration: 500 });
				return p;
			});
			this.delete(task);

			const newTask = this.fillTasks(state);

			if (newTask) {
				state.taskCursor.set(newTask.seed);
			}

			state.dirty.set(true);
		}
	}
</script>

<script lang="ts">
	import { ClickOutside } from '@utils/ClickOutside';
	import { getContext } from 'svelte';
	import UilClipboard from 'svelte-unicons/src/icons/UilClipboard.svelte';
	import UilDiary from 'svelte-unicons/src/icons/UilDiary.svelte';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { Svroller } from 'svrollbar';
	import type { AppState } from '../Game.svelte';
	import LangText from './components/LangText.svelte';
	import ScorePopup from './popups/ScorePopup.svelte';
	import TaskListItem from './TaskListItem.svelte';

	export let tasks: TaskListModel;

	const { availableTasks, countTasks } = getContext<AppState>('state');

	let showStat = false;
</script>

<div class="w-full h-full text-xl flex flex-col">
	<div class="bg-sky-200 pl-4 pr-3 py-3 border-b-2 border-sky-700 text-sky-700 flex items-center leading-none">
		<UilClipboard size="1em" />
		<div class="ml-2"><LangText key="task-list" /></div>
		<button
			class="ml-auto text-slate-900 bg-white shadow-sm active:shadow-none hover:bg-slate-200 transition-colors rounded-sm p-1"
			class:bg-slate-200={showStat}
			on:click={() => {
				showStat = !showStat;
			}}
			use:ClickOutside={() => {
				showStat = false;
			}}
		>
			<UilDiary class="text-sky-500" size="1em" />
		</button>
		{#if showStat}
			<div
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 200 }}
				class="absolute top-8 right-0 mt-4 z-10 text-black bg-white border border-slate-300 rounded-md shadow-md w-10/12 p-4"
				role="tooltip"
				on:click|stopPropagation
			>
				<div
					class="absolute w-0 h-0 border-t-0 border-x-6 border-b-8 border-transparent border-b-white bottom-full right-3 -translate-x-1/2"
				/>
				{#if showStat}
					<div class="mb-2 pb-1 border-b-2 border-slate-500"><LangText key="completed" /><LangText key="colon" /></div>
					<div class="grid grid-cols-12 gap-2 items-center text-sm">
						{#each $countTasks as count, index (index)}
							{#if count > 0}
								<div class="col-span-8"><LangText key={new TaskModels[index](0).type} /></div>
								<div class="col-span-4">{count}</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="bg-gray-300 flex-1 overflow-hidden touch-auto">
		<Svroller width="100%" height="100%">
			<div class="space-y-1 pt-1">
				{#each $availableTasks as seed (seed)}
					{@const task = tasks.get(seed)}
					{#if task}
						<TaskListItem seed={task.seed} type={task.type} score={task.score} pristine={task.pristine} />
					{/if}
				{/each}
			</div>
		</Svroller>
	</div>
</div>
