<script lang="ts">
	import type { SortableEvent } from 'sortablejs';
	import Sortable, { MultiDrag, Swap, type GroupOptions, type Options } from 'sortablejs';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	const dispatch =
		createEventDispatcher<
			Record<
				'choose' | 'unchoose' | 'start' | 'end' | 'add' | 'update' | 'remove' | 'filter' | 'sort' | 'clone' | 'move' | 'change' | 'spill',
				SortableEvent
			>
		>();

	// Svelte Library Variables
	export let list: HTMLElement;
	let sortable: Sortable;
	let className: string;
	/**
	 * Classes to be added to the list div
	 */
	export { className as class };

	/**
	 * Add a multiDrag class. Automatically mounts the multiDrag Plugin, sets it to true and sets fallbackTolerance to 3.
	 * @type {string}
	 */
	export let multiDragClass: string | null = null;

	/**
	 * Add a swap class. Automatically mounts the swap Plugin, sets it to true.
	 * @type {string}
	 */
	export let swapClass: string | null = null;

	// Default Options
	/**
	 * "name" OR { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
	 * @type {string | GroupOptions}
	 * */
	export let group: string | GroupOptions | undefined = undefined;
	/** Sorting inside list */
	export let sort = true;
	/** Disables the sortable if set to true. */
	export let disabled = false;
	export let store:
		| {
				get: (sortable: Sortable) => string[];
				set: (sortable: Sortable) => void;
		  }
		| undefined = undefined;
	/**
	 * Drag handle selector within list items
	 * @type {string}
	 * */
	export let handle: string | undefined = undefined;
	/** Threshold of the swap zone. Must be between 0 and 1. */
	export let swapThreshold = 1; // 0 <= x <= 1
	/** Will always use inverted swap zone if set to true. */
	export let invertSwap = false;
	/**
	 * Threshold of the inverted swap zone (will be set to swapThreshold value by default).
	 * @type {number}
	 */
	export let invertedSwapThreshold: number | undefined = undefined; // will be set to same as swapThreshold if default
	/** Remove the clone element when it is not showing, rather than just hiding it */
	export let removeCloneOnHide = true;
	/** Class name for the drop placeholder. */
	export let ghostClass = 'sortable-ghost';
	/** Class name for the chosen item. */
	export let chosenClass = 'sortable-chosen';
	/** Class name for the dragging item. */
	export let dragClass = 'sortable-drag';
	/** Elements to ignore */
	export let ignore = 'a; img';
	/**
	 * Selectors that do not lead to dragging (String or Function)
	 * @type {string | Function}
	 */
	export let filter:
		| string
		| ((this: Sortable, event: Event | TouchEvent, target: HTMLElement, sortable: Sortable) => boolean)
		| undefined = undefined;
	export let preventOnFilter = true;
	export let animation = 0;
	/**
	 * Easing for animation. Defaults to null.
	 *
	 * See https://easings.net/ for examples.
	 *
	 * For other possible values, see
	 * https://www.w3schools.com/cssref/css3_pr_animation-timing-function.asp
	 *
	 * @type {string | function}
	 */
	export let easing: string | undefined = undefined;
	/** HTML attribute that is used by the `toArray()` method. */
	export let dataIdAttr = 'data-id';
	/** Time in milliseconds to define when the sorting should start */
	export let delay = 0;
	/** Whether or not the delay should be applied only if the user is using touch (eg. on a mobile device). No delay will be applied in any other case. */
	export let delayOnTouchOnly = false;
	/** Ignore the HTML5 DnD behaviour and force the fallback to kick in */
	export let forceFallback = false;
	/** Class name for the cloned DOM Element when using forceFallback. */
	export let fallbackClass = 'sortable-fallback';
	/** Appends the cloned DOM Element into the Document's Body. */
	export let fallbackOnBody = false;
	/** Specify in pixels how far the mouse should move before it's considered as a drag. */
	export let fallbackTolerance = 0;
	export let fallbackOffset = {
		x: 0,
		y: 0,
	};
	/** Pixel distance mouse must be from empty sortable to insert drag element into it */
	export let emptyInsertThreshold = 5;
	/** Direction that the Sortable should sort in. Can be set to 'vertical', 'horizontal', or a function, which will be called whenever a target is dragged over. Must return 'vertical' or 'horizontal'. Leave blank to auto detect.*/
	export let direction: 'horizontal' | 'vertical' | undefined = undefined;
	/** How many pixels the point should move before cancelling a delayed drag event */
	export let touchStartThreshold: number | undefined = undefined;
	export let setData: ((dataTransfer: DataTransfer, draggedElement: HTMLElement) => void) | undefined = undefined;
	/** Specifies which items inside the element should be draggable. */
	export let draggable: string | null = null;
	export let removeOnSpill: boolean | undefined = false;

	/**
	 * Element is chosen
	 * */
	const onChoose = (event: SortableEvent) => {
		dispatch('choose', event);
	};
	/**
	 * Element is unchosen
	 * */
	const onUnchoose = (event: SortableEvent) => {
		dispatch('unchoose', event);
	};
	/**
	 * Element dragging started
	 * */
	const onStart = (event: SortableEvent) => {
		dispatch('start', event);
	};
	/**
	 * Element dragging ended
	 * */
	const onEnd = (event: SortableEvent) => {
		dispatch('end', event);
	};
	/**
	 * Element is dropped into the list from another list
	 * */
	const onAdd = (event: SortableEvent) => {
		dispatch('add', event);
	};
	/**
	 * Changed sorting within list
	 * */
	const onUpdate = (event: SortableEvent) => {
		dispatch('update', event);
	};
	/**
	 * Element is removed from the list into another list
	 * */
	const onRemove = (event: SortableEvent) => {
		dispatch('remove', event);
	};
	/**
	 * Attempt to drag a filtered element
	 * */
	const onFilter = (event: SortableEvent) => {
		dispatch('filter', event);
	};
	/**
	 * Called by any change to the list (add / update / remove)
	 * */
	const onSort = (event: SortableEvent) => {
		dispatch('sort', event);
	};
	/**
	 * Called when creating a clone of element
	 * */
	const onClone = (event: SortableEvent) => {
		dispatch('clone', event);
	};
	/**
	 * Event when you move an item in the list or between lists
	 * */
	//const onMove = (event: MoveEvent, _: Event) => {
	//	dispatch('move', event);
	//};
	/**
	 * Called when dragging element changes position
	 * */
	const onChange = (event: SortableEvent) => {
		dispatch('change', event);
	};
	/**
	 * Element dragging spill
	 * */
	const onSpill = (event: SortableEvent) => {
		dispatch('spill', event);
	};

	let options: Options;

	$: {
		const newOptions = {
			group,
			sort,
			disabled,
			store,
			handle,
			swapThreshold,
			invertSwap,
			invertedSwapThreshold,
			removeCloneOnHide,
			ghostClass,
			chosenClass,
			dragClass,
			ignore,
			filter,
			preventOnFilter,
			animation,
			easing,
			dataIdAttr,
			delay,
			delayOnTouchOnly,
			forceFallback,
			fallbackClass,
			fallbackOnBody,
			fallbackTolerance,
			fallbackOffset,
			emptyInsertThreshold,
			direction,
			touchStartThreshold,
			removeOnSpill,
			setData,
		};

		if (options == null) {
			options = newOptions;
		} else {
			for (const [key, newValue] of Object.entries(newOptions) as [keyof Sortable.Options, any][]) {
				const oldValue = options[key];
				if (newValue !== oldValue) {
					(options as any)[key] = newValue;
					sortable.option(key, newValue);
				}
			}
		}
	}

	onMount(() => {
		if (draggable) {
			options.draggable = draggable;
		}

		if (multiDragClass) {
			try {
				Sortable.mount(new MultiDrag());
			} catch (e) {
				// BUG: Do nothing. Find a better way to handle multiple mounts.
			}

			options.multiDrag = true;
			options.selectedClass = multiDragClass;
			options.fallbackTolerance = 3;
		}

		if (swapClass) {
			try {
				Sortable.mount(new Swap());
			} catch (e) {
				// BUG: Do nothing. Find a better way to handle multiple mounts.
			}

			options.swap = true;
			options.swapClass = swapClass;
		}

		sortable = Sortable.create(list, {
			...options,
			onChoose,
			onUnchoose,
			onStart,
			onEnd,
			onAdd,
			onUpdate,
			onRemove,
			onFilter,
			onSort,
			onClone,
			//onMove,
			onChange,
			onSpill,
		});
	});

	onDestroy(() => {
		if (sortable) sortable.destroy();
	});
</script>

<div bind:this={list} class={className ?? ''}>
	<slot />
</div>
