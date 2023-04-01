<script lang="ts">
	import LangText from '../components/LangText.svelte';

	export let score = 0;
</script>

<div class="flex items-center text-2xl {score < 0 ? 'text-red-500' : 'text-green-500'}">
	<LangText key="contribute" />
	<LangText key="colon" />
	<div>{score < 0 ? '' : '+'}{score}</div>
</div>
