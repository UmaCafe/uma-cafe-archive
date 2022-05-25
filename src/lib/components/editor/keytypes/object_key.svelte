<script lang="ts">
	import type { KeyObjectNames, KeyObjectSchema, KeySchema } from '$lib/data/base/objects';
	import type { ObjectEditorMeta } from '$lib/util';
	import { camelCaseToLabel } from '$lib/util';
	import { createEventDispatcher } from 'svelte';
	import SchemaKey from './schema_key.svelte';

	const dispatch = createEventDispatcher<{ change: Record<string, any> | undefined }>();

	export let schema: KeySchema;
	export let names: KeyObjectNames | undefined;
	export let meta: ObjectEditorMeta;
	export let value: Record<string, any> | undefined = undefined;
	$: object = schema as KeyObjectSchema;

	function isEmpty(val: Record<string, any> | undefined): boolean {
		if (typeof val == 'undefined') return true;
		for (const key of Object.keys(val ?? {})) {
			if (typeof val[key] != 'undefined') return false;
		}
		return true;
	}

	function updateKey(key: string, val: any) {
		const newVal = { ...(value ?? {}), [key]: val };
		dispatch('change', isEmpty(newVal) ? undefined : newVal);
	}
</script>

<div class="container">
	{#each Object.keys(object) as key}
		<div class="label">
			{names?.[key] ?? camelCaseToLabel(key)}
		</div>
		<div class="input">
			<SchemaKey
				type={object[key]}
				{meta}
				value={value?.[key]}
				on:change={(ev) => updateKey(key, ev.detail ?? undefined)}
			/>
		</div>
	{/each}
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: max-content auto;
	}

	.label {
		grid-column: 1;
		padding-right: 5px;
	}

	.input {
		grid-column: 2;
	}
</style>
