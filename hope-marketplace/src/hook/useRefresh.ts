import { useContext } from "react";
import { RefreshContext } from "../context/RefreshContext";

const useRefresh = () => {
  const { nft: value, price, cache, liquidity, balances, refreshNft, refreshPrice, refreshCache, refreshBalances } = useContext(RefreshContext);
  return { onNftRefresh: value, onPriceRefresh: price, onCacheRefresh:cache, onLiquidityRefresh: liquidity, onBalancesRefresh: balances, refreshNft, refreshPrice, refreshCache, refreshBalances };
};

export default useRefresh;
