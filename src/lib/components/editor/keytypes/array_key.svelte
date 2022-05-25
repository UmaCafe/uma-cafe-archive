<script lang="ts">
	import type { KeyData, KeySchema } from '$lib/data/base/objects';
	import type { ObjectEditorMeta } from '$lib/util';
	import { createEventDispatcher } from 'svelte';
	import SchemaKey from './schema_key.svelte';

	const dispatch = createEventDispatcher<{ change: any[] | undefined }>();

	export let schema: KeySchema;
	export let keyData: KeyData<unknown> | undefined;
	export let meta: ObjectEditorMeta;
	export let value: any[] | undefined = undefined;

	function updateIndex(index: number, val: any) {
		dispatch('change', [...(value ?? []).slice(0, index), val, ...(value ?? []).slice(index + 1)]);
	}

	function addEntry() {
		dispatch('change', [...(value ?? []), undefined]);
	}

	function deleteEntry(index: number) {
		const newVal = (value ?? []).filter((_, i) => i != index);
		dispatch('change', newVal.length > 0 ? newVal : undefined);
	}
</script>

<button on:click={() => addEntry()}>+ Create</button>
{#if value && value.length > 0}
	<hr />
	{#each value as _, indx}
		<div class="entry">
			<div class="btn">
				<button on:click={() => deleteEntry(indx)}>-</button>
			</div>
			<div class="val">
				<SchemaKey
					type={schema}
					{keyData}
					{meta}
					value={value[indx]}
					on:change={(ev) => updateIndex(indx, ev.detail ?? undefined)}
				/>
			</div>
		</div>
		<hr />
	{/each}
{/if}

<style>
	.entry {
		display: flex;
		flex-direction: row;
	}

	.btn {
		margin: auto 5px;
	}

	.val {
		display: unset;
		flex-grow: 1;
	}
</style>
