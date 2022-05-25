/// <reference types="@sveltejs/kit" />

import type { EditorObject } from '$lib/permissions';

declare global {
	namespace App {
		interface Session {
			editor?: EditorObject;
		}
		interface Locals {
			editor?: EditorObject;
		}
	}
}

export type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;
