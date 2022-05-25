<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: number | undefined }>();

	export let value: number | undefined = undefined;
</script>

<input
	type="number"
	{value}
	on:change={(ev) => dispatch('change', parseFloat(ev.currentTarget.value))}
/>
