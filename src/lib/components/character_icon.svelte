<script lang="ts">
	import type { BaseObject } from '$lib/data/base/objects';
	import type { Character } from '$lib/data/character';
	import { getContentUrl } from '$lib/util';
	import { onMount } from 'svelte';

	export let character: BaseObject<Character>;

	let nameBox: HTMLSpanElement;
	let nameSize = 16;
	let overflow = true;
	onMount(() => {
		overflow = false; // overflow only on if JS is disabled
	});
	$: while (nameSize > 8 && nameBox?.scrollWidth > 136) {
		nameSize = nameSize - 1;
		nameBox.style.fontSize = nameSize + 'px';
		overflow = false;
	}
</script>

<div
	class="icon-box"
	style="--color-main: #{character.colors?.main ?? 'ddf'}; --color-sub: #{character.colors?.sub ??
		'ccd'};"
>
	<div class="img-box">
		<img src={getContentUrl(character.imageIcon)} alt="" width="140" height="140" />
	</div>
	<div class="capt-box">
		<div bind:this={nameBox} class:overflow>{character.name?.en}</div>
	</div>
</div>

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
		width: 136px;
		height: 24px;
		border-top: 3px solid var(--color-main);
		padding: 4px 2px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.capt-box div {
		font-weight: bold;
		color: #334;
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
	}

	.capt-box div.overflow {
		text-overflow: ellipsis;
	}
</style>
