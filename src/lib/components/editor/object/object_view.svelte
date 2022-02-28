<script lang="ts">
	import type { ObjectEditorMeta, RecordKeyMeta, RecordMeta } from '$lib/types/editors';
	import { createEventDispatcher } from 'svelte';
	import MetaView from './meta_view.svelte';

	type T = $$Generic<Record<string, unknown>>;
	export let meta: RecordMeta<T>;
	export let value: T;
	export let valueOriginal: T;
	export let globalMeta: ObjectEditorMeta;

	if (typeof value == 'undefined') {
		value = {} as T;
	}

	let objects: [RecordKeyMeta<T>[keyof T], keyof T][];
	$: objects = Object.keys(meta.children).map((k: keyof T) => [meta.children[k], k]);

	const dispatch = createEventDispatcher<{ change: T }>();
</script>

{#each objects as [childMeta, key]}
	<div class="obj">
		<MetaView
			meta={childMeta}
			bind:value={value[key]}
			valueOriginal={valueOriginal?.[key]}
			on:change={() => dispatch('change', value)}
			{globalMeta}
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
