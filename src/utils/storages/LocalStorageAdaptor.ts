import type { StorageAdaptor } from './StorageAdaptor';

export class LocalStorageAdaptor implements StorageAdaptor {
	overwrite(oldSave: { time: number; seed: number; username: string }, newSave: { time: number; seed: number; username: string }): boolean {
		return newSave.seed === oldSave.seed && newSave.username === oldSave.username && newSave.time > oldSave.time;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async from() {
		try {
			return JSON.parse(localStorage.getItem('save') ?? '') as unknown;
		} catch (e) {
			return null;
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async to(obj: unknown) {
		const json = JSON.stringify(obj);

		localStorage.setItem('save', json);
		return true;
	}

	last() {
		return false;
	}
}
