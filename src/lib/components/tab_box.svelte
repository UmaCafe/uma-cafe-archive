<script lang="ts">
	type Tab = {
		label: string;
		value: string;
	};

	export let tabs: Array<Tab>;
	export let color: string = '#282';
	let value: string = tabs?.[0]?.value ?? '';
</script>

<div class="tab-box" style="--tab-color: {color};" {...$$restProps}>
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
		margin: 0;
		padding: 0;
		list-style: none;
		align-items: stretch;
	}

	.tab-list li {
		flex-basis: 0;
		flex-grow: 1;
		margin-right: 3px;
		transform-origin: bottom;
		transform: scale(1);
		transition: transform 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.tab-list li:hover,
	.tab-list li.active {
		transform: scale(1, 0.9);
	}

	.tab-list li:last-of-type {
		margin-right: 0px;
	}

	.tab-list button {
		padding: 10px;
		width: 100%;
		height: 100%;
		border: 1px solid black;
		border-bottom-width: 0;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background-color: #e9e9f2;
		cursor: pointer;
		font-weight: bold;
	}

	.tab-list li.active button {
		color: #fff;
		background-color: var(--tab-color);
	}

	.tab-content {
		padding: 20px 15px;
		border: 1px solid black;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
</style>
