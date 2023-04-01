// NOTE: These implementations would have to be polyfilled for IE support!

function* iter_range(begin: number, end: number, step: number) {
	// Normalize our inputs
	step = step ? step : 1;

	if (typeof end === 'undefined') {
		end = begin > 0 ? begin : 0;
		begin = begin < 0 ? begin : 0;
	}

	if (begin == end) {
		return;
	}

	if (begin > end) {
		step = step * -1;
	}

	for (let x = begin; x < end; x += step) {
		yield x;
	}
}

export function range(begin: number, end: number, step = 1) {
	return Array.from(iter_range(begin, end, step));
}
