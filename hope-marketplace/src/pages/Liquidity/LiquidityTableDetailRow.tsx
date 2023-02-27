import React, { useState } from "react";
import Flex from "../../components/Flex";
import Text from "../../components/Text";
import { ExternalLinkIcon } from "../../components/SvgIcons";
import { TPool } from "../../types/pools";

import { StyledButton as Button } from "./styled";
import { useKeplr } from "../../features/accounts/useKeplr";
import { TokenStatus } from "../../types/tokens";
import { ChainConfigs, ChainTypes } from "../../constants/ChainTypes";
import ManageBondModal from "../../components/ManageBonModal";

const LiquidityTableDetailRow: React.FC<{
	rowData: TPool;
	onClickAddLiquidity: (pool: TPool) => void;
	onClickSwap: (pool: TPool) => void;
}> = ({ rowData, onClickAddLiquidity, onClickSwap }) => {
	const { suggestToken } = useKeplr();

	const [isOpenManageBondModal, setIsOpenManageBondModal] = useState(false);

	const handleClickBondManageModal = async () => {
		setIsOpenManageBondModal(true);
	};

	const token2Address = TokenStatus[rowData.token2]?.contractAddress;

	return (
		<>
			<Flex
				key={rowData.id}
				alignItems="center"
				justifyContent="space-between"
				gap="10px"
				width="100%"
				padding="16px"
				backgroundColor="white"
			>
				<Flex alignItems="flex-start" flexDirection="row" gap="10px">
					<Button primary={false} 
						float="left"
						onClick={() =>
							window.open(
								`https://mintscan.io/juno/wasm/contract/${rowData.contract}`
							)
						}
					>
						<Text margin="0 8px 0 0" color="#02e296" bold={true} >
							View Contract 
						</Text>
						<ExternalLinkIcon />
					</Button>
					{/* <Text
						color="black"
						gap="5px 30px"
						alignItems="center"
						cursor="pointer"
						onClick={async () => {
							if (token2Address)
								await suggestToken(
									ChainConfigs[ChainTypes.JUNO],
									token2Address
								);
							if (rowData.lpAddress)
								await suggestToken(
									ChainConfigs[ChainTypes.JUNO],
									rowData.lpAddress
								);
						}}
					>
						Add Token <img alt="" src="/others/keplr.png" />
					</Text> */}
					<Button primary={false} float="left" onClick={async () => {
							if (token2Address)
								await suggestToken(
									ChainConfigs[ChainTypes.JUNO],
									token2Address
								);
							if (rowData.lpAddress)
								await suggestToken(
									ChainConfigs[ChainTypes.JUNO],
									rowData.lpAddress
								);
						}}>
						<Text margin="0 8px 0 0" color="#02e296" bold={true} >
							Add Token 
						</Text> <img alt="" src="/others/keplr.png" />
					</Button>
				</Flex>
				
				<Flex alignItems="flex-end" flexDirection="row" gap="10px" margin="0 45px 0 0">
					<Button primary={true} float="right" onClick={() => onClickSwap(rowData)}>
							Swap
					</Button>
					<Button primary={true} float="right" onClick={() => onClickAddLiquidity(rowData)}>
						Add
					</Button>
					<Button primary={true} float="right"
						onClick={() =>
							handleClickBondManageModal()
						}
					>
						Bond
					</Button>
				</Flex>
			</Flex>
			<ManageBondModal
				isOpen={isOpenManageBondModal}
				onClose={() => setIsOpenManageBondModal(false)}
				liquidity={rowData}
			/>
		</>
	);
};

export default LiquidityTableDetailRow;
