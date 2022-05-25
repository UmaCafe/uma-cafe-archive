// maybe add to database
const PERMISSION_GROUPS: { [k: string]: PermissionGroup } = {
	admin: {
		name: 'Admin',
		permissions: ['*']
	},
	editor: {
		name: 'Editor',
		permissions: ['editor.*', 'files.*']
	},
	translator: {
		name: 'Translator',
		permissions: ['editor.edit.*']
	}
};

export type EditorObject = {
	name: string;
	uid: string;
	groups: string[];
};

export type PermissionGroup = {
	name: string;
	permissions: string[];
};

export function hasPermission(editor: EditorObject | undefined, permission: string): boolean {
	if (!editor) return false;
	for (const groupId of editor.groups ?? []) {
		if (hasPermissionInGroup(groupId, permission)) return true;
	}
	return false;
}

export function hasPermissionInGroup(groupId: string, permission: string): boolean {
	const group = PERMISSION_GROUPS[groupId];
	if (!group) return false;
	for (const perm of group.permissions) {
		if (doesPermissionMatch(perm, permission)) return true;
	}
	return false;
}

export function getGroupName(groupId: string): string {
	return PERMISSION_GROUPS[groupId]?.name;
}

function doesPermissionMatch(toCheck: string, permission: string): boolean {
	const checkSegments = toCheck?.split('.');
	const permSegments = permission.split('.');
	for (let i = 0; i < Math.max(checkSegments.length, permSegments.length); i++) {
		if (checkSegments[i].toLowerCase() != permSegments[i].toLowerCase()) {
			if (checkSegments[i] == '*') return true;
			return false;
		}
	}
	return true;
}
