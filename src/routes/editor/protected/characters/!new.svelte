<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
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
			}
		};

		fetch(`/api/edit`, {
			method: 'PUT',
			body: JSON.stringify({
				editorKey: $session.editor.key,
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
