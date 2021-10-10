export function ordinalNumber(num: number): string {
	let suff = 'th';
	if (num % 100 < 10 || num % 100 > 20) {
		if (num % 10 == 1) {
			suff = 'st';
		} else if (num % 10 == 2) {
			suff = 'nd';
		} else if (num % 10 == 3) {
			suff = 'rd';
		}
	}
	return `${num}${suff}`;
}
