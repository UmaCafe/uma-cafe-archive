<script lang="ts">
	type T = $$Generic<Object>;
	export let exampleObject: T;
	export let objectOriginal: T;
	export let objectToEdit: T;
	export let key: string;

	if (typeof exampleObject[key] == 'object') {
		if (!(key in objectOriginal)) objectOriginal[key] = Array.isArray(exampleObject[key]) ? [] : {};
		if (!(key in objectToEdit)) objectToEdit[key] = Array.isArray(exampleObject[key]) ? [] : {};
	}
</script>

<div class="obj">
	{#if Array.isArray(exampleObject[key])}
		<h3>{key}</h3>
		<button
			on:click={() => {
				objectToEdit[key].push({});
				objectToEdit[key] = objectToEdit[key]; // force update
			}}>Add</button
		>
		{#each objectToEdit[key] as obj, i}
			<div class="obj">
				<button
					on:click={() => {
						objectToEdit[key].splice(i, 1);
						objectToEdit[key] = objectToEdit[key]; // force update
					}}>X</button
				>
				{#each Object.keys(exampleObject[key][0]) as objKey}
					<svelte:self
						exampleObject={exampleObject[key][0]}
						objectOriginal={objectOriginal[key][i]}
						objectToEdit={obj}
						key={objKey}
					/>
				{/each}
			</div>
		{/each}
	{:else if typeof exampleObject[key] == 'object'}
		<h3>{key}</h3>
		{#each Object.keys(exampleObject[key]) as objKey}
			<svelte:self
				exampleObject={exampleObject[key]}
				objectOriginal={objectOriginal?.[key]}
				objectToEdit={objectToEdit?.[key]}
				key={objKey}
			/>
		{/each}
	{:else if typeof exampleObject[key] == 'number'}
		<div>
			<label
				><strong>{key}:</strong>
				<input
					type="number"
					placeholder={exampleObject[key]}
					bind:value={objectToEdit[key]}
				/></label
			>{#if objectToEdit?.[key] != objectOriginal?.[key]}
				<span>*</span>
				<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
			{/if}
		</div>
	{:else if typeof exampleObject[key] == 'string'}
		<label
			><strong>{key}:</strong>{#if objectToEdit?.[key] != objectOriginal?.[key]}
				<span>*</span>
				<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
			{/if}
			<input
				type="text"
				style="width: 100%"
				placeholder={exampleObject[key]}
				bind:value={objectToEdit[key]}
			/></label
		>
	{:else if typeof exampleObject[key] == 'boolean'}
		<label
			><strong>{key}:</strong>
			<input
				type="checkbox"
				bind:checked={objectToEdit[key]}
			/>{#if objectToEdit?.[key] != objectOriginal?.[key]}
				<span>*</span>
				<button on:click={() => (objectToEdit[key] = objectOriginal?.[key])}>X</button>
			{/if}
		</label>
	{/if}
</div>

<style>
	.obj {
		padding: 5px 10px;
		border: 1px solid #aaa;
		border-radius: 10px;
		margin: 2px;
	}
</style>
