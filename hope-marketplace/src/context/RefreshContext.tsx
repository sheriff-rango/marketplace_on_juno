import React, { useState, useEffect, useRef, useCallback } from "react";

const REFRESH_NFT_INTERVAL = 1000 * 30;
const REFRESH_PRICE_INTERVAL = 1000 * 10;
const REFRESH_CACHE_INTERVAL = 1000 * 60 * 30;
const REFRESH_LIQUIDITY_INTERVAL = 1000 * 30;
const REFRESH_BALANCES_INTERVAL = 1000 * 13;

const RefreshContext = React.createContext({
  nft: 0,
  price: 0,
  cache: 0,
  liquidity: 0,
  balances:0,
  refreshNft: () => {},
  refreshPrice: () => {},
  refreshCache: () => {},
  refreshLiquidity: () => {},
  refreshBalances: () => {},
});

// Check if the tab is active in the user browser
const useIsBrowserTabActive = () => {
  const isBrowserTabActiveRef = useRef(true);

  useEffect(() => {
    const onVisibilityChange = () => {
      isBrowserTabActiveRef.current = !document.hidden;
    };

    window.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return isBrowserTabActiveRef;
};

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }: { children: any }) => {
  console.log("--------RefreshContextProvider render--------");

  const [nftValue, setNftValue] = useState(0);
  const [priceValue, setPriceValue] = useState(0);
  const [cacheValue, setCacheValue] = useState(0);
  const [liquidityValue, setLiquidityValue] = useState(0);
  const [balancesValue, setBalancesValue] = useState(0);

  const isBrowserTabActiveRef = useIsBrowserTabActive();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isBrowserTabActiveRef.current) {
       console.log("--------REFRESH_NFT_INTERVAL--------");
       setNftValue((prev) => prev + 1);
       console.log("--------REFRESH_NFT_INTERVAL-SET--------");
      }
    }, REFRESH_NFT_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isBrowserTabActiveRef.current) {
        console.log("--------REFRESH_PRICE_INTERVAL--------");
        setPriceValue((prev) => prev + 1);
        console.log("--------REFRESH_PRICE_INTERVAL-SET--------");
      }
    }, REFRESH_PRICE_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isBrowserTabActiveRef.current) {
        console.log("--------REFRESH_CACHE_INTERVAL--------");
        setCacheValue((prev) => prev + 1);
        console.log("--------REFRESH_CACHE_INTERVAL-SET--------");
      }
    }, REFRESH_CACHE_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isBrowserTabActiveRef.current) {
        console.log("--------REFRESH_LIQUIDITY_INTERVAL--------");
        setLiquidityValue((prev) => prev + 1);
        console.log("--------REFRESH_LIQUIDITY_INTERVAL-SET--------");
      }
    }, REFRESH_LIQUIDITY_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isBrowserTabActiveRef.current) {
        console.log("--------REFRESH_BALANCES_INTERVAL--------");
        setBalancesValue((prev) => prev + 1);
        console.log("--------REFRESH_BALANCES_INTERVAL-SET--------");
      }
    }, REFRESH_BALANCES_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  const refreshNft = useCallback(() => {
    console.log("--------refreshNft--------");
    setNftValue((prev) => prev + 1);
  }, []);

  const refreshPrice = useCallback(() => {
    console.log("--------refreshPrice--------");
    setPriceValue((prev) => prev + 1);
  }, []);

  const refreshCache = useCallback(() => {
    console.log("--------refreshCache--------");
    setCacheValue((prev) => prev + 1);
  }, []);

  const refreshLiquidity = useCallback(() => {
    console.log("--------refreshLiquidity--------");
    setLiquidityValue((prev) => prev + 1);
  }, []);

  const refreshBalances = useCallback(() => {
    console.log("--------refreshBalances--------");
    setBalancesValue((prev) => prev + 1);
  }, []);

  return (
    <RefreshContext.Provider value={{ nft: nftValue, price: priceValue, cache: cacheValue, liquidity: liquidityValue, balances: balancesValue, refreshNft, refreshPrice, refreshCache, refreshLiquidity, refreshBalances }}>
      {children}
    </RefreshContext.Provider>
  );
};

export { RefreshContext, RefreshContextProvider };
