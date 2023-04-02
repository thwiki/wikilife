/// <reference types="svelte" />
/// <reference types="vite/client" />

import { ComponentType, SvelteComponentTyped } from 'svelte';

declare module '*svg?component' {
	const icon: ComponentType<SvelteComponentTyped>;
	export default icon;
}
