<script lang="ts">
	export let mainColor: string = undefined;
	export let subColor: string = undefined;
</script>

<div
	class="info-panel"
	style="--color-main: #{mainColor ?? 'ddf'}; --color-sub: #{subColor ?? 'ccd'};"
>
	<div class="title">
		<slot name="title" />
	</div>
	<div class="main">
		<slot />
	</div>
</div>

<style>
	.info-panel {
		margin: 10px 0px;
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
		border-top: var(--color-main) 10px solid;
	}
</style>
