export const convertNumberToString = (
	number: number,
	decimal: number = 2
): string => {
	if (!number || isNaN(number)) return "0";
	let calcDecimal = decimal;
	const powNumber = Math.pow(10, calcDecimal);
	let result = (Math.trunc(number * powNumber) / powNumber).toString();
	if (Number(result) === 0) {
		while (Number(result) === 0) {
			calcDecimal += 1;
			const powNumber = Math.pow(10, calcDecimal);
			result = (Math.trunc(number * powNumber) / powNumber).toString();
		}
	}
	return result;
};

export const addSuffix = (number: number, decimal: number = 2): string => {
	if (number >= 1e5) return `${convertNumberToString(number / 1e6)}M`;
	if (number >= 1e3) return `${convertNumberToString(number / 1e3)}K`;
	return convertNumberToString(number, decimal);
};

const SpecialChar = "@";

export const escapeSpecialForUrl = (string: string): string => {
	return string.replace(/&/g, SpecialChar);
};

export const addSpecialForUrl = (string: string | null): string => {
	const regExp = new RegExp(SpecialChar, "g");
	return (string || "").replace(regExp, "&");
};

export const convertStringToNumber = (string: string): number => {
	const result = Number(string);
	return isNaN(result) ? 0 : result;
};
