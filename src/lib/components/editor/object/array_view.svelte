<script lang="ts">
	import type { ArrayMeta, ObjectEditorMeta } from '$lib/types/editors';
	import { createEventDispatcher } from 'svelte';
	import MetaView from './meta_view.svelte';

	type ArrayContent = $$Generic<unknown>;
	export let meta: ArrayMeta<ArrayContent[]>;
	export let value: ArrayContent[];
	export let valueOriginal: ArrayContent[];
	export let globalMeta: ObjectEditorMeta;

	if (typeof value == 'undefined') {
		value = [];
	}

	const dispatch = createEventDispatcher<{ change: ArrayContent[] }>();

	function update() {
		value = value;
		dispatch('change', value);
	}
</script>

<h3>{meta.name}</h3>
<button
	on:click={() => {
		value.push(meta.default);
		update();
	}}>Add</button
>
{#if (valueOriginal && value.length != valueOriginal.length) || (value.length > 0 && !valueOriginal)}
	<button
		on:click={() => {
			value = valueOriginal?.slice() ?? [];
			update();
		}}>Revert</button
	>
{/if}
{#each value as obj, i}
	<div class="obj">
		<button
			on:click={() => {
				value.splice(i, 1);
				update();
			}}>X</button
		>
		<MetaView
			meta={meta.entry}
			value={obj}
			valueOriginal={valueOriginal?.[i]}
			{globalMeta}
			on:change={(ev) => {
				value[i] = ev.detail;
				update();
			}}
		/>
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
