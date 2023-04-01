import { OnlineMode } from '../Env';
import { initSeed } from '../Random';

import type { StorageAdaptor } from './StorageAdaptor';

interface UserInfo {
	batchcomplete: '';
	query: { userinfo: { id: number; name: string } };
}

export class DefaultStorageAdaptor implements StorageAdaptor {
	cors: boolean;
	api: string;

	constructor() {
		this.cors = window.location.origin !== 'https://thwiki.cc';
		this.api = `https://thwiki.cc/api.php?action=query&meta=userinfo&format=json${
			this.cors ? `&origin=${encodeURIComponent(window.location.origin)}` : ''
		}`;
	}

	overwrite(oldSave: { username: string; time: number }, newSave: { username: string; time: number }): boolean {
		return newSave.time > oldSave.time || oldSave.username !== newSave.username;
	}

	async from() {
		if (!OnlineMode) {
			return {
				seed: initSeed(),
				username: '',
				time: 0,
			};
		}

		let userInfo: UserInfo = null;
		try {
			userInfo = (await (
				await fetch(this.api, {
					mode: this.cors ? 'cors' : 'same-origin',
					credentials: 'include',
				})
			).json()) as UserInfo;
		} catch (_) {
			userInfo = null;
		}

		const id = userInfo?.query?.userinfo?.id ?? 0;
		const name = id === 0 ? '' : userInfo?.query?.userinfo?.name ?? '';

		return {
			seed: initSeed(),
			username: name,
			time: 0,
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async to() {
		return false;
	}

	last() {
		return false;
	}
}
