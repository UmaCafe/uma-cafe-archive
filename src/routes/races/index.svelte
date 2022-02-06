<script lang="ts" context="module">
	import { getAllRaces } from '$lib/client/races';
	import Metadata from '$lib/components/metadata.svelte';
	import RaceDisplay from '$lib/components/race_display.svelte';
	import type { RaceObject } from '$lib/types/race';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const races = await getAllRaces(fetch);
		return {
			props: {
				races
			}
		};
	};
</script>

<script lang="ts">
	export let races: Map<string, RaceObject>;
</script>

<Metadata title="Race List" description="List of JRA Races that are used in the Uma Musume game." />

<div class="race-container">
	<h1>Races</h1>
	<div class="race-list">
		{#each [...races] as [_raceId, raceInfo]}
			<div class="race">
				<RaceDisplay {raceInfo} />
			</div>
		{/each}
	</div>
</div>

<style>
	.race-container {
		padding: 10px 30px;
	}

	.race {
		text-align: center;
	}
</style>
