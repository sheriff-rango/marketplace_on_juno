export enum IDOIds {
	HOPERS = "hopers",
	HOPERS2 = "hopers2",
}

export interface IDOInterface {
	id: IDOIds;
	name: string;
	image: string;
	symbol: string;
	description: string;
	contract: string;
}

export const IDOs: IDOInterface[] = [
	{
		id: IDOIds.HOPERS,
		name: "HOPERS TOKEN",
		image: "hopers.png",
		symbol: "$HOPERS",
		description:
			"Introducing $HOPERS, the utility token of the all-in-one platform hopers.io. With $HOPERS, you can actively participate in the growth of our ecosystem and gain access to a variety of benefits, including staking, liquidity provision, early IDO opportunities, yield farming and more. The platform powers the ecosystem through the Hopers Token, which grants you access to all the features that the Hopers platform has to offer. By holding and participating with Hopers tokens, you are also eligible for rewards generated by the ecosystem and liquidity pools.",
		contract: "juno1kgh606vvmdaz7u0gledx8v236yun34ezlvhpjm5vg4ju7esmmd5q3dfsv6",
	},
	{
		id: IDOIds.HOPERS2,
		name: "HOPERS TOKEN",
		image: "hopers.png",
		symbol: "$HOPERS",
		description:
			"Introducing $HOPERS, the utility token of the all-in-one platform hopers.io. With $HOPERS, you can actively participate in the growth of our ecosystem and gain access to a variety of benefits, including staking, liquidity provision, early IDO opportunities, yield farming and more. The platform powers the ecosystem through the Hopers Token, which grants you access to all the features that the Hopers platform has to offer. By holding and participating with Hopers tokens, you are also eligible for rewards generated by the ecosystem and liquidity pools.",
		contract: "juno1j3mvk9qnu0wkhzw8qzu0hz0vpewy88pt7tjas5sdxyl65kszjg4s69pue2",
	},
];

export const getIDOById = (id: IDOIds): IDOInterface => {
	return IDOs.filter((ido: IDOInterface) => ido.id === id)[0] || {};
};
