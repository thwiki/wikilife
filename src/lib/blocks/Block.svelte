<script lang="ts">
	import type { ColorName } from '@utils/Colors';

	let className: string = undefined;

	export { className as class };
	export let contentClass: string = undefined;
	export let key: string;
	export let color: ColorName = undefined;
	export let fit: boolean = undefined;
	export let draggable = false;
	export let selectable = false;
</script>

<div
	class="base overflow-hidden border-4 rounded-lg px-4 py-2 {(color ?? 'white') === 'white'
		? 'bg-white border-slate-200'
		: `bg-${color}-500 border-${color}-700`} {className ?? ''}"
	class:draggable
	class:undraggable={!draggable}
	class:unselectable={!selectable}
	class:cursor-grab={draggable}
	class:selectable
	class:cursor-pointer={selectable}
	class:!px-2={fit}
	data-key={key}
>
	<div class="content {contentClass ?? ''}">
		<slot />
	</div>
</div>
