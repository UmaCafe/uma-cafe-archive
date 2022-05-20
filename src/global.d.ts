/// <reference types="@sveltejs/kit" />

import type { EditorObject } from './lib/types/editors';

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
