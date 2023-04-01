export function ClickOutside(element: HTMLElement, callbackFunction: (this: HTMLElement, ev: MouseEvent) => void) {
	function onClick(event: MouseEvent) {
		if (!element.contains(event.target as Node)) {
			callbackFunction.call(element, event);
		}
	}

	document.body.addEventListener('click', onClick);

	return {
		update(newCallbackFunction: typeof callbackFunction) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		},
	};
}
