<script lang="ts">
	import { FIREBASE_APP } from '$lib/client/external/firebase';
	import Metadata from '$lib/components/metadata.svelte';
	import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

	function submitLogin() {
		status = '';
		error = '';
		const auth = getAuth(FIREBASE_APP);
		signInWithEmailAndPassword(auth, email, password)
			.then((creds) => {
				return creds.user.getIdToken();
			})
			.then((idToken) => {
				return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ idToken }) });
			})
			.then((_resp) => {
				window.location.href = '/editor/protected/home';
			})
			.catch((reason) => {
				let errorCode: string = reason?.code;
				switch (errorCode) {
					case 'auth/user-not-found':
						error = 'User not found.';
						break;
					case 'auth/wrong-password':
						error = 'Incorrect password.';
						break;
					default:
						error = 'Unknown Error (' + errorCode + ')';
						break;
				}
			});
	}

	function submitResetRequest() {
		status = '';
		error = '';
		const auth = getAuth(FIREBASE_APP);
		sendPasswordResetEmail(auth, email)
			.then(() => {
				forgotPass = false;
				status = 'Password reset requested. Check your email.';
			})
			.catch((reason) => {
				let errorCode: string = reason?.code;
				switch (errorCode) {
					case 'auth/invalid-email':
						error = 'Invalid email.';
						break;
					default:
						error = 'Unknown Error (' + errorCode + ')';
						break;
				}
			});
	}

	let error = '';
	let status = '';
	let email: string;
	let password: string;

	let forgotPass = false;
</script>

<Metadata title="Editor Login" description="Login for editors" />

<h1>Login</h1>
{#if status}
	<span>{status}</span>
{/if}
{#if error}
	<span style="color: red;">Error: {error}</span>
{/if}
<div>
	{#if !forgotPass}
		<form on:submit|preventDefault={submitLogin}>
			<div>
				<label>
					Email: <input type="email" bind:value={email} />
				</label>
			</div>
			<div>
				<label
					>Password:
					<input type="password" bind:value={password} /></label
				>
			</div>
			<input type="submit" value="Login" />
		</form>
		<button on:click={() => (forgotPass = true)}>Forgot Password</button>
	{:else}
		<form on:submit|preventDefault={submitResetRequest}>
			<div>
				<label>
					Email: <input type="email" bind:value={email} />
				</label>
			</div>
			<input type="submit" value="Reset Password" />
		</form>
		<button on:click={() => (forgotPass = false)}>Back to Login</button>
	{/if}
</div>
