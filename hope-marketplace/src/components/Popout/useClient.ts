import { useCallback, useEffect, useState } from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { useWalletManager } from "@noahsaso/cosmodal";
import { ChainConfigs, ChainTypes } from "../../constants/ChainTypes";
import { TokenStatus, TokenType } from "../../types/tokens";
import { TIbcNativeTokenBalance, TWasmChainClients } from "./type";
// import { toast } from "react-toastify";

const useClient = (tokens?: TokenType[]) => {
	const { connectedWallet } = useWalletManager();
	const [wasmClients, setWasmClients] = useState<TWasmChainClients>(
		{} as TWasmChainClients
	);
	const [ibcNativeTokenBalance, setIBCNativeTokenBalance] =
		useState<TIbcNativeTokenBalance>({} as TIbcNativeTokenBalance);

	const getClient = useCallback(
		async (chainType: ChainTypes) => {
			if (connectedWallet) {
				const chainConfig = ChainConfigs[chainType];
				// const offlineSigner = await getOfflineSigner(chainConfig.chainId);
				const { wallet, walletClient } = connectedWallet;
				// if (chainType === ChainTypes.MARS) {
				// 	toast.info(`getting offline signer ${chainType}`);
				// }
				const offlineSigner = await wallet.getOfflineSignerFunction(
					walletClient
				)(chainConfig.chainId);
				// if (chainType === ChainTypes.MARS) {
				// 	toast.info(
				// 		`got offline signer ${chainType} ${!!offlineSigner}`
				// 	);
				// }

				let account = null;

				try {
					// if (chainType === ChainTypes.MARS) {
					// 	toast.info(`getting account ${chainType} `);
					// }
					account = await offlineSigner?.getAccounts();
					// if (chainType === ChainTypes.MARS) {
					// 	toast.info(`got account ${chainType} ${!!account}`);
					// }
				} catch (e: any) {
					// toast.error(
					// 	`got account ${chainType} ${JSON.stringify(
					// 		e?.message || "no error message"
					// 	)} ${!!wallet}`
					// );
				}

				let wasmChainClient = null;
				if (offlineSigner) {
					try {
						// toast.info(`getting wasm client ${chainType}`);
						wasmChainClient =
							await SigningCosmWasmClient.connectWithSigner(
								chainConfig.rpcEndpoint,
								offlineSigner,
								{
									gasPrice: GasPrice.fromString(
										`${chainConfig.gasPrice}${chainConfig.microDenom}`
									),
								}
							);
						return {
							account: account?.[0] || null,
							client: wasmChainClient,
						};
					} catch (e) {
						console.error("wallets", e);
						return { account: account?.[0] || null, client: null };
					}
				}
			}
			return { account: null, client: null };
		},
		[connectedWallet]
	);

	useEffect(() => {
		(Object.keys(TokenType) as Array<keyof typeof TokenType>)
			.filter(
				(token) =>
					TokenType[token] === TokenType.JUNO ||
					TokenStatus[TokenType[token]].isIBCCoin
			)
			.forEach(async (key) => {
				const token = TokenType[key];
				const tokenStatus = TokenStatus[token];
				const chain = tokenStatus.chain;
				try {
					// toast.info(`getting client start ${key}`);
					const client = await getClient(chain);
					// toast.info(`getting client success ${key}`);
					setWasmClients((prev) => ({
						...prev,
						[chain]: client,
					}));
				} catch (e) {
					console.log(e);
					// toast.error(`getting client error ${key}`);
				}
			});
	}, [getClient]);

	const getBalance = useCallback(
		async (token: TokenType) => {
			if (ibcNativeTokenBalance[token]) return;
			const tokenStatus = TokenStatus[token];
			const chainConfig = ChainConfigs[tokenStatus.chain];
			const { client, account } = wasmClients?.[tokenStatus.chain] || {};
			if (connectedWallet && client && account) {
				// setHasErrorOnMobileConnection(false);
				const balance = await client.getBalance(
					account.address,
					tokenStatus.isNativeCoin
						? chainConfig.microDenom
						: tokenStatus.denom || ""
				);
				setIBCNativeTokenBalance((prev) => ({
					...prev,
					[token]: balance,
				}));
				// else {
				// 	setHasErrorOnMobileConnection(true);
				// }
			}
		},
		[connectedWallet, ibcNativeTokenBalance, wasmClients]
	);

	useEffect(() => {
		if (!tokens) return;
		for (const token of tokens) {
			getBalance(token);
		}
	}, [getBalance, tokens]);

	return {
		clients: wasmClients,
		getClient,
		ibcBalance: ibcNativeTokenBalance,
	};
};

export default useClient;
