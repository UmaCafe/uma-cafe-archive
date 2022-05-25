<script lang="ts">
	import type { KeyData, KeySchema } from '$lib/data/base/objects';
	import type { KVPair, ObjectEditorMeta } from '$lib/util';
	import { createEventDispatcher } from 'svelte';
	import Uploader from '../uploader.svelte';
	import ArrayKey from './array_key.svelte';
	import BooleanKey from './boolean_key.svelte';
	import DynamicKey from './dynamic_key.svelte';
	import EnumKey from './enum_key.svelte';
	import NumberKey from './number_key.svelte';
	import ObjectKey from './object_key.svelte';
	import StringKey from './string_key.svelte';
	import TranslatedKey from './translated_key.svelte';

	const dispatch = createEventDispatcher<{ change: any | undefined }>();

	export let type: KeySchema | undefined;
	export let value: any | undefined = undefined;
	export let meta: ObjectEditorMeta;

	function update(newVal: any | undefined) {
		value = newVal ?? undefined;
		dispatch('change', newVal ?? undefined);
	}

	export let keyData: KeyData<unknown> | undefined = undefined;
	export let choices: KVPair[] | undefined = undefined;
</script>

{#if type == 'dynamic'}
	<DynamicKey choices={choices ?? []} {value} on:change={(ev) => update(ev.detail)} />
{:else if type == 'object' && keyData?.schema}
	<ObjectKey
		schema={keyData.schema}
		names={keyData.schemaNames}
		{meta}
		{value}
		on:change={(ev) => update(ev.detail)}
	/>
{:else if type == 'array' && keyData?.schema}
	<ArrayKey
		schema={keyData.schema}
		{keyData}
		{meta}
		{value}
		on:change={(ev) => update(ev.detail)}
	/>
{:else if type == 'string'}
	{#if keyData?.fileMime}
		<Uploader
			allowedTypes={keyData.fileMime}
			filePrefix={meta.assetFolder}
			defaultFilename={keyData.fileDefaultName}
			fullFilePath={value}
			on:updatePath={(ev) => update(ev.detail)}
		/>
	{:else if keyData?.enumChoices}
		<EnumKey {value} choices={keyData.enumChoices} on:change={(ev) => update(ev.detail)} />
	{:else}
		<StringKey {value} on:change={(ev) => update(ev.detail)} />
	{/if}
{:else if type == 'translated'}
	<TranslatedKey {value} suggestions={keyData?.suggestTl} on:change={(ev) => update(ev.detail)} />
{:else if type == 'number'}
	<NumberKey {value} on:change={(ev) => update(ev.detail)} />
{:else if type == 'boolean'}
	<BooleanKey {value} on:change={(ev) => update(ev.detail)} />
{:else if typeof type == 'object'}
	<ObjectKey
		schema={type}
		names={keyData?.schemaNames}
		{meta}
		{value}
		on:change={(ev) => update(ev.detail)}
	/>
{:else}
	{type}
{/if}
