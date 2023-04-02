import { OnlineMode } from '../Env';

import type { StorageAdaptor } from './StorageAdaptor';

export class UrlStorageAdaptor implements StorageAdaptor {
	overwrite(oldSave: { time: number; seed: number; username: string }, newSave: { time: number; seed: number; username: string }): boolean {
		return newSave.seed === oldSave.seed && newSave.username === oldSave.username ? newSave.time > oldSave.time : true;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async from() {
		if (OnlineMode) return null;

		try {
			const save = JSON.parse(new URL(window.location.href).searchParams.get('save') ?? '') as unknown;
			if (save) {
				window.history.replaceState(null, null, window.location.pathname);
			}
			return save;
		} catch (e) {
			return null;
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async to() {
		return false;
	}

	last() {
		return false;
	}
}
