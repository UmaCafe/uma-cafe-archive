<script lang="ts">
	import { getCharacterInfo } from '$lib/client/characters';
	import type { CharacterObject } from '$lib/types/character';
	import { getContentUrl } from '$lib/util';

	export let charId: string | undefined = undefined;
	export let charInfo: CharacterObject | undefined = undefined;
	if (charId) {
		getCharacterInfo(fetch, charId).then((val) => (charInfo = val));
	}

	let nameBox: HTMLSpanElement;
	let nameSize = 16;
	$: while (nameSize > 1 && nameBox?.offsetHeight > 24) {
		nameSize = nameSize - 1;
		nameBox.style.fontSize = nameSize + 'px';
	}
</script>

{#if charInfo}
	<div
		class="icon-box"
		style="--color-main: #{charInfo.info.colors?.main ?? 'ddf'}; --color-sub: #{charInfo.info.colors
			?.sub ?? 'ccd'};"
	>
		<div class="img-box">
			<img src={getContentUrl(charInfo.images.icon)} alt="" width="140" height="140" />
		</div>
		<div class="capt-box">
			<span bind:this={nameBox}>{charInfo.info.name.translated}</span>
		</div>
	</div>
{/if}

<style>
	.icon-box {
		width: 140px;
		border: 4px solid var(--color-main);
		border-radius: 15px;
		background-color: #fff;
	}

	.img-box img {
		display: block;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}

	.img-box {
		position: relative;
		text-align: center;
		overflow: hidden;
		padding-bottom: 5px;
	}

	.img-box:before {
		content: '';
		width: 100%;
		height: 10px;
		position: absolute;
		bottom: 0;
		left: 0;
		background: var(--color-main);
		transform: skewY(-5deg) translateY(6px);
		z-index: 20;
	}

	.img-box:after {
		content: '';
		width: 100%;
		height: 20px;
		position: absolute;
		bottom: 0;
		left: 0;
		background: var(--color-sub);
		transform: skewY(6deg) translateY(12px);
		z-index: 10;
	}

	.capt-box {
		border-top: 3px solid var(--color-main);
		padding: 5px;
		text-align: center;
	}

	.capt-box span {
		font-weight: bold;
		color: #334;
		width: 100%;
		word-break: break-all;
	}
</style>
