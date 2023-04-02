<script lang="ts" context="module">
	import type { Random } from 'random';
	import { get, writable } from 'svelte/store';
	import { forkSeed, fromSeed } from '../utils/Random';
	import { wait } from '../utils/Timing';
	import type { AppStateSave, AppStateSaveDto } from './LoadSave.svelte';
	import SaveErrorPopup from './popups/SaveErrorPopup.svelte';
	import { TaskListModel } from './TaskList.svelte';

	export type Level = 0 | 1 | 2 | 3;
	export interface LevelModel {
		limit: number;
		target: number;
		color: string;
	}
	export const Levels: Record<Level, LevelModel> = [
		{
			limit: 5,
			target: 100,
			color: 'bg-green-700',
		},
		{
			limit: 6,
			target: 400,
			color: 'bg-yellow-700',
		},
		{
			limit: 8,
			target: 1000,
			color: 'bg-purple-700',
		},
		{
			limit: 10,
			target: Infinity,
			color: 'bg-red-700',
		},
	];

	export class AppState {
		seed: number;
		username = '';
		dirty = writable(false);
		dirtyForce = writable(false);
		score = writable(0);
		level = writable<0 | 1 | 2 | 3>(0);
		maxScore = writable('');
		progress = writable(0);
		taskCursor = writable(-1);
		taskLoading = writable(false);
		levelTasks = writable<number[]>([]);
		availableTasks = writable<number[]>([]);
		countTasks = writable<number[]>([]);
		latestTask = writable(0);
		popups = writable<ComponentProps<Popup>[]>([]);
		modals = writable<ComponentProps<Modal>[]>([]);

		constructor() {
			this.taskCursor.subscribe(async () => {
				this.taskLoading.set(true);
				await wait(500);
				this.taskLoading.set(false);
			});

			this.score.subscribe((score) => {
				for (let level = 0; level < 4; level++) {
					const levelModel = Levels[level as Level];
					if (score < levelModel.target) {
						const prevTarget = Levels[(level - 1) as Level]?.target ?? 0;

						this.level.set(level as Level);
						if (levelModel.target === Infinity) {
							this.maxScore.set('????');
							this.progress.set(1);
						} else {
							this.maxScore.set(levelModel.target.toFixed(0));
							this.progress.set((score - prevTarget) / (levelModel.target - prevTarget));
						}
						break;
					}
				}
			});

			this.level.subscribe((level) => {
				this.levelTasks.update((levelTasks) => {
					if (!levelTasks[level - 1]) {
						levelTasks[level - 1] = get(this.latestTask);
					}
					return levelTasks;
				});
			});
		}

		load(save: AppStateSave, setSave: (obj: AppStateSaveDto, force?: boolean) => Promise<boolean>) {
			this.seed = save.seed;
			this.username = save.username;
			this.score.set(save.score);
			this.taskCursor.set(save.taskCursor);
			this.levelTasks.set(save.levelTasks);
			this.availableTasks.set(save.availableTasks);
			this.countTasks.set(save.countTasks);
			this.latestTask.set(save.latestTask);

			this.dirty.subscribe((dirty) => {
				if (!dirty) return;

				this.dirty.set(false);

				setSave({
					seed: this.seed,
					username: this.username,
					score: get(this.score),
					taskCursor: get(this.taskCursor),
					levelTasks: get(this.levelTasks),
					availableTasks: get(this.availableTasks),
					countTasks: get(this.countTasks),
					latestTask: get(this.latestTask),
					time: Date.now(),
				});
			});

			this.dirtyForce.subscribe((dirtyForce) => {
				if (!dirtyForce) return;

				this.dirtyForce.set(false);

				setSave(
					{
						seed: this.seed,
						username: this.username,
						score: get(this.score),
						taskCursor: get(this.taskCursor),
						levelTasks: get(this.levelTasks),
						availableTasks: get(this.availableTasks),
						countTasks: get(this.countTasks),
						latestTask: get(this.latestTask),
						time: Date.now(),
					},
					true,
				);
			});
		}
	}

	export class GameModel {
		random: Random;
		tasks: TaskListModel;

		constructor(state: AppState) {
			this.random = fromSeed(`${state.username}|${state.seed}`);
			this.tasks = new TaskListModel(forkSeed(this.random));

			this.initialize(state);
		}

		private initialize(state: AppState) {
			const latestTask = get(state.latestTask);
			const availableTasks = get(state.availableTasks);
			const levelTasks = get(state.levelTasks);

			if (latestTask === 0) {
				this.tasks.fillTasks(state);
				state.taskCursor.set(this.tasks[0].seed);
				state.dirty.set(true);
			} else {
				let level = 0;
				let index = 0;
				const maxIteration = 100000;
				for (; index < maxIteration; index++) {
					const [seed, type] = this.tasks.preloadTask(level);

					if (levelTasks[level] === seed) {
						level++;
					}
					if (availableTasks.includes(seed)) {
						this.tasks.createTask(seed, type);
					}

					if (seed === latestTask) break;
				}

				if (index === maxIteration) {
					state.modals.update((p) => {
						p.push({ content: SaveErrorPopup, props: {} });
						return p;
					});
				}
			}
		}
	}
</script>

<script lang="ts">
	import GamePage from './pages/GamePage.svelte';

	import { setContext, type ComponentProps } from 'svelte';
	import Modal from './popups/Modal.svelte';
	import Popup from './popups/Popup.svelte';

	export let save: AppStateSave;
	export let setSave: (obj: AppStateSaveDto) => Promise<boolean>;

	const state = new AppState();
	state.load(save, setSave);

	const game = new GameModel(state);

	setContext('state', state);
	setContext('game', game);

	const { popups, modals } = state;

	function onPopupDestroy(popup: ComponentProps<Popup>) {
		popups.update((p) => {
			const index = p.indexOf(popup);
			if (index !== -1) {
				p.splice(index, 1);
			}
			return p;
		});
	}

	function onModalDestroy(modal: ComponentProps<Modal>) {
		modals.update((p) => {
			const index = p.indexOf(modal);
			if (index !== -1) {
				p.splice(index, 1);
			}
			return p;
		});
	}
</script>

<GamePage />
<div class="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none space-y-4 z-40">
	{#each $popups as popup (popup)}
		<Popup {...popup} on:destroy={() => onPopupDestroy(popup)} />
	{/each}
</div>
<div class="absolute inset-0 pointer-events-none z-50">
	{#each $modals as modal (modal)}
		<Modal {...modal} on:destroy={() => onModalDestroy(modal)} />
	{/each}
</div>
