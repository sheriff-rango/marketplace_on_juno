import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useWalletManager } from "@noahsaso/cosmodal";
import { useAppSelector } from "../../app/hooks";
import ExploreHeader from "../../components/ExploreHeader";
import PageWrapper from "../../components/PageWrapper";
import Text from "../../components/Text";
import {
	ConnectedWalletTypeLocalStorageKey,
	WalletType as ConnectedWalletType,
} from "../../constants/BasicTypes";
import { CosmostationWalletContext } from "../../context/Wallet";
import {
	ConnectWalletButton,
	LiquiditiesContainer,
	// LiquidityHeader,
	LiquidityList,
	ListBody,
	ListHeader,
	MessageContainer,
	Wrapper,
} from "./styled";
// import TokenListModal from "../../components/TokenListModal";
import {
	getTokenName, TokenType,
	//  TokenType
} from "../../types/tokens";
import {
	ChevronDown,
	ChevronUp,
	ClaimRewardsWithBackground,
	GearIconWithBackground
} from "../../components/SvgIcons";
import { addSuffix } from "../../util/string";
import PoolImage from "../../components/PoolImage";
import { TPool, TPoolConfig } from "../../types/pools";
import Table, { TColumns } from "../../components/Table";
import PoolName from "../../components/PoolName";
import AddLiquidity from "./AddLiquidity";
import { ModalType, PoolType } from "./type";
import CreateLiquidity from "./CreateLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
import LiquidityTableDetailRow from "./LiquidityTableDetailRow";
import Flex from "../../components/Flex";
import { useTheme } from "styled-components";
import ManageBondModal from "../../components/ManageBonModal";
import ReactTooltip from "react-tooltip";
import useContract from "../../hook/useContract";
import useRefresh from "../../hook/useRefresh";
import { toast } from "react-toastify";
import TVL from "../../components/TVL";

type TPoolUserDetailInfo = {
	rewardToken?: TokenType;
	pendingReward: number;
	bonded: number;
	stakingAddress: string;
	priceInUsd: number;
};

