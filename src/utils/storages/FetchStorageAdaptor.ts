import { OnlineMode } from '../Env';

import type { StorageAdaptor } from './StorageAdaptor';

interface WikiLifeInfo {
	data: unknown;
}

export class FetchStorageAdaptor implements StorageAdaptor {
	call = 0;
	dirty = false;
	cors: boolean;
	api: string;

	constructor() {
		this.cors = window.location.origin !== 'https://thwiki.cc';
		this.api = `https://thwiki.cc/api.php?action=wikilife&format=json${
			this.cors ? `&origin=${encodeURIComponent(window.location.origin)}` : ''
		}`;
	}

	overwrite(): boolean {
		return true;
	}

	async from() {
		if (!OnlineMode) return null;

		let wikiLifeInfo: WikiLifeInfo = null;
		try {
			wikiLifeInfo = (await (
				await fetch(this.api, {
					method: 'POST',
					mode: this.cors ? 'cors' : 'same-origin',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				})
			).json()) as WikiLifeInfo;
		} catch (e) {
			wikiLifeInfo = null;
		}

		return wikiLifeInfo?.data;
	}

	async to(obj: { username: string }, force: boolean) {
		if (!OnlineMode || obj.username === '') return false;

		if (force || this.call % 20 === 0) {
			this.dirty = false;
			this.call++;

			const json = JSON.stringify(obj);

			const searchParams = new URLSearchParams();
			searchParams.set('data', json);

			(await (
				await fetch(this.api, {
					method: 'POST',
					mode: this.cors ? 'cors' : 'same-origin',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},
					body: searchParams,
				})
			).json()) as WikiLifeInfo;

			return true;
		}

		this.dirty = true;
		this.call++;
		return false;
	}

	last(obj: { username: string }) {
		if (!OnlineMode || obj.username === '') return false;

		if (!this.dirty) return false;

		const json = JSON.stringify(obj);

		const searchParams = new URLSearchParams();
		searchParams.set('data', json);

		return navigator.sendBeacon(this.api, searchParams);
	}
}
