<script lang="ts">
	import Button from '@components/Button.svelte';
	import LangText from '@components/LangText.svelte';
	import { initSeed } from '@utils/Random';
	import { wait } from '@utils/Timing';
	import { getContext } from 'svelte';
	import type { AppState } from '../../Game.svelte';
	import { AppStateSave } from '../../LoadSave.svelte';

	const { username } = getContext<AppState>('state');

	async function clearSave() {
		const save = new AppStateSave();
		const validated = save.validate({ seed: initSeed(), username, time: Date.now() });
		if (save.load(validated)) {
			await save.toAny(true);
			await wait(1000);
			window.location.reload();
		}
	}
</script>

<div class="flex flex-col items-center text-2xl pointer-events-auto" on:click|stopPropagation>
	<div class="text-4xl mb-6 mb text-red-700"><LangText key="save-error" /></div>
	<div class="text-center text-gray-900 mt-auto mb-auto">
		<Button color="red" on:click={clearSave}><LangText key="clear-save" /></Button>
	</div>
</div>
