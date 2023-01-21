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
import { TPool } from "../../types/pools";

const MyPools: React.FC = () => {
	const liquidities = useAppSelector((state) => state.liquidities);
	const myLiquidities = useMemo(
		() =>
			liquidities.filter((liquidity) => {
				return (liquidity.bonded || 0) > 0;
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
			value: (liquidity: TPool) => addSuffix(liquidity.bonded || 0),
		},
		{
			title: "Pending Rewards",
			value: (liquidity: TPool) => addSuffix(liquidity.pendingReward || 0),
		},
	];

	return (
		<LiquiditiesContainer>
			{/* <Title>My Pools</Title> */}
			<MyPoolsContainer>
				{myLiquidities.map((liquidity, index: number) => (
					<MyPoolItem key={index}>
						<MyPoolItemRow>
							<PoolImage token1={liquidity.token1} token2={liquidity.token2} />
							<PoolName pool={liquidity} />
						</MyPoolItemRow>
						<MyPoolContentRow>
							{poolContents.map((content, index) => (
								<MyPoolContentItem key={index}>
									<Text bold color="#c5c5c5">
										{content.title}
									</Text>
									<Text bold color="black">
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
