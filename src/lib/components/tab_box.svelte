<script lang="ts">
	import type { KVPair } from '$lib/util';

	export let tabs: Array<KVPair>;
	export let outlineColor: string = '#282';
	export let fontColor: string = '#000';
	export let backgroundColor: string = '#f5f5ff';
	let key: string = tabs?.[0]?.key ?? '';
</script>

<div
	class="tab-box"
	style:--outline-color={outlineColor}
	style:--font-color={fontColor}
	style:--background-color={backgroundColor}
	{...$$restProps}
>
	<ul class="tab-list">
		{#each tabs as tab}
			<li class:active={tab.key === key}>
				<button
					on:click={() => {
						key = tab.key;
					}}>{tab.val}</button
				>
				<div class="extra" />
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
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
		align-items: stretch;
		z-index: 1;
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
		padding: 10px 8px 8px;
		width: 100%;
		height: 100%;
		border: 2px solid var(--background-color);
		border-bottom-width: 0px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		color: var(--font-color);
		background-color: #d2d2e4;
		cursor: pointer;
		font-weight: bold;
	}

	.tab-list li.active button {
		position: relative;
		background-color: var(--background-color);
	}

	.tab-list li.active .extra {
		position: absolute;
		top: 5px;
		left: 5px;
		width: calc(100% - 14px);
		height: calc(100% - 1px);
		border: 2px solid var(--outline-color);
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		z-index: 10;
	}

	.tab-list li.active .extra::after {
		content: '';
		position: absolute;
		bottom: -3px;
		left: 0px;
		width: calc(100%);
		height: 6px;
		background-color: var(--background-color);
		z-index: 11;
	}

	.tab-content {
		position: relative;
		padding: 20px 15px;
		border: 0px solid black;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		background-color: var(--background-color);
	}

	.tab-content::after {
		content: '';
		position: absolute;
		top: 5px;
		left: 5px;
		width: calc(100% - 14px);
		height: calc(100% - 14px);
		background-color: transparent;
		border: 2px solid var(--outline-color);
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		pointer-events: none;
	}
</style>
