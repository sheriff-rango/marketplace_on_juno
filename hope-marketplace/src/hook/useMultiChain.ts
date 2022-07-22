import { useWallet } from "@noahsaso/cosmodal";
import { ChainTypes, ChainConfigs } from "../constants/ChainTypes";

const useMultiChain = ({
  origin,
  foreign,
}: {
  origin: ChainTypes;
  foreign: ChainTypes;
}) => {
  const originChainConfig = ChainConfigs[origin];
  const foreignChainConfig = ChainConfigs[foreign];
  const originWallet = useWallet(originChainConfig.chainId);
  const foreignWallet = useWallet(foreignChainConfig.chainId);
  console.log("multi chain wallet origin", originWallet);
  console.log("multi chain wallet foreign", foreignWallet);
  return { origin: originWallet, foreign: foreignWallet };
};

export default useMultiChain;
