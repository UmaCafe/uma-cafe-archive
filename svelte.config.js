import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		target: '#root',
		adapter: node({}),
		files: {
			assets: 'content/public'
		}
	}
};

export default config;
