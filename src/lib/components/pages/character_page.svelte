<script lang="ts">
	import { getContentUrl } from '$lib/util';
	import type { CharacterObject } from '$lib/types/character';
	import { MONTHS, ordinalNumber } from '$lib/util';
	import InfoPanel from '../info_panel.svelte';
	import TabBox from '../tab_box.svelte';

	export let charObj: CharacterObject;
	let info = charObj.info;

	let imageTabs = [
		{ label: 'Uniform', value: 'seifuku' },
		{ label: 'Racing Outfit (Game)', value: 'shoubufuku' },
		{ label: 'Racing Outfit (Original)', value: 'proto' },
		{ label: 'Starting Future', value: 'stage' }
	];
	$: imageTabs = imageTabs.filter((v) => {
		if (v.value == 'seifuku') return charObj.images.seifuku;
		if (v.value == 'shoubufuku') return charObj.images.shoubufuku;
		if (v.value == 'proto') return charObj.images.proto;
		if (v.value == 'stage') return charObj.images.stage;
	});

	let descTabs = [
		{ label: 'Character Bio', value: 'bio' },
		{ label: 'Voice', value: 'voice' },
		{ label: 'Real-life Counterpart', value: 'counterpart' }
	];
	$: descTabs = descTabs.filter((v) => {
		if (v.value == 'bio') return info.bio;
		if (v.value == 'voice') return info.voice?.nativeName && info.voice?.romanizedName;
		if (v.value == 'counterpart') return info.counterpart.sex;
	});
</script>

<InfoPanel
	mainColor={'#' + info.colors.main}
	subColor={'#' + info.colors.sub}
	topBackgroundColor="#f5f5ff"
	bottomBackgroundColor="#e9e9f9"
