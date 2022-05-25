import { Collection, DatabaseObject, String } from './base/objects';

@Collection('pages')
export class Page extends DatabaseObject {
	@String()
	md?: string;
}
