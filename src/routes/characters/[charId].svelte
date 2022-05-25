<script lang="ts">
	import { session } from '$app/stores';
	import InfoPanel from '$lib/components/info_panel.svelte';
	import Metadata from '$lib/components/metadata.svelte';
	import TabBox from '$lib/components/tab_box.svelte';
	import TabPanel from '$lib/components/tab_panel.svelte';
	import { fromJson } from '$lib/data/base/objects';
	import type { Character } from '$lib/data/character';
	import { hasPermission } from '$lib/permissions';
	import { getContentUrl, isPreview, MONTHS, ordinalNumber, type KVPair } from '$lib/util';

	export let characterJson: string;

	let character = fromJson<Character>(characterJson);
	$: character = fromJson<Character>(characterJson);

	let description = `Information about ${character.name?.en} from Uma Musume`;
	if (character.about) {
		description = character.about;
	}

	$: secretsFiltered = character.secrets?.filter((v) => !!v.en);

	let allImageTabs: KVPair[] = [
		{ val: 'Uniform', key: 'seifuku' },
		{ val: 'Racing Outfit (Game)', key: 'shoubufuku' },
		{ val: 'Racing Outfit (Original)', key: 'proto' },
		{ val: 'Starting Future', key: 'stage' }
	];
	let imageMap: { [k: string]: string | undefined };
	$: imageMap = {
		seifuku: character.imageSeifuku,
		shoubufuku: character.imageShoubufuku,
		proto: character.imageProto,
		stage: character.imageStage
	};
	let imageTabs: KVPair[] = [];
	$: imageTabs = allImageTabs.filter((v) => {
		if (v.key == 'seifuku') return !!character.imageSeifuku;
		if (v.key == 'shoubufuku') return !!character.imageShoubufuku;
		if (v.key == 'proto') return !!character.imageProto;
		if (v.key == 'stage') return !!character.imageStage;
	});

	let descTabs: KVPair[] = [
		{ val: 'Character Bio', key: 'bio' },
		{ val: 'Voice', key: 'voice' },
		{ val: 'Real-life Counterpart', key: 'counterpart' }
	];
	$: descTabs = descTabs.filter((v) => {
		if (v.key == 'bio') return true;
		if (v.key == 'voice') return character.seiyuuName?.en;
		if (v.key == 'counterpart') return character.counterpartSex;
	});
</script>

<Metadata title={character.name?.en} {description} image={getContentUrl(character.imageIcon)} />

<InfoPanel
	mainColor={'#' + character.colors?.main}
	subColor={'#' + character.colors?.sub}
	topBackgroundColor="#f5f5ff"
	bottomBackgroundColor="#e9e9f9"
