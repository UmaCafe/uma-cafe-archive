<script lang="ts" context="module">
	let counter = 0;
</script>

<script lang="ts">
	import type { TranslatedString } from '$lib/data/base/objects';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: TranslatedString | undefined }>();

	export let value: TranslatedString | undefined = undefined;
	export let suggestions: TranslatedString[] | undefined = undefined;

	$: if (suggestions) {
		const find = suggestions.find((val) => val.jp == value?.jp);
		if (value?.jp && find?.en) {
			lockEN = true;
			if (value.en != find.en) {
				value = { jp: value.jp, en: find.en };
				dispatch('change', { ...value });
			}
		} else {
			lockEN = false;
		}
	}

	let cur = counter++;
	let editJP = !value?.jp;
	let lockEN = false;
</script>

<div class="entry">
	<label for="jp{cur}">JP:</label>
	{#if editJP}
		<input
			id="jp{cur}"
			type="text"
			value={value?.jp ?? ''}
			on:change={(ev) =>
				dispatch(
					'change',
					value?.en || ev.currentTarget.value.length > 0
						? {
								...(value ?? {}),
								jp: ev.currentTarget.value.length > 0 ? ev.currentTarget.value : undefined
						  }
						: undefined
				)}
		/>
	{:else}
		<div class="text">{value?.jp ?? ''}</div>
	{/if}
	<div>
		{#if !editJP}
			<button on:click={() => (editJP = true)}>Edit</button>
		{:else}
			<button on:click={() => (editJP = false)}>Done</button>
		{/if}
	</div>
</div>
<div class="entry">
	<label for="en{cur}">EN:</label>
	<input
		id="en{cur}"
		type="text"
		value={value?.en ?? ''}
		disabled={lockEN}
		list="list{cur}"
		on:change={(ev) =>
			dispatch(
				'change',
				value?.jp || ev.currentTarget.value.length > 0
					? {
							...(value ?? {}),
							en: ev.currentTarget.value.length > 0 ? ev.currentTarget.value : undefined
					  }
					: undefined
			)}
	/>
</div>
<datalist id="list{cur}">
	{#each suggestions ?? [] as suggest}
		<option value={suggest.en} />
	{/each}
</datalist>

<style>
	.entry {
		display: flex;
		flex-direction: row;
		margin: 5px;
	}
	.text {
		width: 100%;
	}
	label {
		width: 30px;
	}
	input {
		flex-grow: 1;
	}
	button {
		margin: 0px 2px;
	}
</style>
