<script lang="ts">
	import { UilSpinnerAlt } from 'svelte-unicons';

	let className: string = undefined;

	export { className as class };
</script>

<div class="h-full w-full grid place-items-center {className ?? ''}">
	<UilSpinnerAlt class="animate-spin" size="1em" />
</div>
