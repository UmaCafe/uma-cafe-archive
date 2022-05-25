<script lang="ts">
	import type { KVPair } from '$lib/util';

	export let tabs: KVPair[];
	export let panelColor: string = '#282';
	let key: string = tabs?.[0]?.key ?? '';
</script>

<div class="tab-panel" style:--panel-color={panelColor} {...$$restProps}>
	<ul class="tab-list">
		{#each tabs as tab}
			<li class:active={tab.key === key}>
				<button
					on:click={() => {
						key = tab.key;
					}}>{tab.val}</button
				>
			</li>
		{/each}
	</ul>
	<div class="tab-content">
		<slot {key} />
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
