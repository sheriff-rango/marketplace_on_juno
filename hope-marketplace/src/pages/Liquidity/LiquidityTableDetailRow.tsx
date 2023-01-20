import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import Flex from "../../components/Flex";
import Text from "../../components/Text";
import { ExternalLinkIcon } from "../../components/SvgIcons";
import { TPool } from "../../types/pools";

import { DetailRowBlock, StyledButton as Button } from "./styled";

const LiquidityTableDetailRow: React.FC<{
	rowData: TPool;
	onClickAddLiquidity: (pool: TPool) => void;
}> = ({ rowData, onClickAddLiquidity }) => {
	const history = useHistory();

	const distributionEnd = useMemo(() => {
		const now = Number(new Date());
		return Math.max(
			0,
			Math.floor(
				((rowData.config?.distributionEnd || 0) - now) / (1000 * 60 * 60 * 24)
			)
		);
	}, [rowData.config?.distributionEnd]);

	return (
		<>
			<Flex
				key={rowData.id}
				alignItems="center"
				justifyContent="space-between"
				gap="10px"
				width="100%"
				padding="20px"
				backgroundColor="white"
			>
				<Flex alignItems="flex-start" flexDirection="column" gap="10px">
					<Text
						color="black"
						gap="5px 30px"
						alignItems="center"
						cursor="pointer"
						onClick={() =>
							window.open(
								`https://mintscan.io/juno/account/${rowData.contract}`
							)
						}
					>
						View Contract <ExternalLinkIcon />
					</Text>
				</Flex>
				<DetailRowBlock>
					<Flex
						flexDirection="column"
						alignItems="flex-start"
						gap="10px"
						justifyContent="flex-start"
					>
						<Text color="black" justifyContent="flex-start" bold>
							Bonding Rewards
						</Text>
						<Flex flexDirection="column" alignItems="center" gap="10px">
							{[rowData.token1, rowData.token2].map((token, index) => (
								<Flex key={index} gap="10px" alignItems="center">
									<Text bold color="#02e296">
										Reward Asset
									</Text>
									<img
										width={25}
										alt=""
										src={`/coin-images/${token.replace(/\//g, "")}.png`}
									/>
									<Text color="black">{rowData.apr}</Text>
									<Text color="black">{`end in ${distributionEnd} Days`}</Text>
								</Flex>
							))}
						</Flex>
					</Flex>
				</DetailRowBlock>
				<Flex flexDirection="column" gap="10px">
					<Button order={1} onClick={() => onClickAddLiquidity(rowData)}>
						Add Liquidity
					</Button>
					<Button
						order={2}
						onClick={() =>
							rowData.stakingAddress &&
							history.push(`/bond?poolId=${rowData.id}`)
						}
					>
						Bond
					</Button>
				</Flex>
			</Flex>
		</>
	);
};

export default LiquidityTableDetailRow;
