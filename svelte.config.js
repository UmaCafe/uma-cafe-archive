import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: node({}),
		files: {
			assets: 'public'
		},
		vite: {
			define: {
				global: {}
			}
		}
	}
};

export default config;
