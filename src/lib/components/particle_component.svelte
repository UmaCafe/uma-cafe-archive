<script lang="ts">
	import { onMount } from 'svelte';
	import './particle_component.css';

	let ParticlesComponent: unknown;
	onMount(async () => {
		const mod = await import('svelte-particles');
		ParticlesComponent = mod.default;
	});
</script>

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
						src: '/background/bg_icon_01.png',
						width: 138,
						height: 139
					},
					{
						src: '/background/bg_icon_02.png',
						width: 132,
						height: 124
					},
					{
						src: '/background/bg_icon_03.png',
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
