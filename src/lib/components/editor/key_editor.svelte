<script lang="ts">
	import type { EditorInformation } from '$lib/data/base/objects';
	import type { ObjectEditorMeta } from '$lib/util';
	import { camelCaseToLabel, sortedJson } from '$lib/util';
	import { createEventDispatcher } from 'svelte';
	import SchemaKey from './keytypes/schema_key.svelte';

	const dispatch = createEventDispatcher<{ change: { newValue: any; isDiff: boolean } }>();

	type T = $$Generic<DatabaseObject>;

	export let info: EditorInformation<T>;
	export let editorMeta: ObjectEditorMeta;

	const copy = () =>
		typeof info.dbVal != 'undefined' ? JSON.parse(JSON.stringify(info.dbVal)) : undefined;

	const setVal = (val: any) => {
		value = val;
		changed = sortedJson(original) != sortedJson(value);
		dispatch('change', { newValue: value, isDiff: changed });
	};

	let original: any = info.dbVal;
	export let value: any = copy();

	let originalSerialized = sortedJson(original);
	$: valueSerialized = sortedJson(value);

	export let changed = false;
	$: changed = originalSerialized != valueSerialized;
</script>

<div class="obj">
	<div class="header">
		<h4>
			{info.keyData.name ?? camelCaseToLabel(info.objKey + '')}{#if changed}
				* <button on:click={() => setVal(copy())}>X</button>
			{/if}
		</h4>
		{#if info.keyData.description}<p>{info.keyData.description}</p>{/if}
	</div>
	<SchemaKey
		type={info.keyData.type}
		meta={editorMeta}
		keyData={info.keyData}
		choices={info.choices}
		{value}
		on:change={(ev) => setVal(ev.detail ?? undefined)}
	/>
</div>

<style>
	.obj {
		margin: 8px;
		padding: 5px 10px;
		border: 1px solid #777;
		border-radius: 5px;
	}

	.header h4,
	.header p {
		margin: 0;
	}
</style>
