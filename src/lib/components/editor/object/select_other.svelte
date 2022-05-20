<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic<unknown>;
	export let value: T | undefined = undefined;
	export let suggestions: T[] = [];

	const dispatch = createEventDispatcher<{ change: T }>();

	function ensure<T>(obj: unknown, _as: T): T {
		return obj as T;
	}

	let useOther: boolean;
	$: useOther = typeof value !== 'undefined' && !suggestions.includes(value);
</script>

<select
	value={useOther ? 'Other' : value}
	on:change={(ev) => {
		let newValue = ev.currentTarget.value;
		if (newValue == '') {
			value = undefined;
		} else value = ensure(newValue == 'Other' ? '' : newValue, value);
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
		let newValue = ev.currentTarget.value;
		if (typeof newValue !== 'undefined' && newValue !== '') {
			value = ensure(newValue, value);
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
