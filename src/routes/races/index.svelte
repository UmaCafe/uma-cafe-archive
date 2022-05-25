<script lang="ts">
	import Metadata from '$lib/components/metadata.svelte';
	import RaceDisplay from '$lib/components/race_display.svelte';
	import type { BaseObject } from '$lib/data/base/objects';
	import type { Race } from '$lib/data/races';
	export let races: BaseObject<Race>[] = [];
</script>

<Metadata title="Race List" description="List of JRA Races that are used in the Uma Musume game." />

<div class="race-container">
	<h1>Races</h1>
	<div class="race-list">
		{#each [...races] as raceInfo}
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
