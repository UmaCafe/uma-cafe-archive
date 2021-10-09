<script lang="ts">
	type SelectItem = {
		value: string;
		label: string;
	};

	export let items: Array<SelectItem>;
	export let value: string = items?.[0].value ?? '';
</script>

<ul>
	{#each items as item (item.value)}
		<li class:active={value == item.value} on:click={() => (value = item.value)}>
			{item.label}
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 5px;
		padding: 0;
		border: none;
	}

	li {
		font-weight: bold;
		list-style: none;
		display: inline-block;
		padding: 8px;
		margin: 2px;
		border: 1px #555 solid;
		border-radius: 20px;
		cursor: pointer;
	}

	li.active {
		color: #fff;
		background-color: #282;
	}
</style>
