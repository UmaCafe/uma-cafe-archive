<script lang="ts">
	type SelectItem = {
		value: string;
		label: string;
	};

	export let items: Array<SelectItem>;
	export let value: string = items?.[0]?.value ?? '';
</script>

<div class="list">
	{#each items as item (item.value)}
		<span class="item" class:active={value == item.value} on:click={() => (value = item.value)}>
			<div class="inner">
				{item.label}
			</div>
		</span>
	{/each}
</div>

<style>
	.list {
		margin: 5px;
		padding: 0;
	}

	.item {
		display: inline-block;
		margin: 2px;
		cursor: pointer;
	}

	.item .inner {
		font-weight: bold;
		padding: 6px;
		border: 1px #555 solid;
		border-radius: 20px;
		transform: scale(1);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.item:hover .inner {
		transform: scale(0.95);
	}

	.item.active .inner {
		color: #fff;
		background-color: #282;
	}
</style>
