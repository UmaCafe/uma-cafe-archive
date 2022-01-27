<script lang="ts" context="module">
	import Metadata from '$lib/components/metadata.svelte';
	import RaceDisplay from '$lib/components/race_display.svelte';
	import { getAllRaces } from '$lib/content';
	import type { RaceObject } from '$lib/types/race';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async () => {
		const races = await getAllRaces();
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
		{#each [...races] as [raceId, raceInfo]}
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
