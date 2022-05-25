<script lang="ts">
	import { goto } from '$app/navigation';
	import Metadata from '$lib/components/metadata.svelte';
	import type { EditPutRequest } from 'src/routes/api/edit';

	export let type: string;

	function create() {
		const body: EditPutRequest = {
			type,
			id: charId,
			data: {
				name: {
					jp: nameNative,
					en: nameTranslated
				},
				assetId: folderName
			}
		};
		fetch(`/api/edit`, {
			method: 'PUT',
			body: JSON.stringify(body)
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = `/editor/characters/${charId}`;
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
			<div><strong>Character ID cannot be changed after creation.</strong></div>
			<div>
				Try to keep to dash-separated english names, all lowercase. (eg rice-shower, haru-urara,
				mayano-top-gun)
			</div>
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
			<div>
				Folder name should be the same as the ID on the official website (eg
				umamusume.jp/character/detail/?name=riceshower => 'riceshower' would be the folder name)
			</div>
		</div>
		<input type="submit" value="Create" />
		{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}
	</form>
</div>
