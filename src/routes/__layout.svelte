<script type="ts">
	import { session } from '$app/stores';
	import ParticleComponent from '$lib/components/particle_component.svelte';
	import type { EditorObject } from '$lib/types/editors';

	let editor: EditorObject = $session.editor;
</script>

<nav>
	<header class="container">
		<div class="brand"><a href="/">Uma Cafe</a></div>
		<div class="links">
			<div class="link">
				<a href="/characters">Characters</a>
			</div>
		</div>
	</header>
</nav>

<div class="container content-box">
	<div class="content">
		<slot />
	</div>
	<footer>
		<hr />
		<div class="footer-content">
			<div class="left">
				<a href="mailto:snep@uma.cafe">Contact</a>
			</div>
			<div class="right">
				{#if editor}
					<span>Editor: {editor.name}</span>
					<a href="/editor/protected/home">Editor Home</a>
					<a href="/api/auth/logout" rel="external">Logout</a>
				{:else}
					<a href="/editor/login">Editor Login</a>
				{/if}
			</div>
		</div>
	</footer>
</div>

<div class="background">
	<ParticleComponent />
</div>

<style>
	.container {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0;
		box-sizing: border-box;
	}

	@media (min-width: 600px) {
		.container {
			max-width: 600px;
		}
	}

	@media (min-width: 800px) {
		.container {
			max-width: 800px;
		}
	}

	@media (min-width: 1000px) {
		.container {
			max-width: 1000px;
		}
	}

	.content-box {
		position: relative;
		background-color: #f5f5ff;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		box-shadow: 10px 10px 20px #ccd, -10px 10px 20px #ccd;
		color: #222;
		width: 100%;
		padding: 0 1rem;
		flex-grow: 1;
	}

	@media (max-width: 768px) {
		.content-box {
			padding: 0 0.5rem;
		}
	}

	.content {
		display: inline-block;
		width: 100%;
		padding-bottom: 4rem;
	}

	nav .container {
		display: flex;
		flex-direction: row;
		margin-top: 2rem;
		margin-bottom: 1rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}

	footer {
		position: absolute;
		bottom: 10px;
		left: 0;
		width: 100%;
		height: 3rem;
	}

	footer hr {
		width: 95%;
	}

	.footer-content {
		display: flex;
		flex-direction: row;
	}

	.footer-content .left {
		margin-left: 2rem;
	}

	.footer-content .right {
		align-self: flex-end;
		margin-left: auto;
		margin-right: 2rem;
	}

	.brand a {
		font-size: 2rem;
		font-weight: 700;
		text-decoration: none;
		color: #575;
	}

	.links {
		display: flex;
		margin-left: auto;
	}

	.links .link {
		margin: 0.5rem;
		align-self: flex-end;
	}

	.link a {
		color: #494;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.2rem;
	}

	.link a:hover {
		text-decoration: underline;
	}

	:global(#root) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	:global(body) {
		font-family: Roboto, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
			sans-serif;
		font-weight: 400;
		line-height: 1.5;
		font-size: 1rem;
		padding: 0;
		margin: 0;
		height: 100vh;
	}

	:global(code),
	:global(pre) {
		font-family: 'Courier New', Courier, monospace;
	}

	.background {
		position: fixed;
		display: block;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-image: url(/background/bg_main.jpg);
		background-position: 50% 0;
		background-repeat: repeat;
		padding: 0;
		margin: 0;
	}

	:global(body.dark) .background {
		background-image: url(/background/bg_dark.jpg);
	}
</style>
