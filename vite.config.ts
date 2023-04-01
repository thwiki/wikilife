import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import svelteSVG from 'vite-plugin-svelte-svg';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		svelteSVG({
			svgoConfig: {
				plugins: [
					{
						name: 'removeViewBox',
						active: false,
					},
					'removeDimensions',
				],
			},
			requireSuffix: true,
		}),
		svelte(),
	],
});
