<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic<unknown>;
	export let value: T = undefined;
	export let suggestions: T[] = [];

	const dispatch = createEventDispatcher<{ change: T }>();

	let useOther: boolean;
	$: useOther = typeof value !== 'undefined' && !suggestions.includes(value);
</script>

<select
	value={useOther ? 'Other' : value}
	on:change={(ev) => {
		let newValue = ev.target['value'];
		if (newValue == '') {
			value = undefined;
		} else value = newValue == 'Other' ? '' : newValue;
		dispatch('change', value);
	}}
>
	<option value={''} />
	{#each suggestions as choice}
		<option value={choice}>{choice}</option>
	{/each}
	<option value="Other">Other</option>
</select><input
	type="text"
	{value}
	on:change={(ev) => {
		let newValue = ev.target['value'];
		if (typeof newValue !== 'undefined' && newValue !== '') {
			value = newValue;
			dispatch('change', value);
		}
	}}
	class:hide={!useOther}
/>

<style>
	.hide {
		display: none;
	}
</style>