>
	<div class="title-container" slot="title">
		<div class="title-box">
			<h1><ruby>{character.name?.en}<rt>{character.name?.jp}</rt></ruby></h1>
			{#if character.nickname?.en}<h3>"{character.nickname.en}"</h3>{/if}
		</div>
	</div>
	<div class="intro-box">
		{#if character.introduction?.en}
			<p class="intro"><em>"{character.introduction.en}"</em></p>
		{/if}
	</div>
	<div class="image">
		<TabBox tabs={imageTabs} outlineColor={'#' + character.colors?.sub} let:key>
			{#each imageTabs as val}
				<div class="image-container" hidden={key != val.key}>
					<img src={getContentUrl(imageMap[val.key])} alt={character.name?.en} />
				</div>
			{/each}
		</TabBox>
	</div>
	<div class="desc">
		<TabBox tabs={descTabs} outlineColor={'#' + character.colors?.sub} let:key>
			<div hidden={key != 'bio'}>
				{#if character.tagline?.en}
					<p class="tagline">{character.tagline.en}</p>
					<hr class="about-hr" />
				{/if}
				{#if character.about}
					<p class="about">{character.about}</p>
					<hr class="about-hr" />
				{/if}
				<TabPanel
					tabs={[
						{ val: 'Profile', key: 'profile' },
						{ val: "Trainers' Notes", key: 'notes' }
					]}
					panelColor={'#' + character.colors?.sub}
					let:key={bioVal}
				>
					{#if bioVal == 'profile'}
						{#if character.birthday}
							<p>
								<strong>Birthday:</strong>
								{MONTHS.get(character.birthday.month) ?? ''}
								{character.birthday.day}{character.birthday.year
									? `, ${character.birthday.year}`
									: ``}
							</p>
						{/if}
						{#if character.class?.en}
							<p><strong>Class:</strong> {character.class.en}</p>
						{/if}
						{#if character.dorm?.en}
							<p><strong>Dorm:</strong> {character.dorm.en}</p>
						{/if}
						{#if character.roommate}
							<p>
								<strong>Roommate:</strong>
								{#if character.roommate.visible}
									<a href="/characters/{character.roommate.id}">{character.roommate.name?.en}</a
									>{:else}{character.roommate.name?.en}{/if}
							</p>
						{/if}
						{#if character.strengths?.en}
							<p><strong>Strengths:</strong> {character.strengths.en}</p>
						{/if}
						{#if character.weaknesses?.en}
							<p><strong>Weaknesses:</strong> {character.weaknesses.en}</p>
						{/if}
						{#if character.commentEars?.en}
							<p><strong>Ears:</strong> {character.commentEars.en}</p>
						{/if}
						{#if character.commentTail?.en}
							<p><strong>Tail:</strong> {character.commentTail.en}</p>
						{/if}
						{#if character.commentFamily?.en}
							<p><strong>Family:</strong> {character.commentFamily.en}</p>
						{/if}
						{#if secretsFiltered && secretsFiltered.length > 0}
							<p><strong>Secrets:</strong></p>
							<ul>
								{#each secretsFiltered as secret}
									<li>{secret.en}</li>
								{/each}
							</ul>
						{/if}
						{#if character.trivia && character.trivia.length > 0}
							<p><strong>Trivia:</strong></p>
							<ul>
								{#each character.trivia as trivia}
									<li>{trivia}</li>
								{/each}
							</ul>
						{/if}
					{:else if bioVal == 'notes'}
						{#if character.height}
							<p><strong>Height:</strong> {character.height}cm</p>
						{/if}
						{#if character.threeSizes}
							<p>
								<strong>Three Sizes:</strong> B{character.threeSizes.bust} W{character.threeSizes
									.waist} H{character.threeSizes.hips}
							</p>
						{/if}
						{#if character.shoeSize}
							<p>
								<strong>Shoe Size:</strong>
								{#if character.shoeSize.left != character.shoeSize.right}L{character.shoeSize
										.left}cm, R{character.shoeSize.right}cm{:else}{character.shoeSize.left}cm{/if}
							</p>
						{/if}
						{#if character.weight?.en}
							<p><strong>Weight:</strong> {character.weight.en}</p>
						{/if}
						{#if character.preferredGround?.en}
							<p><strong>Preferred Ground:</strong> {character.preferredGround.en}</p>
						{/if}
						{#if character.preferredDistance?.en}
							<p><strong>Preferred Distance:</strong> {character.preferredDistance.en}</p>
						{/if}
						{#if character.preferredStrategy?.en}
							<p><strong>Preferred Strategy:</strong> {character.preferredStrategy.en}</p>
						{/if}
						{#if character.refersSelf?.en}
							<p>
								<strong>Calls self:</strong>
								{character.refersSelf.en}
								{#if character.refersSelf.jp}({character.refersSelf.jp}){/if}
							</p>
						{/if}
						{#if character.refersTrainer?.en}
							<p>
								<strong>Calls Trainer:</strong>
								{character.refersTrainer.en}
								{#if character.refersTrainer.jp}({character.refersTrainer.jp}){/if}
							</p>
						{/if}
					{/if}
				</TabPanel>
			</div>
			<div hidden={key != 'voice'}>
				{#if character.voiceSample}
					<div class="voice-box">
						<audio controls src={getContentUrl(character.voiceSample)}>
							<track kind="captions" />
						</audio>
					</div>
				{/if}
				<p class="center">
					<strong>Voiced by: </strong>
					{character.seiyuuName?.en}
					{#if character.seiyuuName?.en != character.seiyuuName?.jp}({character.seiyuuName
							?.jp}){/if}
				</p>
				{#if character.imageSeiyuu}
					<div class="img-seiyuu center img-box">
						<img src={getContentUrl(character.imageSeiyuu)} alt={character.seiyuuName?.en} />
					</div>
				{/if}
				<p class="links">
					{#if character.seiyuuWikiJP}
						<a href={character.seiyuuWikiJP}>Wiki (JP)</a>
					{/if}
					{#if character.seiyuuWikiEN}
						<a href={character.seiyuuWikiEN}>Wiki (EN)</a>
					{/if}
					{#if character.seiyuuAnilist}
						<a href={character.seiyuuAnilist}>Anilist</a>
					{/if}
					{#if character.seiyuuMal}
						<a href={character.seiyuuMal}>MAL</a>
					{/if}
					{#if character.seiyuuSocials && character.seiyuuSocials.length > 0}
						{#each character.seiyuuSocials as social}
							<a href={social.url}>{social.name}</a>
						{/each}
					{/if}
				</p>
				{#if character.seiyuuRoles && character.seiyuuRoles.length > 0}
					<p><strong>Other Roles:</strong></p>
					<ul>
						{#each character.seiyuuRoles as role}
							<li>{role.charName} ({role.mediaName})</li>
						{/each}
					</ul>
				{/if}
			</div>
			<div hidden={key != 'counterpart'}>
				{#if character.imageCounterpart}
					<div class="center img-box">
						<img src={getContentUrl(character.imageCounterpart)} alt={character.name?.en} />
					</div>
				{/if}
				{#if character.counterpartSex}
					<p>
						<strong>Sex:</strong>
						{character.counterpartSex}
					</p>
				{/if}
				{#if character.counterpartNumRaces && character.counterpartNumWins}
					<p>
						<strong>Record:</strong>
						{character.counterpartNumRaces} Races, {character.counterpartNumWins} Wins
					</p>
				{/if}
				{#if character.counterpartNotableRaces && character.counterpartNotableRaces.length > 0}
					<p><strong>Notable Races:</strong></p>
					<ul>
						{#each character.counterpartNotableRaces as race}
							<li>{ordinalNumber(race.placed)} - {race.name} ({race.year})</li>
						{/each}
					</ul>
				{/if}
				<p class="links">
					{#if character.counterpartWikiJP}
						<a href={character.counterpartWikiJP}>Wiki (JP)</a>
					{/if}
					{#if character.counterpartWikiEN}
						<a href={character.counterpartWikiEN}>Wiki (EN)</a>
					{/if}
					{#if character.counterpartNetkeiba}
						<a href={character.counterpartNetkeiba}>Netkeiba</a>
					{/if}
				</p>
			</div>
		</TabBox>
	</div>
</InfoPanel>
{#if $session.editor && hasPermission($session.editor, 'editor.edit.characters') && !isPreview()}
	<div style="text-align:right;">
		<a href="/editor/characters/{character.id}">Edit this page</a>
	</div>
{/if}

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

	.image-container {
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 176%; /* h/w: 1320/750 */
	}

	.image-container img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title-box {
		padding: 10px 15px;
		border-radius: 20px;
		text-align: center;
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
		box-shadow: 0px 0px 0px 5px #f5f5ff;
		border-radius: 20px;
	}

	.tagline {
		font-style: italic;
		text-align: center;
		margin-bottom: 20px;
	}

	.about-hr {
		margin: 10px 0px;
	}

	.img-box img {
		border-radius: 8px;
		max-width: 100%;
	}

	.img-seiyuu img {
		max-height: 200px;
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
		text-align: center;
	}

	.links a {
		padding-right: 10px;
	}

	.center {
		text-align: center;
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
