<script lang="ts">
	import type { KVPair } from '$lib/util';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: unknown | undefined }>();

	export let value: unknown | undefined = undefined;
	export let choices: KVPair[];
</script>

<select {value} on:change={(ev) => dispatch('change', ev.currentTarget.value)}>
	<option />
	{#each choices as choice}
		<option value={choice.key}>{choice.val}</option>
	{/each}
</select>
