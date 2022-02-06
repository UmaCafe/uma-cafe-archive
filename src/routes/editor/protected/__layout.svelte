<script lang="ts" context="module">
	import type { EditorObject } from '$lib/types/editors';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
		const editor = session.editor as EditorObject;
		if (editor) {
			return {
				status: 200
			};
		}
		return {
			status: 302,
			redirect: '/'
		};
	};
</script>

<slot />
