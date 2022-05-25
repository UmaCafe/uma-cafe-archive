<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: boolean | undefined }>();

	export let value: boolean | undefined = undefined;
</script>

<input
	type="checkbox"
	checked={value}
	on:change={(ev) => dispatch('change', ev.currentTarget.checked)}
/>
