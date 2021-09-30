<script type="ts">
	import navbar from '../../content/navbar.json';
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

<style>
	.container {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0;
		max-width: 1000px;
	}

	.content-box {
		background-color: #eee;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		color: #222;
		width: 100%;
		padding-left: 1rem;
		padding-right: 1rem;
		flex-grow: 1;
	}

	.content {
		display: block;
		width: 100%;
	}

	nav .container {
		display: flex;
		margin-top: 2rem;
	}

	.brand a {
		font-size: 2rem;
		font-weight: 700;
		text-decoration: none;
		color: #ddd;
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
		color: #cdc;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.2rem;
	}

	:global(#root) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	:global(body) {
		background-color: #333;
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
</style>
