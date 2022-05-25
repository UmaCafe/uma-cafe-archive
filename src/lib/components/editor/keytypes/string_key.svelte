<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: string | undefined }>();

	export let value: string | undefined = undefined;
</script>

<input
	type="text"
	value={value ?? ''}
	on:change={(ev) =>
		dispatch('change', ev.currentTarget.value.length > 0 ? ev.currentTarget.value : undefined)}
/>

<style>
	input {
		width: 100%;
	}
</style>
