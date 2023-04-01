<script lang="ts">
	import { ClickOutside } from '@utils/ClickOutside';
	import UilAt from 'svelte-unicons/src/icons/UilAt.svelte';
	import UilGithub from 'svelte-unicons/src/icons/UilGithub.svelte';
	import { fade } from 'svelte/transition';
	import LangText from './LangText.svelte';

	let className: string = undefined;

	export { className as class };

	let show = false;

	interface Link {
		url: string;
		name: string;
	}

	const materials: Link[] = [
		{ url: 'https://svelte.dev', name: 'Svelte' },
		{ url: 'https://iconscout.com/unicons', name: 'Unicons' },
		{ url: 'https://www.irasutoya.com', name: 'Irasutoya' },
		{ url: 'https://thwiki.cc', name: 'THBWiki' },
		{ url: 'https://www16.big.or.jp/~zun', name: 'Team Shanghai Alice' },
		{ url: 'https://thwiki.cc/User:Suika_Sakura', name: 'Suika Sakura' },
		{ url: 'https://thwiki.cc/User:Gensoukyonoboss', name: 'Gensoukyonoboss' },
		{ url: 'https://tailwindcss.com', name: 'Tailwind CSS' },
		{ url: 'https://sortablejs.github.io/Sortable/', name: 'SortableJS' },
		{ url: 'https://daylilyfield.github.io/svrollbar/', name: 'SVROLLBAR' },
		{ url: 'https://www.npmjs.com/package/subset-font', name: 'subset-font' },
		{ url: 'https://fonts.google.com/specimen/Sriracha', name: 'Sriracha' },
		{ url: 'https://fonts.google.com/specimen/ZCOOL+KuaiLe', name: 'ZCOOL KuaiLe' },
		{ url: 'https://www.dafont.com/zazer-square.font', name: 'Zazer Square' },
		{ url: 'https://squoosh.app', name: 'Squoosh' },
		{ url: 'https://www.mediawiki.org', name: 'MediaWiki' },
	];
</script>

<div class={className}>
	<button
		class="rounded-full w-12 h-12 flex text-2xl select-none items-center justify-center text-white bg-yellow-500 shadow-lg active:shadow-none transition-colors hover:bg-yellow-700"
		on:click={() => {
			show = !show;
		}}
		use:ClickOutside={() => {
			show = false;
		}}><UilAt size="1em" /></button
	>
	{#if show}
		<div
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="absolute top-full mt-2 right-0 p-4 bg-white z-10 text-black border border-slate-300 w-80 rounded-md shadow-md"
			role="tooltip"
			on:click|stopPropagation
		>
			<div
				class="absolute w-0 h-0 border-t-0 border-x-6 border-b-8 border-transparent border-b-white bottom-full right-3 -translate-x-1/2"
			/>
			<div class="grid grid-cols-12 gap-2">
				<div class="col-span-4 text-right"><LangText key="author" /></div>
				<div class="col-span-8">
					<a class="font-sans" href="https://thwiki.cc/User:Arumi" target="_blank" rel="noopener noreferrer">Arumi</a>
				</div>
				<div class="col-span-4 text-right"><LangText key="materials" /></div>
				<div class="col-span-8">
					{#each materials as resource}
						<div><a class="font-sans" href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name}</a></div>
					{/each}
				</div>
				<div class="col-span-4 text-right"><LangText key="source-code" /></div>
				<div class="col-span-8">
					<a class="font-sans" href="https://github.com/thwiki/wikilife" target="_blank" rel="noopener noreferrer"
						><UilGithub size="1.5em" /></a
					>
				</div>
			</div>
		</div>
	{/if}
</div>
