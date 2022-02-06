<script lang="ts">
	import type { EditorMetadata, ObjectEditorMeta } from '$lib/types/editors';
	import Uploader from './uploader.svelte';

	type T = $$Generic<Record<string, unknown>>;
	export let metaObject: EditorMetadata<T>;
	export let objectOriginal: T;
	export let objectToEdit: T;
	export let globalMeta: ObjectEditorMeta;

	// svelte doesn't like type casting in blocks at the moment
	function ensure<T>(obj: unknown, _as: T): T {
		return obj as T;
	}

	let objects: [EditorMetadata<T>[keyof T], keyof T][];
	$: objects = Object.keys(metaObject).map((k: keyof T) => {
		const meta = metaObject[k];
		if (meta.type == 'object' || meta.type == 'array') {
			if (!(k in objectOriginal))
				Object.assign(objectOriginal, { [k]: meta.type == 'array' ? [] : {} });
			if (!(k in objectToEdit))
				Object.assign(objectToEdit, { [k]: meta.type == 'array' ? [] : {} });
		}
		return [meta, k];
	});
</script>

{#each objects as [meta, key]}
	<div class="obj">
		{#if meta.type == 'array'}
			<h3>{meta.name}</h3>
			<button
				on:click={() => {
					ensure(objectToEdit[key], []).push({});
					objectToEdit[key] = objectToEdit[key]; // force update
				}}>Add</button
			>
			{#if ensure(objectToEdit[key], []).length != ensure(objectOriginal[key], []).length}
				<button
					on:click={() => {
						Object.assign(objectToEdit, { [key]: ensure(objectOriginal[key], []).slice() });
						objectToEdit[key] = objectToEdit[key]; // force update
					}}>Revert</button
				>
			{/if}
			{#each ensure(objectToEdit[key], []) as obj, i}
				<div class="obj">
					<button
						on:click={() => {
							ensure(objectToEdit[key], []).splice(i, 1);
							objectToEdit[key] = objectToEdit[key]; // force update
						}}>X</button
					>
					<svelte:self
						metaObject={meta.entry}
						objectOriginal={objectOriginal[key][i] ?? {}}
						objectToEdit={obj ?? {}}
						{globalMeta}
					/>
				</div>
			{/each}
		{:else if meta.type == 'object'}
			<h3>{meta.name}</h3>
			<svelte:self
				metaObject={meta.children}
				objectOriginal={objectOriginal?.[key] ?? {}}
				objectToEdit={objectToEdit?.[key] ?? {}}
				{globalMeta}
			/>
		{:else if meta.type == 'number'}
			<div>
				<label title={meta.description}
					><strong>{meta.name}:</strong>
					<input
						type="number"
						placeholder={`${meta.example ?? ''}`}
						value={ensure(objectToEdit[key], 0)}
						on:change={(ev) => (objectToEdit[key] = ev.target['value'])}
					/></label
				>{#if objectToEdit?.[key] != objectOriginal?.[key]}
					<span>*</span>
					<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
				{/if}
			</div>
		{:else if meta.type == 'boolean'}
			<label title={meta.description}
				><strong>{meta.name}:</strong>
				<input
					type="checkbox"
					checked={ensure(objectToEdit[key], true)}
					on:change={(ev) => (objectToEdit[key] = ev.target['checked'])}
				/>{#if objectToEdit?.[key] != objectOriginal?.[key]}
					<span>*</span>
					<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
				{/if}
			</label>
		{:else if meta.type == 'string' || meta.type == 'suggest'}
			<label title={meta.description}
				><strong>{meta.name}:</strong>{#if objectToEdit?.[key] != objectOriginal?.[key]}
					<span>*</span>
					<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
				{/if}
				<input
					type="text"
					list={meta.type == 'suggest' ? meta.name : undefined}
					style="width: 100%"
					placeholder={`${meta.example ?? ''}`}
					value={ensure(objectToEdit[key], '')}
					on:change={(ev) => (objectToEdit[key] = ev.target['value'])}
				/></label
			>
			{#if meta.type == 'suggest'}
				<datalist id={meta.name}>
					{#each meta.suggestions as opt}
						<option value={opt} />
					{/each}
				</datalist>
			{/if}
		{:else if meta.type == 'enum'}
			<label title={meta.description}
				><strong>{meta.name}:</strong>
				<select bind:value={objectToEdit[key]}>
					<option value={undefined} />
					{#each meta.choices as choice}
						<option value={choice.value}>{choice.label}</option>
					{/each}
				</select>{#if objectToEdit?.[key] != objectOriginal?.[key]}
					<span>*</span>
					<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
				{/if}</label
			>
		{:else if meta.type == 'file'}
			<div title={meta.description}><strong>{meta.name}</strong></div>
			<Uploader
				allowedTypes={meta.mime}
				filePrefix={globalMeta.assetFolder}
				defaultFilename={meta.defaultFileName}
				bind:fullFilePath={objectToEdit[key]}
			/>
			{#if objectToEdit?.[key] != objectOriginal?.[key]}
				<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>Revert</button>
			{/if}
		{/if}
	</div>
{/each}

<style>
	.obj {
		padding: 5px 10px;
		border: 1px solid #aaa;
		border-radius: 10px;
		margin: 2px;
	}

	[title] {
		text-decoration: underline;
		text-decoration-style: dotted;
		cursor: help;
	}
</style>
