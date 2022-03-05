<script lang="ts">
	import type { ObjectEditorMeta, ObjectMeta } from '$lib/types/editors';
	import { createEventDispatcher, onMount } from 'svelte';
	import Uploader from '../uploader.svelte';
	import ArrayView from './array_view.svelte';
	import ObjectView from './object_view.svelte';
	import SelectOther from './select_other.svelte';

	type T = $$Generic<unknown>;
	export let meta: ObjectMeta<T>;
	export let value: T = undefined;
	export let valueOriginal: T = undefined;
	export let globalMeta: ObjectEditorMeta;

	if (typeof value == 'undefined' && (meta.type == 'object' || meta.type == 'array')) {
		value = (meta.type == 'array' ? [] : {}) as T;
	}

	// svelte doesn't like type casting in blocks at the moment
	function ensure<T>(obj: unknown, _as: T): T {
		return obj as T;
	}

	const dispatch = createEventDispatcher<{ change: T }>();

	function update() {
		value = value;
		dispatch('change', value);
	}

	let dynamicChoices = [];
	onMount(() => {
		if (meta.type == 'dynamic') {
			meta.getChoices(fetch).then((choices) => {
				dynamicChoices = choices;
			});
		}
	});
</script>

{#if meta.type == 'array'}
	<ArrayView
		{meta}
		valueOriginal={ensure(valueOriginal, [])}
		value={ensure(value, [])}
		on:change={(ev) => {
			value = ensure(ev.detail, value);
			update();
		}}
		{globalMeta}
	/>
{:else if meta.type == 'object'}
	<h3>{meta.name}</h3>
	<ObjectView
		{meta}
		valueOriginal={ensure(valueOriginal, {})}
		value={ensure(value, {})}
		on:change={(ev) => {
			value = ensure(ev.detail, value);
			update();
		}}
		{globalMeta}
	/>
{:else if meta.type == 'number'}
	<div>
		<label title={meta.description}
			><strong>{meta.name}:</strong>
			<input
				type="number"
				placeholder={`${meta.example ?? ''}`}
				value={ensure(value, 0)}
				on:change={(ev) => {
					value = ev.target['value'];
					update();
				}}
			/></label
		>{#if value != valueOriginal}
			<span>*</span>
			<button
				on:click={() => {
					value = valueOriginal;
					update();
				}}>X</button
			>
		{/if}
	</div>
{:else if meta.type == 'boolean'}
	<label title={meta.description}
		><strong>{meta.name}:</strong>
		<input
			type="checkbox"
			checked={ensure(value, true)}
			on:change={(ev) => {
				value = ev.target['checked'];
				update();
			}}
		/>{#if value != valueOriginal}
			<span>*</span>
			<button
				on:click={() => {
					value = valueOriginal;
					update();
				}}>X</button
			>
		{/if}
	</label>
{:else if meta.type == 'string'}
	<label title={meta.description}
		><strong>{meta.name}:</strong>{#if value != valueOriginal}
			<span>*</span>
			<button
				on:click={() => {
					value = valueOriginal;
					update();
				}}>X</button
			>
		{/if}
		<input
			type="text"
			style="width: 100%"
			placeholder={`${meta.example ?? ''}`}
			value={ensure(value, '') ?? ''}
			on:change={(ev) => {
				value = ev.target['value'];
				update();
			}}
		/></label
	>
{:else if meta.type == 'enum'}
	<label title={meta.description}
		><strong>{meta.name}:</strong>
		<select bind:value on:change={() => update()}>
			<option value={undefined} />
			{#each meta.choices as choice}
				<option value={choice.value}>{choice.label}</option>
			{/each}
		</select>{#if value != valueOriginal}
			<span>*</span>
			<button
				on:click={() => {
					value = valueOriginal;
					update();
				}}>X</button
			>
		{/if}</label
	>
{:else if meta.type == 'dynamic'}
	<label title={meta.description}
		><strong>{meta.name}:</strong>
		<select bind:value on:change={() => update()}>
			<option value={undefined} />
			{#each dynamicChoices as choice}
				<option value={choice.value}>{choice.label}</option>
			{/each}
		</select>{#if value != valueOriginal}
			<span>*</span>
			<button
				on:click={() => {
					value = valueOriginal;
					update();
				}}>X</button
			>
		{/if}</label
	>
{:else if meta.type == 'suggest'}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label title={meta.description}
		><strong>{meta.name}:</strong>
		<SelectOther
			bind:value
			suggestions={meta.suggestions}
			on:change={() => update()}
		/>{#if value != valueOriginal}
			<span>*</span>
			<button
				on:click={() => {
					value = valueOriginal;
					update();
				}}>X</button
			>
		{/if}</label
	>
{:else if meta.type == 'file'}
	<div title={meta.description}><strong>{meta.name}</strong></div>
	<Uploader
		allowedTypes={meta.mime}
		filePrefix={globalMeta.assetFolder}
		defaultFilename={meta.defaultFileName}
		bind:fullFilePath={value}
		on:change={() => update()}
	/>
	{#if value != valueOriginal}
		<button
			on:click={() => {
				value = valueOriginal;
				update();
			}}>Revert</button
		>
	{/if}
{/if}

<style>
	[title] {
		text-decoration: underline;
		text-decoration-style: dotted;
		cursor: help;
	}
</style>
