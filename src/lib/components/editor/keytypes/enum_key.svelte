<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: string | undefined }>();

	export let value: string | undefined = undefined;
	export let choices: string[];
</script>

<select {value} on:change={(ev) => dispatch('change', ev.currentTarget.value)}>
	{#each choices as choice}
		<option value={choice}>{choice}</option>
	{/each}
</select>
