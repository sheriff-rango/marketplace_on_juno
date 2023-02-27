import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import ExploreHeader from "../../components/ExploreHeader";
import PageWrapper from "../../components/PageWrapper";
import PoolImage from "../../components/PoolImage";
import PoolName from "../../components/PoolName";
import Table, { TColumns } from "../../components/Table";
import Text from "../../components/Text";
import { TPool, TPoolConfig } from "../../types/pools";
import { getTokenName, TokenStatus, TokenType } from "../../types/tokens";
import { Wrapper } from "./styled";

import { addSuffix } from "../../util/string";
import { PoolType } from "../Liquidity/type";
import Flex from "../../components/Flex";
import ReactTooltip from "react-tooltip";
import { ChevronDown, ChevronUp, ClaimRewardsWithBackground, GearIconWithBackground } from "../../components/SvgIcons";
import { useTheme } from "styled-components";
import { toast } from "react-toastify";
import useContract from "../../hook/useContract";
import useRefresh from "../../hook/useRefresh";
import ManageBondModal from "../../components/ManageBonModal";
import LiquidityTableDetailRow from "../Liquidity/LiquidityTableDetailRow";

type TPoolUserDetailInfo = {
	rewardToken?: TokenType;
	pendingReward: number;
	bonded: number;
	stakingAddress: string;
	priceInUsd: number;
};
const Bond: React.FC = () => {
	const [selectedTab, setSelectedTab] = useState<string>(PoolType.INCENTIVIZED);
	const liquidities = useAppSelector((state) => state.liquidities);
	const { search } = useLocation();
	const history = useHistory();
	const theme = useTheme();
	const poolId = new URLSearchParams(search).get("poolId");
	const tokenPrices = useAppSelector((state) => state.tokenPrices);
	const [isPendingClaim, setIsPendingClaim] = useState(false);
	const { runExecute } = useContract();
	const { refreshPrice } = useRefresh();
	const [isOpenManageBondModal, setIsOpenManageBondModal] = useState<TPool>();
	const handleClickBondManageModal = async (pool:TPool) => {
		setIsOpenManageBondModal(pool);
	};
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

	const handleClickSwapButton = (pool: TPool) => {
		let to = pool.token1;
		let from = pool.token2;
		history.push(`/swap?from=${from}&to=${to}`);
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
			render: (value, data) => {
				if(!tokenPrices[TokenType.HOPERS])
				{
					return null;
				}
				const token1Reserve =
				data.token1Reserve /
				Math.pow(
					10,
					TokenStatus[data.token1].decimal || 6
				);
			const token1Price =
				tokenPrices[data.token1]?.market_data
					?.current_price?.usd || 0;
			const token2Reserve =
			data.token2Reserve /
				Math.pow(
					10,
					TokenStatus[data.token2].decimal || 6
				);
			const token2Price =
				tokenPrices[data.token2]?.market_data
					?.current_price?.usd || 0;
			const totalLocked =
				token1Reserve * token1Price +
				token2Reserve * token2Price;
			const totalHopersLocked = totalLocked / tokenPrices[TokenType.HOPERS].market_data
			?.current_price?.usd ;
			return (
				<Flex flexDirection="column">
					<Text color="black">
						{`${addSuffix(totalHopersLocked)}`}
					</Text>
					<Text fixedFontSize=".8em" color="#777">
						{`$ ${addSuffix(totalLocked)}`}
					</Text>
				</Flex>
				)
			}
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

	return (
		<PageWrapper>
			<ExploreHeader
				title="Bond"
				tabs={[
					{ title: "Bond", url: "/bond" },
					{ title: "Stake", url: "/stake" },
					// { title: "Airdrop", url: "/airdrop" },
				]}
			/>
			<Wrapper>
				<Text
					width="100%"
					flexDirection="column"
					margin="30px 0 0 0"
					gap="10px"
				>
					<Text bold fontSize="35px">
						Bond
					</Text>
					<Text bold fontSize="20px">
						Bond LP Token to earn
					</Text>
				</Text>
				<Table<TPool>
					data={liquidities.filter(
						(liquidity) =>
							{
								switch(selectedTab){
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
					defaultExpanded={(rowData) =>
						rowData.id === Number(poolId || 1)
					}
					renderDetailRow={(rowData) => (
						<LiquidityTableDetailRow
							rowData={rowData}
							onClickAddLiquidity={() => {
								history.push(
									`/liquidity?type=add&poolId=${rowData.id}`
								)
							}}
							onClickSwap={handleClickSwapButton}
						/>
					)}
					option={{
						emptyString: "No Liquidities",
						tab: {
							tabs: (
								Object.keys(PoolType) as Array<
									keyof typeof PoolType
								>
							).filter(x => x !== "ALL").map((key) => PoolType[key]),
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
											.includes(searchValue.toLowerCase())
								),
						},
					}}
				/>
			</Wrapper>
			<ManageBondModal
						isOpen={isOpenManageBondModal !== null}
						onClose={() => setIsOpenManageBondModal(undefined)}
						liquidity={isOpenManageBondModal as TPool}
			/>
		</PageWrapper>
	);
};

export default Bond;
