<script lang="ts">
	import type { ColorName } from '@utils/Colors';
	import type { SvelteComponent } from 'svelte';
	import UilBookAlt from 'svelte-unicons/src/icons/UilBookAlt.svelte';
	import UilCamera from 'svelte-unicons/src/icons/UilCamera.svelte';
	import UilCog from 'svelte-unicons/src/icons/UilCog.svelte';
	import UilEnvelope from 'svelte-unicons/src/icons/UilEnvelope.svelte';
	import UilLightbulbAlt from 'svelte-unicons/src/icons/UilLightbulbAlt.svelte';
	import UilMusic from 'svelte-unicons/src/icons/UilMusic.svelte';
	import UilPen from 'svelte-unicons/src/icons/UilPen.svelte';

	let className: string = undefined;

	export { className as class };
	export let color: ColorName = undefined;

	const badgeIcons: Partial<Record<ColorName, typeof SvelteComponent>> = {
		red: UilMusic,
		orange: UilEnvelope,
		yellow: UilLightbulbAlt,
		green: UilBookAlt,
		blue: UilPen,
		cyan: UilCog,
		purple: UilCamera,
	};
</script>

<div class="rounded-full w-10 h-10 flex text-3xl items-center justify-center bg-{color}-500 text-white {className ?? ''}">
	<svelte:component this={badgeIcons[color]} size="1em" />
</div>
