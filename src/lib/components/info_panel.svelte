<script lang="ts">
	export let mainColor: string | undefined = undefined;
	export let subColor: string | undefined = undefined;
	export let topBackgroundColor: string | undefined = undefined;
	export let bottomBackgroundColor: string | undefined = undefined;
</script>

<div
	class="info-panel"
	style:--color-main={mainColor ?? '#ddf'}
	style:--color-sub={subColor ?? '#ccd'}
	style:--background-color-top={topBackgroundColor ?? '#f5f5ff'}
	style:--background-color-bottom={bottomBackgroundColor ?? '#f5f5ff'}
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
		overflow: hidden;
		padding-bottom: 20px;
		background-color: var(--background-color-top);
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
		background-color: var(--background-color-bottom);
	}
</style>