const Liquidity: React.FC = () => {
	// const [showTokenListModal, setShowTokenListModal] = useState(false);
	const history = useHistory();
	const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
		null
	);
	const [addingPool, setAddingPool] = useState<TPool | undefined>();
	const theme = useTheme();
	const [modalType, setModalType] = useState<ModalType>(ModalType.ADD);
	const [selectedTab, setSelectedTab] = useState<string>(PoolType.ALL);
	const account = useAppSelector((state) => state.accounts.keplrAccount);
	const liquidities = useAppSelector((state) => state.liquidities);
	const { runExecute } = useContract();
	const { refreshPrice } = useRefresh();
	
	const tokenPrices = useAppSelector((state) => state.tokenPrices);

	// const { connect: connectWithCosmodal } = useCosmodal();
	const { connect: connectKeplr } = useWalletManager();
	const { connect: connectCosmostation } = useContext(
		CosmostationWalletContext
	);
	const { search } = useLocation();
	const type = new URLSearchParams(search).get("type");
	const [isPendingClaim, setIsPendingClaim] = useState(false);
	const handleClickClaim = async (pendingReward: number, stakingAddress: string) => {
		if (isPendingClaim || !pendingReward || !stakingAddress)
			return;
		setIsPendingClaim(true);
		try {
			await runExecute(stakingAddress, {
				withdraw: {},
			});
			toast.success("Successfully claimed!");
			refreshPrice();
		} catch (err) {
			console.log(err);
			toast.error("Claim Failed!");
		} finally {
			setIsPendingClaim(false);
		}
	};

	const [isOpenManageBondModal, setIsOpenManageBondModal] = useState<TPool>();
	const handleClickBondManageModal = async (pool:TPool) => {
		setIsOpenManageBondModal(pool);
	};

	const getPoolUserDetails = ((pool:TPool): TPoolUserDetailInfo[] => {
		let result: TPoolUserDetailInfo[] = [];
		const config = pool.config;
		if (Array.isArray(config)) {
			result = config.map((item, index) => {
				const pendingReward =
					((pool.pendingReward || []) as number[])[index] || 0;
				const tokenPriceInUsd = item.rewardToken
					? tokenPrices[item.rewardToken]?.market_data.current_price
							?.usd || 0
					: 0;
				return {
					rewardToken: item.rewardToken,
					pendingReward,
					bonded: ((pool.bonded || []) as number[])[index],
					stakingAddress: (
						(pool.stakingAddress || []) as string[]
					)[index],
					priceInUsd: pendingReward * tokenPriceInUsd,
				};
			});
		} else {
			const pendingReward = (pool.pendingReward || 0) as number;
			const tokenPriceInUsd = config?.rewardToken
				? tokenPrices[config.rewardToken]?.market_data.current_price
						?.usd || 0
				: 0;
			result = [
				{
					rewardToken: config?.rewardToken,
					pendingReward,
					bonded: (pool.bonded || 0) as number,
					stakingAddress: (pool.stakingAddress || "") as string,
					priceInUsd: pendingReward * tokenPriceInUsd,
				},
			];
		}
		return result;
	});

	useEffect(() => {
		if (type === "add") setModalType(ModalType.ADD);
	}, [type]);

	const getUSDCValue = ((pool:TPool): string => {
		let ret = (tokenPrices[pool.token2]?.market_data?.current_price?.usd || 0).toLocaleString(
			"en-US",
			{
				maximumFractionDigits: 12,
			}
		)
		var parts = ret.split('.');
		if(parts.length === 1)
			return ret;
		let decimalPart = ret.split('.')[1];
		let trimmedDecimalPart = "";
		for(let i = 0; i < decimalPart.length; i++){
			trimmedDecimalPart+= decimalPart[i];
			if(decimalPart[i] !== '0'){
				break;
			}
		}
		ret = `${ret.split('.')[0]}.${trimmedDecimalPart}`;
		return ret;
	});

	const Columns: TColumns<TPool>[] = [
		{
			name: "",
			title: "Pool name",
			alignLeft: true,
			sort: (data1, data2, direction) => {
				const name1 = `${getTokenName(data1.token1)}-${getTokenName(
					data1.token2
				)}`;
				const name2 = `${getTokenName(data2.token1)}-${getTokenName(
					data2.token2
				)}`;

				return direction === "up"
					? name1 > name2
						? 1
						: -1
					: name2 > name1
					? 1
					: -1;
			},
			render: (value: any, data: TPool) => (
				<Flex flexDirection="row">
					<PoolImage token1={data.token1} token2={data.token2} />
					<PoolName pool={data} />	
				</Flex>
			),
		},
		{
			name: "pool",
			title: "TVL",
			sort: true,
			render: (value, data) => <TVL pool={data}/>
		},
		{
			name: "apr",
			title: "APR",
			render: (value, data) => {
				const apr = data.apr;
				if (typeof apr === "string") {
					const rewardToken = (data.config as TPoolConfig)
						?.rewardToken;
					return (
						<Text gap="10px" color="black" alignItems="center" 
							flexWrap="nowrap"
							whiteSpace="nowrap">
							{rewardToken && (
							<img
									width={25}
									alt=""
									src={`/coin-images/${rewardToken.replace(
										/\//g,
										""
									)}.png`}
								/>
							)}
							{apr}
						</Text>
					);
				} else {
					return (
						<Flex alignItems="center" gap="10px" flexDirection="column">
							{apr.map((item, index) => {
								const rewardToken = (
									data.config as TPoolConfig[]
								)?.[index]?.rewardToken;
								return (
									<Text
										key={index}
										gap="10px"
										color="black"
										alignItems="center"
										flexWrap="nowrap"
										whiteSpace="nowrap"
									>
										{rewardToken && (
											<img
												width={30}
												alt=""
												src={`/coin-images/${rewardToken.replace(
													/\//g,
													""
												)}.png`}
											/>
										)}
											{item}
									</Text>
								);
							})}
						</Flex>
					);
				}
			},
		},
		{
			name: "config",
			title: "End in",
			render: (value:any, data) => {
				const now = Number(new Date());
				const config = value;
				var result: {
							apr: string;
							distributionEnd: number;
							rewardToken?: string;
						}[] = [];
				const apr = data.apr;
					if (typeof apr === "string") {
						const distributionEnd = Math.max(
							0,
							Math.floor(
								(((config as TPoolConfig)?.distributionEnd || 0) - now) /
									(1000 * 60 * 60 * 24)
							)
						);
						result = [
							{
								apr,
								distributionEnd,
								rewardToken: (config as TPoolConfig)?.rewardToken,
							},
						];
					} else {
						apr.forEach((item:any, index: number) => {
							const crrConfig = (config as TPoolConfig[])[index];
							const distributionEnd = Math.max(
								0,
								Math.floor(
									((crrConfig.distributionEnd || 0) - now) / (1000 * 60 * 60 * 24)
								)
							);
							result.push({
								apr: item,
								distributionEnd,
								rewardToken: crrConfig.rewardToken,
							});
						});
					}
				const distributionEnd = Math.max(
					0,
					...result.map(x=> x.distributionEnd)
				);
				return (
					<Flex flexDirection="column">
						<Text gap="10px" color="black" alignItems="center" 
						  	lineHeight="27px"
							flexWrap="nowrap"
							whiteSpace="nowrap"
					>
						{distributionEnd > 0 ? `${distributionEnd} Days` : ''}
					</Text>

					</Flex>
				);
			}
		},
		{
			name: "",
			title: "My Rewards",
			render: (value:any, data:TPool) => {
				const result = getPoolUserDetails(data);
				return (
					<Flex flexDirection="column">
						{result.map((item, index) => {
								return item.pendingReward > 0 && (
									<Flex>
										<Text
											key={index}
											gap="10px"
											margin="0 8px 0 0 "
											color="black"
											alignItems="center"
											flexWrap="nowrap"
											whiteSpace="nowrap">
											{`${addSuffix(item.pendingReward)} ($ ${item.priceInUsd.toLocaleString("en-US", {
													maximumFractionDigits: 2,
												})})`}
										</Text>
										<ReactTooltip
											id="tooltip-claim"
											place="top"
											class="fixed-top-tooltip"
										>
											Claim rewards
										</ReactTooltip>
										<ClaimRewardsWithBackground theme={theme} data-for="tooltip-claim" data-tip  onClick={(e:any) => {
											e.stopPropagation();
											handleClickClaim(item.pendingReward, item.stakingAddress);
										} }></ClaimRewardsWithBackground>
									</Flex>
								);
							})}
					</Flex>
				)
			},
		},
		{
			name: "",
			title: "My Liquidity",
			render: (value:any, data:TPool) => {
				const result = getPoolUserDetails(data);
				let totalLiquidityValue = data.balance || 0;
				result?.forEach(r => {
					if(r.bonded > 0)
					{
						totalLiquidityValue += r.bonded;
					}
				})
				totalLiquidityValue = totalLiquidityValue * (data.lpPrice || 0);
				return (
				<>	
					<Flex flexDirection="column" alignItems="flex-start" margin="0 8px 0 0">
						{(((data.balance || 0) > 0 )|| result.find(x => x.bonded > 0)) && 
							<Text color="black">{` LP Available: ${addSuffix(data.balance || 0)}`}
							</Text>
						}
						{result.map((item, index) => {
								return item.bonded > 0 && (
									<Text
										key={index}
										gap="10px"
										color="black"
										alignItems="center"
										flexWrap="nowrap"
										whiteSpace="nowrap"
									>
										 {`LP Bonded: ${addSuffix(item.bonded)}`}
									</Text>
								);
							})}
						{totalLiquidityValue > 0 && 
							<Text fixedFontSize=".8em" color="#777">
								{`$ ${addSuffix(totalLiquidityValue)}`}
							</Text>
						}
						
					</Flex>
					
					{(((data.balance || 0 )> 0) || result.find(x => x.bonded > 0)) && 
					<>
						<ReactTooltip
							id="tooltip-manage"
							place="top"
							class="fixed-top-tooltip"
						>
							Manage liquidity
						</ReactTooltip>
						<GearIconWithBackground theme={theme}  data-for="tooltip-manage" data-tip onClick={
							(e:any) => {											
								e.stopPropagation();
								handleClickBondManageModal(data)} 
						}/>
					</>
					}
				</>
			)}
		},
		{
			name: "ratio",
			title: "Value",
			sort: true,
			render: (value, data) => (
				<Flex flexDirection="column" >
					<Text fixedFontSize="1.2em" bold color="black" flexWrap="nowrap"
							whiteSpace="nowrap">
						1
						<Text fixedFontSize=".8em" bold color="black">
							{getTokenName(data.token1)} ≃
						</Text>
						{addSuffix(
							value || 0)}
						<Text fixedFontSize=".8em" bold color="black">
							 {getTokenName(data.token2)}
						</Text>
					</Text>
					{data.token1 !== TokenType.USDC && data.token1 !== TokenType.HOPERS && (<Text fixedFontSize=".8em" color="#777">{`1 ${getTokenName(data.token1)} ≃ ${
						getUSDCValue(data)
					}  USDC`}</Text>)}
					{data.token2 !== TokenType.USDC && data.token2 !== TokenType.HOPERS && (<Text fixedFontSize=".8em" color="#777">{`1 ${getTokenName(data.token2)} ≃ ${
						getUSDCValue(data)
					}  USDC`}</Text>)}
				</Flex>
			),
		},
		{
			name: "",
			title: "",
			render: (value: any, data: TPool, expanded: boolean) => (
				<Flex>
					{!expanded && (<ChevronDown theme={theme}/>)}
					{expanded && (<ChevronUp theme={theme}/>)}
				</Flex>
			),
		},
	];

	const handleClickConnectWalletButton = () => {
		const connectedWalletType = localStorage.getItem(
			ConnectedWalletTypeLocalStorageKey
		);
		if (connectedWalletType === ConnectedWalletType.COSMOSTATION) {
			connectCosmostation();
		} else {
			connectKeplr();
		}
	};

	const handleClickPlusButton = (pool: TPool) => {
		setModalType(ModalType.ADD);
		setAddingPool(pool);
		if (wrapperElement) {
			const headerElement = document.getElementById("header");
			const headerHeight = headerElement?.clientHeight || 0;
			// wrapperElement.style.scrollMargin = `${headerHeight}px`;
			wrapperElement.style.cssText = `scroll-margin-top: ${headerHeight}px`;
			wrapperElement.scrollIntoView({ behavior: "smooth" });
			// window.scrollTo(0, 0);
		}
	};

	const handleClickSwapButton = (pool: TPool) => {
		let to = pool.token1;
		let from = pool.token2;
		history.push(`/swap?from=${from}&to=${to}`);
	};

	// const handleSelectToken = (token: TokenType) => {
	// 	console.log("debug selected token", token);
	// };

	return (
		<PageWrapper>
			<ExploreHeader
				title="Liquidity"
				tabs={[
					{ title: "Swap", url: "/swap" },
					{ title: "Liquidity", url: "/liquidity" },
				]}
			/>
			<Wrapper ref={(node) => setWrapperElement(node)}>
				{/* <LiquidityHeader>
					<Text bold fontSize="35px" justifyContent="flex-start">
						Liquidity
					</Text>
					<Text
						bold
						fontSize="20px"
						justifyContent="flex-start"
						margin="10px 0"
					>
						Add your liquidity
					</Text>
				</LiquidityHeader> */}
				{!account && (
					<LiquidityList>
						<ListHeader>
							<Text
								justifyContent="flex-start"
								color="black"
								bold
								fontSize="20px"
							>
								Your Liquidity
							</Text>
							<Text justifyContent="flex-start" color="black">
								Remove liquidity to receive tokens back
							</Text>
						</ListHeader>
						<ListBody>
							<MessageContainer>
								Connect to a wallet to view your liquidity
							</MessageContainer>
						</ListBody>
						<ConnectWalletButton
							onClick={handleClickConnectWalletButton}
						>
							Connect Wallet
						</ConnectWalletButton>
					</LiquidityList>
				)}
				{account && modalType === ModalType.ADD && (
					<AddLiquidity
						onChangeModalType={setModalType}
						selectedPool={addingPool}
					/>
				)}
				{account && modalType === ModalType.CREATE && (
					<CreateLiquidity onChangeModalType={setModalType} />
				)}
				{account && modalType === ModalType.REMOVE && (
					<RemoveLiquidity onChangeModalType={setModalType} />
				)}
				<LiquiditiesContainer>
					<Text
						bold
						fontSize="20px"
						justifyContent="flex-start"
						margin="20px 0"
					>
						All Pools
					</Text>
					<Table<TPool>
						data={liquidities.filter(
							(liquidity) =>
								{
									switch(selectedTab){
										case PoolType.ALL:
											return true;
										case PoolType.INCENTIVIZED:
											return !!liquidity.stakingAddress;
										case PoolType.MYPOOL:
											return !!liquidity.balance || 
													((typeof liquidity.bonded  === "number") && !!liquidity.bonded) ||
													((liquidity.bonded as number[]) && (liquidity.bonded as number[])?.find(x => x > 0))
										default:
											return false;
									}
								}
						)}
						columns={Columns}
						defaultExpanded={(rowData) => rowData.id === 1}
						renderDetailRow={(rowData) => (
							<LiquidityTableDetailRow
								rowData={rowData}
								onClickAddLiquidity={handleClickPlusButton}
								onClickSwap={handleClickSwapButton}
							/>
						)}
						option={{
							emptyString: "No Liquidities",
							tab: {
								defaultSelected: PoolType.INCENTIVIZED as string,
								tabs: (
									Object.keys(PoolType) as Array<
										keyof typeof PoolType
									>
								).map((key) => PoolType[key]),
								onClick: (tab) => setSelectedTab(tab),
							},
							search: {
								onChange: (searchValue, liquidities) =>
									liquidities.filter(
										(liquidity) =>
											!searchValue ||
											liquidity.token1
												.toLowerCase()
												.includes(
													searchValue.toLowerCase()
												) ||
											liquidity.token2
												.toLowerCase()
												.includes(
													searchValue.toLowerCase()
												)
									),
							},
						}}
					/>
				</LiquiditiesContainer>
			</Wrapper>
			<ManageBondModal
				isOpen={isOpenManageBondModal !== null}
				onClose={() => setIsOpenManageBondModal(undefined)}
				liquidity={isOpenManageBondModal as TPool}
			/>
		</PageWrapper>
	);
};

export default Liquidity;
