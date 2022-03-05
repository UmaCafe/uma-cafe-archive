<script lang="ts">
	import { page, session as appSession } from '$app/stores';
	import type { Load } from '@sveltejs/kit';
	import type { LoadInput } from '@sveltejs/kit/types/internal';
	import { onMount } from 'svelte';

	export let component: unknown;
	export let load: Load<Record<string, string>, Record<string, any>>;
	export let params = {};
	export let props = {};
	export let stuff = {};

	let session = $appSession;
	let url = $page.url;

	let outProps: Record<string, unknown>;

	onMount(async () => {
		const input: LoadInput<Record<string, string>, Record<string, any>> = {
			fetch,
			params,
			props,
			session,
			stuff,
			url
		};
		const res = await load(input);
		let resProps = res.props ?? {};
		outProps = { ...resProps, ...props };
	});
</script>

{#if outProps}
	<svelte:component this={component} {...outProps} />
{/if}
