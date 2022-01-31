<script lang="ts">
	type T = $$Generic;
	export let exampleObject: T;
	export let objectOriginal: T;
	export let objectToEdit: T;
</script>

{#each Object.keys(exampleObject) as key}
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
					<svelte:self
						exampleObject={exampleObject[key][0]}
						objectOriginal={objectOriginal[key][i]}
						objectToEdit={obj}
					/>
				</div>
			{/each}
		{:else if typeof exampleObject[key] == 'object'}
			<h3>{key}</h3>
			<svelte:self
				exampleObject={exampleObject[key]}
				objectOriginal={objectOriginal?.[key]}
				objectToEdit={objectToEdit?.[key]}
			/>
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
</style>
