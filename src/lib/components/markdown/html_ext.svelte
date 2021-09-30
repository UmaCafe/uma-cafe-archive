<script lang="ts">
	// https://stackoverflow.com/a/60431023
	// For some reason svelte only likes HTML tags if they form a complete tag
	// This gets around that issue

	import { afterUpdate } from 'svelte';

	export let prefix: string;
	export let suffix: string;

	let wrap: HTMLSpanElement;
	let content: HTMLSpanElement;

	afterUpdate(() => {
		const placehold = wrap.querySelector('.placehold');
		placehold.parentNode.replaceChild(content, placehold);
	});
</script>

<span bind:this={wrap}>
	{@html `${prefix}<span class="placehold"></span>${suffix}`}
</span>

<span bind:this={content}>
	<slot />
</span>
