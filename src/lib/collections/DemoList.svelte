<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { DemoAnimation } from './DemoCollection.svelte';
	import List from './List.svelte';

	let className: string = undefined;

	export { className as class };
	export let items: ComponentProps<List>['items'] = [];
	export let keys: number[];
	export let animations: DemoAnimation[] = undefined;

	let offsetHeight = 0;

	let list: HTMLElement;

	$: {
		if (list && animations) {
			for (const { selector, animation } of animations) {
				const animatedElements = [...list.querySelectorAll(selector)];

				for (const animatedElement of animatedElements) {
					for (const oldAnimation of animatedElement.getAnimations()) {
						oldAnimation.cancel();
					}

					if (animation === 'select') {
						animatedElement.classList.add('selectable');
						animatedElement.classList.toggle('selectable-selected');
					}
				}
			}
		}
	}
</script>

<div class="base" style:height="{offsetHeight * 0.75}px">
	<div class="w-16/12 scale-75 origin-top-left" bind:offsetHeight>
		<List bind:list class="demo_list {className ?? ''}" viewportClass="!p-0" {items} {keys} disabled={true} />
	</div>
</div>
