<script lang="ts">
	export let pre: boolean | undefined = undefined;
</script>

{#if pre}
	<pre><slot /></pre>
{:else}
	<p><slot /></p>
{/if}
