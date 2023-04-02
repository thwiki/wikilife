<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import CenterSpinner from './components/CenterSpinner.svelte';
	import Credit from './components/Credit.svelte';
	import LangSwitcher from './components/LangSwitcher.svelte';
	import LangText from './components/LangText.svelte';
	import StartPage from './pages/StartPage.svelte';

	import { OnlineMode } from '../utils/Env';
	import LoadSave, { AppStateSave, type AppStateSaveDto } from './LoadSave.svelte';

	setContext('lang', writable<'zh' | 'en'>('zh'));

	let save: AppStateSave;
	let setSave: (obj: AppStateSaveDto, force?: boolean) => Promise<boolean>;
	let loaded: boolean;

	let started = false;

	function onStart() {
		started = true;
	}

	const importGame = import('./Game.svelte');
</script>

<LoadSave bind:save bind:setSave bind:loaded>
	<main class="w-screen-xl h-screen-xl [contain:strict] overflow-hidden">
		{#if started}
			{#await importGame then Game}
				<svelte:component this={Game.default} {save} {setSave} />
			{/await}
		{:else}
			<StartPage>
				<button
					class="flex items-center justify-center select-none absolute -ml-24 left-1/2 top-[550px] z-40 text-6xl w-48 h-24 leading-none text-white shadow-lg active:shadow-none transition-colors {loaded
						? 'bg-amber-500 hover:bg-amber-700'
						: 'bg-slate-500/50'}"
					on:click={onStart}
				>
					{#if loaded}
						<LangText class="block" key="start" />
					{:else}
						<CenterSpinner class="text-slate-100" />
					{/if}
				</button>
				{#if OnlineMode}
					{#if loaded && save.username === ''}
						<a href="https://thwiki.cc/index.php?title=%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95" rel="noopener noreferrer">
							<div
								class="flex items-center justify-center select-none absolute bg-gradient-to-r from-transparent via-black/80 w-full py-1 px-2 text-center top-[664px] z-80 text-3xl leading-none transition-colors"
							>
								<LangText key="login" />
							</div>
						</a>
					{/if}
				{:else}
					<a href="https://thwiki.cc/wikilife.html" rel="noopener noreferrer">
						<div
							class="flex items-center justify-center select-none absolute bg-gradient-to-r from-transparent via-black/80 w-full py-1 px-2 text-center top-[664px] z-80 text-3xl leading-none transition-colors"
						>
							<LangText key="import-save" />
						</div>
					</a>
				{/if}
			</StartPage>
		{/if}
		<LangSwitcher class="absolute right-4 top-4 z-50" />
		<Credit class="absolute right-20 top-4 z-50" />
	</main>
</LoadSave>
