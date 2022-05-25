<script lang="ts">
	import type { BaseObject } from '$lib/data/base/objects';
	import type { Race } from '$lib/data/races';

	export let raceInfo: BaseObject<Race>;

	function trackString() {
		let str = '';
		if (raceInfo.trackName) str += `${raceInfo.trackName} - `;
		if (raceInfo.trackDistance) str += `${raceInfo.trackDistance}m `;
		if (raceInfo.trackType || raceInfo.trackDirection) str += '(';
		if (raceInfo.trackType) str += `${raceInfo.trackType}, `;
		if (raceInfo.trackDirection) str += `${raceInfo.trackDirection}`;
		if (raceInfo.trackType || raceInfo.trackDirection) str += ')';
		return str.length > 0 ? str : undefined;
	}
</script>

<div class="race">
	<img class="logo" src={raceInfo.imageThumb} alt="" />
	<div class="info">
		<h2>{raceInfo.name?.en}</h2>
		{#if trackString()}
			<h3>{trackString()}</h3>
		{/if}
		{#if raceInfo.raceTimeDescription}
			<h3>{raceInfo.raceTimeDescription}</h3>
		{/if}
	</div>
</div>

<style>
	.race {
		display: flex;
		flex-direction: row;
		text-align: left;
	}

	.race .logo {
		flex-basis: 0;
		width: 200px;
		padding: 0px 20px;
	}

	.race .info {
		flex-grow: 1;
	}

	.info h2,
	.info h3 {
		margin: 0;
	}
</style>
