<script lang="ts">
	import { BlockComponentMap, type BlockModel } from '.';

	let className: string = undefined;

	export { className as class };

	export let block: BlockModel;
</script>

{#if block.type === 'info'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'text'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'title'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'cover'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'cell'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'comment'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'spell'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'user'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'change'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{:else if block.type === 'talk'}
	{@const { type, ...rest } = block}
	<svelte:component this={BlockComponentMap[type]} class={className} {...rest} />
{/if}
