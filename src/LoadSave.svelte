<script lang="ts" context="module">
	import { LocalStorageAdaptor } from '@utils/storages/LocalStorageAdaptor';
	import type { StorageAdaptor } from '@utils/storages/StorageAdaptor';
	import { onMount } from 'svelte';
	import { DefaultStorageAdaptor } from './utils/storages/DefaultStorageAdaptor';
	import { FetchStorageAdaptor } from './utils/storages/FetchStorageAdaptor';

	type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends (..._: any) => any ? never : K }[keyof T]>;

	export class AppStateSave {
		seed = 0;
		username = '';
		score = 0;
		taskCursor = 0;
		levelTasks: number[] = [];
		availableTasks: number[] = [];
		countTasks: number[] = [];
		latestTask = 0;

		time = 0;

		static storages: StorageAdaptor[] = [new FetchStorageAdaptor(), new LocalStorageAdaptor(), new DefaultStorageAdaptor()];

		validate(obj: unknown) {
			if (obj == null || typeof obj !== 'object') return null;

			if ('seed' in obj && typeof obj.seed === 'number' && obj.seed > 0 && 'time' in obj && typeof obj.time === 'number') {
				const validated: AppStateSaveDto = {
					seed: obj.seed,
					time: obj.time,
					username: 'username' in obj && typeof obj.username === 'string' ? obj.username : '',
					score: 'score' in obj && typeof obj.score === 'number' ? obj.score : 0,
					taskCursor: 'taskCursor' in obj && typeof obj.taskCursor === 'number' ? obj.taskCursor : 0,
					levelTasks:
						'levelTasks' in obj && Array.isArray(obj.levelTasks) && obj.levelTasks.every((v) => typeof v === 'number')
							? obj.levelTasks
							: [],
					availableTasks:
						'availableTasks' in obj && Array.isArray(obj.availableTasks) && obj.availableTasks.every((v) => typeof v === 'number')
							? obj.availableTasks
							: [],
					countTasks:
						'countTasks' in obj && Array.isArray(obj.countTasks) && obj.countTasks.every((v) => v == null || typeof v === 'number')
							? [...obj.countTasks].map((v) => v ?? 0)
							: [],
					latestTask: 'latestTask' in obj && typeof obj.latestTask === 'number' ? obj.latestTask : 0,
				};

				return validated;
			}
			return null;
		}

		load(obj: AppStateSaveDto) {
			if (obj == null || typeof obj !== 'object') return false;

			this.seed = obj.seed;
			this.time = obj.time;

			this.username = obj.username;
			this.score = obj.score;
			this.taskCursor = obj.taskCursor;
			this.levelTasks = obj.levelTasks;
			this.availableTasks = obj.availableTasks;
			this.countTasks = obj.countTasks;
			this.latestTask = obj.latestTask;

			return true;
		}

		async fromAny() {
			const objs = await Promise.all(AppStateSave.storages.map(async (storage) => [storage, await storage.from()] as const));
			let latestValidated: AppStateSaveDto = null;

			for (const [storage, obj] of objs) {
				const validated = this.validate(obj);
				if (validated && (latestValidated == null || storage.overwrite(latestValidated, validated))) {
					latestValidated = validated;
				}
			}

			this.load(latestValidated);

			return false;
		}

		async toAny(force = false) {
			await Promise.all(AppStateSave.storages.map((storage) => storage.to(this, force)));
		}

		lastAny() {
			AppStateSave.storages.map((storage) => storage.last(this));
		}
	}

	export type AppStateSaveDto = ExcludeMethods<AppStateSave>;
</script>

<script lang="ts">
	export const save = new AppStateSave();
	export const setSave = async (obj: AppStateSaveDto, force = false) => {
		const validated = save.validate(obj);
		if (save.load(validated)) {
			changed = true;
			await save.toAny(force);
			return true;
		}

		return false;
	};
	export let loaded = false;

	let changed = false;

	const load = save.fromAny();
	load.then(() => (loaded = true));

	let lastSaved = false;

	function triggerSave() {
		if (lastSaved || !changed) return;
		lastSaved = true;

		save.lastAny();

		setTimeout(() => {
			lastSaved = false;
		}, 60 * 1000);
	}

	onMount(() => {
		if (/iP(hone|od|ad)/.test(navigator?.platform ?? '') && /OS (\d+)_(\d+)_?(\d+)?/.test(navigator?.appVersion ?? '')) {
			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'hidden') {
					triggerSave();
				}
			});
		}
	});
</script>

<svelte:window
	on:unload={triggerSave}
	on:beforeunload={triggerSave}
	on:pagehide={(event) => {
		if (!event.persisted) {
			triggerSave();
		}
	}}
/>

<slot />
