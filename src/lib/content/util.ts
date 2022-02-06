export function getContentUrl(fileName: string): string {
	if (fileName.startsWith('/')) fileName = fileName.substring(1);
	return `https://static.uma.cafe/${fileName}`;
}
