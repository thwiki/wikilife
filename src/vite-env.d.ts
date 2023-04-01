/// <reference types="svelte" />
/// <reference types="vite/client" />

import { ComponentType, SvelteComponentTyped } from 'svelte';

declare module '*svg?component' {
	const icon: ComponentType<SvelteComponentTyped>;
	export default icon;
}

declare module 'svelte-unicons/src/icons/*.svelte' {
	const icon: ComponentType<SvelteComponentTyped>;
	export default icon;
}
