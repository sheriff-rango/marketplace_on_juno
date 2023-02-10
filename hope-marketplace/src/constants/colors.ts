import { TokenType } from "../types/tokens";

// export const LineColors = {
//   [TokenType.JUNO]: "#ea5545",
//   [TokenType.HOPE]: "#f46a9b",
//   [TokenType.NETA]: "#ef9b20",
//   [TokenType.RAW]: "#edbf33",
//   [TokenType.ATOM]: "#ede15b", // "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"
// };

const BasicColors = [
	"red",
	"pink",
	"brown",
	"yellow",
	"blue",
	"#bdcf32",
	"#87bc45",
	"#27aeef",
	"#b33dc6",
	"#ea5545",
	"#f46a9b",
	"#ef9b20",
	"#edbf33",
];

export const LineColors: any = (
	Object.keys(TokenType) as Array<keyof typeof TokenType>
).reduce(
	(result, key, index) => ({
		...result,
		[TokenType[key]]: BasicColors[index % BasicColors.length],
	}),
	{ Others: "#ede15b" }
);
