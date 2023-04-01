<script lang="ts" context="module">
	export interface SelectableOptions {
		filter?: string | ((this: Selectable, event: PointerEvent, target: HTMLElement, sortable: Selectable) => boolean) | undefined;
		preventOnFilter?: boolean | undefined;
		handle?: string | undefined;
		selectedClass?: string;
		clickable?: string;
		disabled?: boolean;
	}

	export class Selectable {
		public options: SelectableOptions;

		constructor(public el: HTMLElement, options: SelectableOptions) {
			this.options = {
				filter: null,
				preventOnFilter: true,
				handle: null,
				selectedClass: 'selectable-selected',
				clickable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
				disabled: false,
				...options,
			};
		}

		static create(el: HTMLElement, options?: SelectableOptions) {
			const instance = new Selectable(el, options ?? {});
			instance.mount();
			return instance;
		}

		option<K extends keyof SelectableOptions>(key: K, value: SelectableOptions[K]) {
			this.options[key] = value;
		}

		private mount() {
			this.el.addEventListener('click', this._handleClick);
		}

		private _handleClick = (event: PointerEvent) => {
			if (!event.cancelable) return;

			const { target, type } = event;

			const { el, options } = this;
			const { filter, preventOnFilter } = options;

			if (!(target instanceof HTMLElement)) return;

			const originalTarget =
				(target.shadowRoot &&
					(('path' in event && Array.isArray(event.path) && event.path[0]) || (event.composedPath && event.composedPath()[0]))) ||
				target;

			if ((/click/.test(type) && event.button !== 0) || options.disabled) {
				return; // only left button and enabled
			}

			if (originalTarget.isContentEditable) {
				return;
			}

			const targetElement = closest(target, options.clickable, el, false);

			if (typeof filter === 'function') {
				if (filter.call(this, event, targetElement, this)) {
					/*_dispatchEvent({
						selectable: this,
						rootEl: originalTarget,
						name: 'filter',
						targetEl: targetElement,
						fromEl: el,
					});*/
					preventOnFilter && event.cancelable && event.preventDefault();
					return; // cancel dnd
				}
			} else if (filter) {
				const filter2 = filter.split(',').some(function (criteria) {
					const criteriaEl = closest(originalTarget, criteria.trim(), el, false);

					if (criteriaEl) {
						/*_dispatchEvent({
							selectable: this,
							rootEl: criteriaEl,
							name: 'filter',
							targetEl: targetElement,
							fromEl: el,
						});*/
						return true;
					}
				});

				if (filter2) {
					preventOnFilter && event.cancelable && event.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !closest(originalTarget, options.handle, el, false)) {
				return;
			}

			toggleClass(targetElement, options.selectedClass, undefined);
		};

		destroy() {
			this.el.removeEventListener('click', this._handleClick);
		}
	}

	function toggleClass(el: HTMLElement, name: string | undefined, state: boolean | undefined) {
		if (el && name) {
			const f = state == null ? 'toggle' : state ? 'add' : 'remove';
			for (const n of name.split(/\s+/)) {
				el.classList[f](n);
			}
		}
	}

	function getParentOrHost(el: HTMLElement | Document | ShadowRoot) {
		return (el !== document && 'host' in el && el.host.nodeType ? el.host : el.parentNode) as HTMLElement;
	}

	function matches(el: HTMLElement, selector: string) {
		if (!selector) return;

		selector[0] === '>' && (selector = selector.substring(1));

		if (el) {
			try {
				return el.matches(selector);
			} catch (_) {
				return false;
			}
		}

		return false;
	}

	function closest(el: HTMLElement, selector: string, ctx: HTMLElement | Document, includeCTX?: boolean) {
		if (el) {
			ctx = ctx || document;

			do {
				if (
					(selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector))) ||
					(includeCTX && el === ctx)
				) {
					return el;
				}

				if (el === ctx) break;
			} while ((el = getParentOrHost(el)));
		}

		return null;
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let list: HTMLElement;
	let selectable: Selectable;

	let className: string;
	/**
	 * Classes to be added to the list div
	 */
	export { className as class };

	export let filter: SelectableOptions['filter'] | undefined = undefined;
	export let preventOnFilter: boolean = undefined;
	export let handle: string = undefined;
	export let selectedClass = 'sortable-selected';
	export let clickable: string = undefined;
	export let disabled = false;

	let options: SelectableOptions;

	$: {
		const newOptions = {
			filter,
			preventOnFilter,
			handle,
			selectedClass,
			disabled,
		};

		if (options == null) {
			options = newOptions;
		} else {
			for (const [key, newValue] of Object.entries(newOptions) as [keyof SelectableOptions, any][]) {
				const oldValue = options[key];
				if (newValue !== oldValue) {
					(options as any)[key] = newValue;
					selectable.option(key, newValue);
				}
			}
		}
	}

	onMount(() => {
		if (clickable) {
			options.clickable = clickable;
		}

		selectable = Selectable.create(list, options);
	});

	onDestroy(() => {
		if (selectable) selectable.destroy();
	});
</script>

<div bind:this={list} class={className ?? ''} class:disabled>
	<slot />
</div>
