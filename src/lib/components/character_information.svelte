<script type="ts">
	import { getImageMap } from '$lib/content';
	import type { CharacterInfo, ImageTag } from '$lib/types/character';
	import Selector from './selector.svelte';

	export let charInfo: CharacterInfo;

	const info = charInfo.info;
	const images = getImageMap(charInfo);

	const months = {
		1: 'Jan',
		2: 'Feb',
		3: 'Mar',
		4: 'Apr',
		5: 'May',
		6: 'Jun',
		7: 'Jul',
		8: 'Aug',
		9: 'Sep',
		10: 'Oct',
		11: 'Nov',
		12: 'Dec'
	};

	$: imageValues = [
		{ label: 'Uniform', value: 'seifuku' },
		{ label: 'Racing Outfit (3D)', value: 'shoubufuku' },
		{ label: 'Original Design', value: 'proto' }
	].filter((v) => images.has(v.value as ImageTag));
	let imageDisplay: ImageTag;
</script>

<div class="info-panel" style="--color-main: #{info.colors.main}; --color-sub: #{info.colors.sub};">
	<div class="title">
		<h1>{info.name.translated}</h1>
		<h2>{info.name.native}</h2>
	</div>
	<div class="main" style="border-color: #{info.colors.main};">
		<div class="image">
			<div style="text-align: center;">
				<Selector items={imageValues} bind:value={imageDisplay} />
			</div>
			<img src={images.get(imageDisplay)} alt={info.name.translated} />
		</div>
		<div class="desc">
			<div>
				{#if info.birthday}
					<p>
						<strong>Birthday:</strong>
						{months[info.birthday.month]}
						{info.birthday.day}{info.birthday.year ? `, ${info.birthday.year}` : undefined}
					</p>
				{/if}
				{#if info.sizes?.height}
					<p><strong>Height:</strong> {info.sizes.height}cm</p>
				{/if}
				{#if info.sizes?.bust && info.sizes?.waist && info.sizes?.hips}
					<p><strong>Sizes:</strong> B{info.sizes.bust} W{info.sizes.waist} H{info.sizes.hips}</p>
				{/if}
			</div>
			{#if info.seiyuu}
				<hr />
				<div>
					<p><strong>Seiyuu: </strong> {info.seiyuu.romanizedName} ({info.seiyuu.nativeName})</p>
					<p class="links">
						{#if info.seiyuu.wikipediaUrlJP}
							<a href={info.seiyuu.wikipediaUrlJP} target="_blank">Wiki (JP)</a>
						{/if}
						{#if info.seiyuu.wikipediaUrlEN}
							<a href={info.seiyuu.wikipediaUrlEN} target="_blank">Wiki (EN)</a>
						{/if}
						{#if info.seiyuu.anilistUrl}
							<a href={info.seiyuu.anilistUrl} target="_blank">Anilist</a>
						{/if}
						{#if info.seiyuu.malUrl}
							<a href={info.seiyuu.malUrl} target="_blank">MAL</a>
						{/if}
					</p>
				</div>
			{/if}
			{#if info.counterpart}
				<hr />
				<div>
					<h3>Real-life counterpart</h3>
					<p>
						<strong>Sex:</strong>
						{info.counterpart.sex == 'male'
							? 'Male'
							: info.counterpart == 'female'
							? 'Female'
							: info.counterpart == 'intersex'
							? 'Intersex'
							: undefined}
					</p>
					<p class="links">
						{#if info.counterpart.wikipediaUrlJP}
							<a href={info.counterpart.wikipediaUrlJP} target="_blank">Wiki (JP)</a>
						{/if}
						{#if info.counterpart.wikipediaUrlEN}
							<a href={info.counterpart.wikipediaUrlEN} target="_blank">Wiki (EN)</a>
						{/if}
						{#if info.counterpart.netkeibaUrl}
							<a href={info.counterpart.netkeibaUrl} target="_blank">Netkeiba</a>
						{/if}
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.info-panel {
		margin: 10px;
		border: 15px solid var(--color-main);
		border-radius: 10px;
	}

	.title {
		position: relative;
		text-align: center;
		overflow: hidden;
		padding-bottom: 20px;
	}

	.title:before {
		content: '';
		width: 100%;
		height: 30px;
		position: absolute;
		bottom: 0;
		left: 0;
		background: var(--color-main);
		transform: skewY(-1deg) translateY(17px);
		z-index: 20;
	}

	.title:after {
		content: '';
		width: 100%;
		height: 30px;
		position: absolute;
		bottom: 0;
		left: 0;
		background: var(--color-sub);
		transform: skewY(1deg) translateY(10px);
		z-index: 10;
	}

	.main {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		border-top: 10px solid;
	}

	.image {
		flex-grow: 1;
		border-radius: 10px;
	}

	@media (min-width: 768px) {
		.image {
			flex-basis: 0;
		}
	}

	.image img {
		max-width: 100%;
		height: auto;
	}

	.desc {
		flex-basis: 0;
		flex-grow: 1;
		padding: 20px;
		margin-top: auto;
		margin-bottom: auto;
	}

	.links a {
		padding-right: 10px;
	}
</style>
