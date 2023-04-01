<script lang="ts">
	import CenterSpinner from '../components/CenterSpinner.svelte';

	import Desktop from '../components/Desktop.svelte';
	import Window from '../components/Window.svelte';
</script>

<Desktop>
	<Window>
		<div slot="title" />
		<CenterSpinner class="text-slate-400 text-5xl leading-none" />
	</Window>
	<Window>
		<div slot="title" />
		<CenterSpinner class="text-slate-400 text-5xl leading-none" />
	</Window>
</Desktop>
