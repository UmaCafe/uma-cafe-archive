<script lang="ts">
	import { getStores } from '$app/stores';
	let { page } = getStores();

	export let title: string;
	export let description: string;
	export let rawDescription: boolean = false;
	export let image: string = undefined;

	$: url = `${$page.url.href}`;
	$: displayTitle = title ? `${title} - Uma Cafe` : `Uma Cafe`;
</script>

<svelte:head>
	<title>{displayTitle}</title>
	<meta property="og:site_name" content="Uma Cafe" />
	<meta property="og:title" content={displayTitle} />
	{#if rawDescription}
		{@html `<meta property="og:description" content="${description}" />`}
	{:else}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
</svelte:head>
