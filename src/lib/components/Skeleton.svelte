<script lang="ts">
	import { fromSeed } from '../../utils/Random';

	export let seed = 0;
	export let lines = 0;
	export let skeletonClassName = '';

	let words: number[] = [];

	$: {
		const random = fromSeed(seed);

		const lineWidth = 8;
		const total = lines * lineWidth;
		let currentLength = 0;
		let rowRemainLength = lineWidth;
		words = [];

		while (true) {
			const wordLength = random.int(1, lineWidth);

			if (currentLength + wordLength > total) break;

			words.push(wordLength);

			if (rowRemainLength < wordLength) {
				currentLength += rowRemainLength;
				rowRemainLength = lineWidth - wordLength;
			} else {
				rowRemainLength -= wordLength;
			}
			if (rowRemainLength === 0) {
				rowRemainLength = lineWidth;
			}
			currentLength += wordLength;
		}
	}
</script>

<div class="grid grid-cols-8 gap-3">
	{#each words as word}
		<div class="h-3 col-span-{word} rounded {skeletonClassName ?? ''}" />
	{/each}
</div>
