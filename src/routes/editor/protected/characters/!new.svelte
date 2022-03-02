<script lang="ts">
	import { goto } from '$app/navigation';
	import Metadata from '$lib/components/metadata.svelte';
	import type { CharacterObject } from '$lib/types/character';

	function create() {
		const basicObject: CharacterObject = {
			images: {
				icon: `characters/${folderName}/icon.png`,
				thumb: `characters/${folderName}/thumb.png`
			},
			info: {
				name: {
					native: nameNative,
					translated: nameTranslated
				}
			},
			assetId: folderName
		};

		fetch(`/api/edit`, {
			method: 'PUT',
			body: JSON.stringify({
				collection: 'characters',
				document: charId,
				data: basicObject
			})
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = `/editor/protected/characters/${charId}`;
			} else {
				errorMsg = 'Creation failed';
			}
		});
	}

	let charId = '';
	let nameNative = '';
	let nameTranslated = '';
	let folderName = '';

	let errorMsg = '';
</script>

<Metadata title="Character Editor" description="Adding new character" />

<h1>Create Character</h1>
<button on:click={() => goto('../home')}>Back</button>
<div>
	<form on:submit|preventDefault={create}>
		<div>
			<label
				title="Try to keep to dash-separated english names, all lowercase. (eg rice-shower, haru-urara, mayano-top-gun)"
				>Character ID: <input
					type="text"
					bind:value={charId}
					placeholder="tokino-minoru"
					required
				/></label
			>
		</div>
		<div>
			<label
				>Name (native): <input
					type="text"
					bind:value={nameNative}
					placeholder="トキノミノル"
					required
				/></label
			>
		</div>
		<div>
			<label
				>Name (translated): <input
					type="text"
					bind:value={nameTranslated}
					placeholder="Tokino Minoru"
					required
				/></label
			>
		</div>
		<div>
			<label
				title={'Name of the folder to store images and other assets. Should be the same as the' +
					" ID on the official website (eg umamusume.jp/character/detail/?name=riceshower => 'riceshower' would be the folder name)"}
				>Asset folder name: <input
					type="text"
					bind:value={folderName}
					placeholder="tokinominoru"
					required
				/></label
			>
		</div>
		<input type="submit" value="Create" />
		{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}
	</form>
</div>

<style>
	[title] {
		text-decoration: underline;
		text-decoration-style: dotted;
		cursor: help;
	}
</style>
