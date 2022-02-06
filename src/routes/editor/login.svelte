<script lang="ts">
	import Metadata from '$lib/components/metadata.svelte';

	function submit() {
		fetch('/api/auth', {
			method: 'post',
			body: JSON.stringify({ password })
		}).then((resp) => {
			if (resp.status == 200) {
				window.location.href = '/editor/protected/home';
			} else {
				console.error(resp.body);
				failed = true;
			}
		});
	}
	let password: string;
	let failed = false;
</script>

<Metadata title="Editor Login" description="Login for editors" />

<h1>Login</h1>
<form on:submit|preventDefault={submit}>
	<div>
		<label for="password">Editor Key:</label>
		<input id="password" type="password" bind:value={password} />
	</div>
	<input type="submit" value="Login" />
</form>
{#if failed}
	<span style="color: red;">Login failed.</span>
{/if}
