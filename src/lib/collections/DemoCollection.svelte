<script lang="ts" context="module">
	export interface DemoAnimation {
		selector: string;
		animation: 'slide-in-right' | 'select';
	}
</script>

<script lang="ts">
	import Collection from '@collections/Collection.svelte';
	import type { ComponentProps } from 'svelte';

	let className: string = undefined;

	export { className as class };
	export let items: ComponentProps<Collection>['items'] = [];
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

					if (animation === 'slide-in-right') {
						animatedElement.animate(
							[
								{ offset: 0, transform: 'translateX(100%)', opacity: 1, easing: 'ease-out' },
								{ offset: 0.3, transform: 'translateX(0)', opacity: 1 },
								{ offset: 0.6, transform: 'translateX(0)', opacity: 1 },
								{ offset: 0.7, transform: 'translateX(0)', opacity: 0 },
								{ offset: 0.7, transform: 'translateX(100%)', opacity: 0 },
								{ offset: 1, transform: 'translateX(100%)', opacity: 0 },
							],
							{
								duration: 2000,
								iterations: Infinity,
							},
						);
					}
				}
			}
		}
	}
</script>

<div style:height="{offsetHeight * 0.75}px">
	<div class="w-16/12 scale-75 origin-top-left" bind:offsetHeight>
		<Collection
			bind:list
			class="demo_collection {className ?? ''}"
			viewportClass="!p-0"
			{items}
			{keys}
			targetable={false}
			sortable={false}
			removable={false}
			disabled={true}
		/>
	</div>
</div>
