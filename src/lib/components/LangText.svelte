<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { i18n } from '../i18n';

	let className: string = undefined;

	export { className as class };
	export let key: keyof typeof i18n;
	export let lang: keyof (typeof i18n)[typeof key] = undefined;
	export let svg: boolean = undefined;

	const globalLang = getContext<Writable<typeof lang>>('lang');

	let realLang = lang;

	$: {
		if (!lang) {
			realLang = $globalLang;
		}
	}
</script>

{#if svg}
	<tspan class={className} lang={realLang}>{i18n[key][realLang]}</tspan>
{:else}
	<span class={className} lang={realLang}>{i18n[key][realLang]}</span>
{/if}
