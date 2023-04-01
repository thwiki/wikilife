<script lang="ts">
	import { fromSeed } from '../../utils/Random';

	export let seed = 0;
	export let chars = 0;
	export let skeletonClassName = '';

	let words: number[] = [];

	$: {
		const random = fromSeed(seed);

		const lineWidth = chars;
		let currentLength = 0;
		let rowRemainLength = lineWidth;
		words = [];

		while (true) {
			const wordLength = random.int(1, lineWidth);

			if (currentLength + wordLength > chars) break;

			words.push(wordLength);

			if (rowRemainLength < wordLength) {
				currentLength += rowRemainLength;
				rowRemainLength = lineWidth - wordLength;
			} else {
				rowRemainLength -= wordLength;
			}
			if (rowRemainLength === 0) {
				break;
			}
			currentLength += wordLength;
		}
	}
</script>

<div class="inline-block space-x-3">
	{#each words as word}
		<div class="inline-block h-3 rounded {skeletonClassName ?? ''}" style:width="{word}em" />
	{/each}
</div>
