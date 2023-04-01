<script lang="ts">
	import ProceduralCover from '@components/ProceduralCover.svelte';
	import { fromSeed } from '@utils/Random';
	import { ColorNamesShadable, type ColorName } from '../../utils/Colors';

	let className: string = undefined;

	export { className as class };
	export let seed: number;

	let avatarBgColor: ColorName;
	let avatarFgColor: ColorName;
	let avatarColor: ColorName;

	$: {
		const random = fromSeed(seed);

		avatarBgColor = random.choice(ColorNamesShadable);
		avatarFgColor = random.choice(ColorNamesShadable);
		avatarColor = random.choice(ColorNamesShadable);
	}
</script>

<div class="rounded-full overflow-hidden {className ?? ''}">
	<ProceduralCover {seed} size="100%" bgColor={avatarBgColor} fgColor={avatarFgColor} color={avatarColor} variant="textless" />
</div>