>
	<div slot="title">
		<div class="title-text">
			<h1><ruby>{info.name.translated}<rt>{info.name.native}</rt></ruby></h1>
			{#if info.bio?.nickname}<h3>"{info.bio.nickname}"</h3>{/if}
		</div>
	</div>
	<div class="intro-box">
		{#if info.bio?.intro}
			<p class="intro"><em>"{info.bio.intro}"</em></p>
		{/if}
	</div>
	<div class="image">
		<TabBox tabs={imageTabs} outlineColor={'#' + info.colors.sub} let:value>
			{#each imageTabs as val}
				<div hidden={value != val.value}>
					<img src={getContentUrl(charObj.images[val.value])} alt={info.name.translated} />
				</div>
			{/each}
		</TabBox>
	</div>
	<div class="desc">
		<TabBox tabs={descTabs} outlineColor={'#' + info.colors.sub} let:value>
			{#if info.bio}
				<div hidden={value != 'bio'}>
					{#if info.bio.tagline}
						<p class="tagline">{info.bio.tagline}</p>
						<hr class="about-hr" />
					{/if}
					{#if info.bio.about}
						<p class="about">{info.bio.about}</p>
						<hr class="about-hr" />
					{/if}
					{#if info.bio.birthday?.month && info.bio.birthday?.day}
						<p>
							<strong>Birthday:</strong>
							{MONTHS[info.bio.birthday.month]}
							{info.bio.birthday.day}{info.bio.birthday.year ? `, ${info.bio.birthday.year}` : ``}
						</p>
					{/if}
					{#if info.bio.sizes?.height}
						<p><strong>Height:</strong> {info.bio.sizes.height}cm</p>
					{/if}
					{#if info.bio.sizes?.bust && info.bio.sizes?.waist && info.bio.sizes?.hips}
						<p>
							<strong>Three Sizes:</strong> B{info.bio.sizes.bust} W{info.bio.sizes.waist} H{info
								.bio.sizes.hips}
						</p>
					{/if}
					{#if info.bio.sizes?.shoesL && info.bio.sizes?.shoesR}
						<p>
							<strong>Shoe Size:</strong>
							{#if info.bio.sizes?.shoesL != info.bio.sizes?.shoesR}L{info.bio.sizes.shoesL}cm, R{info
									.bio.sizes.shoesR}cm{:else}{info.bio.sizes?.shoesL}cm{/if}
						</p>
					{/if}
					{#if info.bio.weight}
						<p><strong>Weight:</strong> {info.bio.weight}</p>
					{/if}
					{#if info.bio.class}
						<p><strong>Class:</strong> {info.bio.class}</p>
					{/if}
					{#if info.bio.dorm}
						<p><strong>Dorm:</strong> {info.bio.dorm}</p>
					{/if}
					{#if info.bio.strength}
						<p><strong>Strengths:</strong> {info.bio.strength}</p>
					{/if}
					{#if info.bio.weakness}
						<p><strong>Weaknesses:</strong> {info.bio.weakness}</p>
					{/if}
					{#if info.bio.onEars}
						<p><strong>Ears:</strong> {info.bio.onEars}</p>
					{/if}
					{#if info.bio.onTail}
						<p><strong>Tail:</strong> {info.bio.onTail}</p>
					{/if}
					{#if info.bio.onFamily}
						<p><strong>Family:</strong> {info.bio.onFamily}</p>
					{/if}
					{#if info.bio.secrets?.length > 0}
						<p><strong>Secrets:</strong></p>
						<ul>
							{#each info.bio.secrets as secret}
								<li>{secret}</li>
							{/each}
						</ul>
					{/if}
					{#if info.bio.trivia?.length > 0}
						<p><strong>Trivia:</strong></p>
						<ul>
							{#each info.bio.trivia as trivia}
								<li>{trivia}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
			{#if info.voice}
				<div hidden={value != 'voice'}>
					{#if info.voice.voiceSample}
						<div class="voice-box">
							<audio controls src={getContentUrl(info.voice.voiceSample)}>
								<track kind="captions" />
							</audio>
						</div>
					{/if}
					<p>
						<strong>Voiced by: </strong>
						{info.voice.romanizedName}
						{#if info.voice.nativeName != info.voice.romanizedName}({info.voice.nativeName}){/if}
					</p>
					<p class="links">
						{#if info.voice.wikipediaUrlJP}
							<a href={info.voice.wikipediaUrlJP}>Wiki (JP)</a>
						{/if}
						{#if info.voice.wikipediaUrlEN}
							<a href={info.voice.wikipediaUrlEN}>Wiki (EN)</a>
						{/if}
						{#if info.voice.anilistUrl}
							<a href={info.voice.anilistUrl}>Anilist</a>
						{/if}
						{#if info.voice.malUrl}
							<a href={info.voice.malUrl}>MAL</a>
						{/if}
					</p>
				</div>
			{/if}
			{#if info.counterpart}
				<div hidden={value != 'counterpart'}>
					{#if charObj.images.counterpart}
						<div class="img-box">
							<img src={getContentUrl(charObj.images.counterpart)} alt={info.name.translated} />
						</div>
					{/if}
					{#if info.counterpart.sex}
						<p>
							<strong>Sex:</strong>
							{info.counterpart.sex == 'male'
								? 'Stallion'
								: info.counterpart.sex == 'female'
								? 'Mare'
								: undefined}
						</p>
					{/if}
					{#if info.counterpart.record?.total || info.counterpart.record?.wins}
						<p>
							<strong>Record:</strong>
							{info.counterpart.record.total} Races, {info.counterpart.record.wins} Wins
						</p>
					{/if}
					{#if info.counterpart.notableRaces?.length > 0}
						<p><strong>Notable Races:</strong></p>
						<ul>
							{#each info.counterpart.notableRaces as race}
								<li>{ordinalNumber(race.place)} - {race.name} ({race.year})</li>
							{/each}
						</ul>
					{/if}
					<p class="links">
						{#if info.counterpart.wikipediaUrlJP}
							<a href={info.counterpart.wikipediaUrlJP}>Wiki (JP)</a>
						{/if}
						{#if info.counterpart.wikipediaUrlEN}
							<a href={info.counterpart.wikipediaUrlEN}>Wiki (EN)</a>
						{/if}
						{#if info.counterpart.netkeibaUrl}
							<a href={info.counterpart.netkeibaUrl}>Netkeiba</a>
						{/if}
					</p>
				</div>
			{/if}
		</TabBox>
	</div>
</InfoPanel>

<style>
	.image {
		padding: 20px;
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

	.title-text {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title-text h1,
	.title-text h3 {
		/* background-color: #f5f5ff; */
		padding: 10px 15px;
		border-radius: 20px;
	}

	.desc {
		flex-basis: 0;
		flex-grow: 1;
		padding: 20px;
		margin-bottom: 0;
	}

	.intro-box {
		width: 100%;
		margin: 0px 15px;
	}

	.intro {
		max-width: 500px;
		margin: 0 auto;
		font-size: large;
		background-color: #f5f5ff;
		margin: 20px auto;
		padding: 10px 15px;
		border: 2px solid var(--color-sub);
		outline: 5px solid #f5f5ff;
		border-radius: 20px;
	}

	.tagline {
		font-style: italic;
		text-align: center;
		margin-bottom: 20px;
	}

	.about-hr {
		margin: 25px 0px;
	}

	.img-box img {
		border-radius: 8px;
		max-width: 100%;
	}

	.voice-box {
		padding: 20px 0px;
		text-align: center;
	}

	.voice-box audio {
		max-width: 100%;
		border-radius: 15px;
	}

	.links {
		margin-top: 20px;
	}

	.links a {
		padding-right: 10px;
	}

	h1,
	h3 {
		margin: 10px 0;
	}

	p {
		margin: 5px 0;
	}

	ul {
		margin: 0;
	}
</style>
