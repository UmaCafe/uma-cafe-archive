<script type="ts">
	import { onMount } from 'svelte';

	import navbar from '../../content/navbar.json';

	let ParticlesComponent;
	onMount(async () => {
		const mod = await import('svelte-particles');
		ParticlesComponent = mod.default;
	});
</script>

<nav>
	<div class="container">
		<div class="brand"><a href="/">Uma Cafe</a></div>
		<div class="links">
			{#each navbar.links as link}
				<div class="link">
					<a href={link.href}>{link.title}</a>
				</div>
			{/each}
		</div>
	</div>
</nav>

<div class="container content-box">
	<div class="content">
		<slot />
	</div>
</div>

<div class="background">
	<svelte:component
		this={ParticlesComponent}
		id="tsparticles"
		options={{
			fpsLimit: 60,
			interactivity: {
				detectsOn: 'canvas'
			},
			particles: {
				move: {
					enable: !0,
					direction: 'top-right',
					outMode: 'out',
					speed: 1,
					straight: !1
				},
				number: {
					density: {
						enable: !0,
						value_area: 800
					},
					value: 10
				},
				opacity: {
					value: 0.5
				},
				shape: {
					type: 'image',
					image: [
						{
							src: '/images/background/bg_icon_01.png',
							width: 138,
							height: 139
						},
						{
							src: '/images/background/bg_icon_02.png',
							width: 132,
							height: 124
						},
						{
							src: '/images/background/bg_icon_03.png',
							width: 123,
							height: 127
						}
					]
				},
				rotate: {
					value: 0,
					direction: 'clockwise',
					animation: {
						speed: 10,
						random: !0,
						enable: !0
					}
				},
				size: {
					random: {
						enable: !0,
						minimumValue: 20
					},
					value: 50
				}
			},
			detectRetina: !0
		}}
	/>
</div>

<style>
	.container {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0;
		box-sizing: border-box;
	}

	@media (min-width: 576px) {
		.container {
			max-width: 500px;
		}
	}

	@media (min-width: 768px) {
		.container {
			max-width: 720px;
		}
	}

	@media (min-width: 1024px) {
		.container {
			max-width: 1000px;
		}
	}

	.content-box {
		background-color: #f2f2ff;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		color: #222;
		width: 100%;
		padding-left: 1rem;
		padding-right: 1rem;
		flex-grow: 1;
	}

	.content {
		display: inline-block;
		width: 100%;
	}

	nav .container {
		display: flex;
		margin-top: 2rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
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
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
		background-image: url(/images/background/bg_main.jpg);
		background-position: 50% 0;
		background-repeat: repeat;
		padding: 0;
		margin: 0;
	}

	:global(#tsparticles) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		z-index: -1;
	}
</style>
