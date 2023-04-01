import { Random } from 'random';

import { ColorNamesShadable } from './Colors';

export function initSeed() {
	return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

export function fromSeed(seed: number | string) {
	const random = new Random();
	random.use(seed as never);
	return random;
}

export function forkSeed(random: Random) {
	return random.int(0, Number.MAX_SAFE_INTEGER);
}

export function fromFork(random: Random) {
	return fromSeed(forkSeed(random));
}

export function pickShadableColor(random: Random) {
	return random.choice(ColorNamesShadable);
}

export function pickShade(random: Random): '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' {
	return random.choice(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']);
}

export function pickLightShade(random: Random): '50' | '100' | '200' | '300' | '400' {
	return random.choice(['50', '100', '200', '300', '400']);
}

export function pickDarkShade(random: Random): '600' | '700' | '800' | '900' {
	return random.choice(['600', '700', '800', '900']);
}

export function sample<T>(population: T[], k: number, random: Random): T[] {
	const n = population.length;
	if (k < 0 || k > n) throw new RangeError('Sample larger than population or is negative');

	if (k === 1) return [population[(random.float() * n) | 0]];

	const result = new Array<T>(k);
	const setsize = 21 + (k > 5 ? 4 ** Math.ceil(Math.log(k * 3) / Math.log(4)) : 0); // size of a small set minus size of an empty list);

	if (n <= setsize) {
		// An n-length list is smaller than a k-length set
		const pool = population.slice();
		for (let i = 0; i < k; i++) {
			// inconstiant: non-selected at [0,n-i)
			const j = (random.float() * (n - i)) | 0;
			result[i] = pool[j];
			pool[j] = pool[n - i - 1]; // move non-selected item into vacancy
		}
	} else {
		const selected = new Set();
		for (let i = 0; i < k; i++) {
			let j = (random.float() * n) | 0;
			while (selected.has(j)) j = (random.float() * n) | 0;
			selected.add(j);
			result[i] = population[j];
		}
	}

	return result;
}

export function shuffle<T>(array: T[], random: Random): T[] {
	const result = array.slice();
	for (let i = result.length - 1; i > 0; i--) {
		const j = (random.float() * (i + 1)) | 0;
		const temp = result[i];
		result[i] = result[j];
		result[j] = temp;
	}
	return result;
}
