<script lang="ts">
	let className: string = undefined;

	export { className as class };
</script>

<div class="w-full h-full grid grid-cols-2 gap-4 bg-slate-400 {className ?? ''}">
	<slot />
</div>
