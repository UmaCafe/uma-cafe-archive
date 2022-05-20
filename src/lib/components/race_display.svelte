<script lang="ts">
	import { getRaceInfo } from '$lib/client/races';
	import type { RaceObject } from '$lib/types/race';

	export let raceId: string | undefined = undefined;
	export let raceInfo: RaceObject | undefined = undefined;
	if (raceId) {
		getRaceInfo(fetch, raceId).then((val) => (raceInfo = val));
	}

	function trackString() {
		const trackInfo = raceInfo?.info.trackInfo;
		if (trackInfo) {
			const trackType = {
				turf: 'Turf',
				dirt: 'Dirt'
			}[trackInfo.trackType];
			const direction = {
				cw: 'CW',
				ccw: 'CCW'
			}[trackInfo.direction];
			return `${trackInfo.trackName} - ${trackInfo.distance}m (${trackType}, ${direction})`;
		}
	}
</script>

{#if raceInfo}
	<div class="race">
		<img class="logo" src={raceInfo.images.thumb} alt="" />
		<div class="info">
			<h2>{raceInfo.info.name.translated}</h2>
			{#if raceInfo.info.trackInfo}
				<h3>{trackString()}</h3>
			{/if}
			{#if raceInfo.info.raceInfo}
				<h3>{raceInfo.info.raceInfo.raceTimeDescription}</h3>
			{/if}
		</div>
	</div>
{/if}

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
