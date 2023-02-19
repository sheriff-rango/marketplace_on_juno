import React, { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { addSuffix } from "../../util/string";
import PoolImage from "../PoolImage";
import PoolName from "../PoolName";
import Text from "../Text";
import {
	LiquiditiesContainer,
	MyPoolContentItem,
	MyPoolContentRow,
	MyPoolItem,
	MyPoolItemRow,
	MyPoolsContainer,
	// Title,
} from "./styled";
import { TPool, TPoolConfig } from "../../types/pools";

const MyPools: React.FC = () => {
	const liquidities = useAppSelector((state) => state.liquidities);
	const tokenPrices = useAppSelector((state) => state.tokenPrices);
	const myLiquidities = useMemo(
		() =>
			liquidities.filter((liquidity) => {
				if (!liquidity.bonded) return false;
				const bonded =
					typeof liquidity.bonded === "number"
						? [liquidity.bonded as number]
						: (liquidity.bonded as number[]);
				const isBonded = bonded.reduce(
					(result, crrBonded) => result || (crrBonded || 0) > 0,
					false
				);
				return isBonded;
			}),
		[liquidities]
	);

	const poolContents = [
		{ title: "APR", value: (liquidity: TPool) => liquidity.apr },
		{
			title: "Pool Liquidity",
			value: (liquidity: TPool) => addSuffix(liquidity.pool),
		},
		{
			title: "Bonded",
			value: (liquidity: TPool) => {
				const bonded = liquidity.bonded;
				if (!bonded) return null;
				let renderInfo = [];
				if (typeof bonded === "number") {
					const config = liquidity.config as TPoolConfig;
					renderInfo = [
						{
							bonded,
							rewardToken: config.rewardToken || "",
						},
					];
				} else {
					const config = liquidity.config as TPoolConfig[];
					renderInfo =
						config?.map((item, index) => ({
							bonded: bonded[index],
							rewardToken: item.rewardToken || "",
						})) || [];
				}
				return (
					<>
						{renderInfo.map((info, index) => (
							<Text
								key={index}
								gap="10px"
								alignItems="center"
								title={"" + info.bonded}
							>
								{info.rewardToken && (
									<img
										width={25}
										alt=""
										src={`/coin-images/${info.rewardToken.replace(
											/\//g,
											""
										)}.png`}
									/>
								)}
								<Text
									flexDirection="column"
									alignItems="flex-start"
								>
									<Text color="black" bold>
										{addSuffix(info.bonded)}
									</Text>
									<Text
										style={{ fontSize: 14 }}
										color="#787878"
									>
										{addSuffix(
											info.bonded *
												(liquidity.lpPrice || 0)
										)}
										$
									</Text>
								</Text>
							</Text>
						))}
					</>
				);
			},
		},
		{
			title: "Pending Rewards",
			value: (liquidity: TPool) => {
				const pendingReward = liquidity.pendingReward;
				if (!pendingReward) return null;
				let renderInfo = [];
				if (typeof pendingReward === "number") {
					const config = liquidity.config as TPoolConfig;
					renderInfo = [
						{
							pendingReward,
							rewardToken: config.rewardToken || "",
							rewardTokenPrice: config.rewardToken
								? tokenPrices[config.rewardToken]?.market_data
										?.current_price?.usd || 0
								: 0,
						},
					];
				} else {
					const config = liquidity.config as TPoolConfig[];
					renderInfo =
						config?.map((item, index) => ({
							pendingReward: pendingReward[index],
							rewardToken: item.rewardToken || "",
							rewardTokenPrice: item.rewardToken
								? tokenPrices[item.rewardToken]?.market_data
										?.current_price?.usd || 0
								: 0,
						})) || [];
				}
				return (
					<>
						{renderInfo.map((info, index) => (
							<Text
								key={index}
								gap="10px"
								alignItems="center"
								title={"" + info.pendingReward}
							>
								{info.rewardToken && (
									<img
										width={25}
										alt=""
										src={`/coin-images/${info.rewardToken.replace(
											/\//g,
											""
										)}.png`}
									/>
								)}
								<Text
									flexDirection="column"
									alignItems="flex-start"
								>
									<Text color="black" bold>
										{addSuffix(info.pendingReward)}
									</Text>
									<Text
										style={{ fontSize: 14 }}
										color="#787878"
									>
										{addSuffix(
											info.pendingReward *
												info.rewardTokenPrice
										)}
										$
									</Text>
								</Text>
							</Text>
						))}
					</>
				);
			},
		},
	];

	return (
		<LiquiditiesContainer>
			{/* <Title>My Pools</Title> */}
			<MyPoolsContainer>
				{myLiquidities?.map((liquidity, index: number) => (
					<MyPoolItem key={index}>
						<MyPoolItemRow>
							<PoolImage
								token1={liquidity.token1}
								token2={liquidity.token2}
							/>
							<PoolName pool={liquidity} />
						</MyPoolItemRow>
						<MyPoolContentRow>
							{poolContents.map((content, index) => (
								<MyPoolContentItem key={index}>
									<Text bold color="#c5c5c5">
										{content.title}
									</Text>
									<Text
										bold
										color="black"
										alignItems="center"
									>
										{content.value(liquidity)}
									</Text>
								</MyPoolContentItem>
							))}
						</MyPoolContentRow>
					</MyPoolItem>
				))}
			</MyPoolsContainer>
		</LiquiditiesContainer>
	);
};

export default MyPools;
