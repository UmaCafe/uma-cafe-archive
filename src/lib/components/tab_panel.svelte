<script lang="ts">
	type Tab = {
		label: string;
		value: string;
	};

	export let tabs: Array<Tab>;
	export let panelColor: string = '#282';
	let value: string = tabs?.[0]?.value ?? '';
</script>

<div class="tab-panel" style:--panel-color={panelColor} {...$$restProps}>
	<ul class="tab-list">
		{#each tabs as tab}
			<li class:active={tab.value === value}>
				<button
					on:click={() => {
						value = tab.value;
					}}>{tab.label}</button
				>
			</li>
		{/each}
	</ul>
	<div class="tab-content">
		<slot {value} />
	</div>
</div>

<style>
	.tab-list {
		display: flex;
		list-style: none;
		position: relative;
		margin: 0;
		padding: 0;
        margin-bottom: 10px;
		justify-content: center;
	}

	.tab-list li {
		flex-basis: 0;
		min-width: 33%;
	}

	.tab-list li button {
		padding: 5px;
		width: 100%;
		height: 100%;
		background-color: transparent;
		border: none;
		font-weight: bold;
	}

	.tab-list button:hover {
		background-color: #ddd;
	}

	li.active::after {
		display: block;
		content: '';
		border-bottom: 4px solid var(--panel-color);
	}
</style>
