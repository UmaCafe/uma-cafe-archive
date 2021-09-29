<script type="ts">
	export let pre: boolean;
</script>

{#if pre}
	<pre><slot /></pre>
{:else}
	<p><slot /></p>
{/if}
