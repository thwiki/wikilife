<script lang="ts">
	let className: string = undefined;

	export { className as class };

	export let list: HTMLElement = undefined;
</script>

<div bind:this={list} class="center_list w-full h-full p-4 flex flex-col items-center justify-center {className ?? ''}">
	<slot />
</div>
