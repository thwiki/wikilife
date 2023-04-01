<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import LangText from './LangText.svelte';

	let className: string = undefined;

	export { className as class };

	const langs = ['zh', 'en'] as const;
	const lang = getContext<Writable<(typeof langs)[number]>>('lang');
</script>

<div class={className}>
	<button
		class="rounded-full w-12 h-12 flex text-2xl select-none items-center justify-center text-white bg-sky-500 shadow-lg active:shadow-none transition-colors hover:bg-sky-700"
		on:click={() => {
			const index = langs.indexOf($lang);
			const next = (index + 1) % langs.length;

			$lang = langs[next];
		}}
	>
		<LangText key={$lang} />
	</button>
</div>
