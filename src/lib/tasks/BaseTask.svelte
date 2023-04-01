<script lang="ts" context="module">
	import { fromSeed } from '@utils/Random';

	import type { BlockModel } from '@blocks/index';
	import type { DemoAnimation } from '@collections/DemoCollection.svelte';
	import type { Random } from 'random';

	export class BaseTaskModel {
		random: Random;
		pristine = false;
		submitted = false;
		typeIndex: number;

		score = 1;

		items: BlockModel[] = [];

		demoKeys: number[] = [];
		demoAnimations: DemoAnimation[] = [];

		constructor(public seed: number) {
			this.random = fromSeed(this.seed);
		}
	}
</script>

<slot />
