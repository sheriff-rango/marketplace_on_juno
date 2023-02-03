import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { AccountData } from "@cosmjs/proto-signing";
import { ChainTypes } from "../../constants/ChainTypes";
import { TokenType } from "../../types/tokens";

export type TIbcNativeTokenBalance = {
	[key in TokenType]: any;
};

export type TWasmChainClients = {
	[key in ChainTypes]: {
		client: SigningCosmWasmClient | null;
		account: AccountData | null;
	};
};
