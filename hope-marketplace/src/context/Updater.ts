import { useCallback, useEffect, useRef, useState } from "react";

import useRefresh from "../hook/useRefresh";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import useFetch from "../hook/useFetch";
import getQuery, { BACKEND_URL } from "../util/useAxios";
// import { setTokenPrice } from "../features/tokenPrices/tokenPricesSlice";
// import { TokenType } from "../types/tokens";

export default function Updater(): null {
	const allowedFetchLiquiditiesPaths:string[] = ["", "/", "/liquidity", "/swap", "/bond", "/stake"];
	const allowedFetchNftsPaths:string[] = ["/collections/explore", "/activity", "/collections/marketplace"];
	const isFirstRef = useRef(true);
	const [basicData, setBasicData] = useState<any>({});
	const {
		onNftRefresh,
		onPriceRefresh,
		onCacheRefresh,
		onLiquidityRefresh,
		onBalancesRefresh
	} = useRefresh();

	const {
		fetchAllNFTs,
		clearAllNFTs,
		fetchLiquidities,
		fetchTokenPricesUsingPools,
		getTokenBalances
	} = useFetch();
	
	const cacheLiquiditiesKey = "liquiditiesInfo";
	const cacheTokenPriceKey = "tokenPriceInfo";
	const cacheCollectionInfoKey = "collectionInfo";
	const cacheCollectionTraitsKey = "collectionTraits";
	const cacheMarketplaceNFTsKey = "marketplaceNFTs";

	const account = useAppSelector((state) => state?.accounts?.keplrAccount);

	const updateFromCache = (fields:string):Promise<any> =>{
		return getQuery({
			url: `${BACKEND_URL}/cache?fields=${fields}`,
		});
	};

	const updateLiquiditiesFromCache  = ():Promise<any> =>{
		return updateFromCache(`${cacheLiquiditiesKey},${cacheTokenPriceKey}`);
	};

	useEffect(() => {
		console.log("____initial_cache_fetch___")
		let fields = cacheLiquiditiesKey;
		if(allowedFetchLiquiditiesPaths.indexOf(window.location.pathname) >= 0){
			fields += `,${cacheTokenPriceKey}`;
		}
		if(allowedFetchNftsPaths.indexOf(window.location.pathname) >= 0){
			fields += `${cacheCollectionInfoKey},${cacheCollectionTraitsKey},${cacheMarketplaceNFTsKey}`;
		}
		updateFromCache(fields).then(data => {
			console.log("____initial_cache_fetch_finished fetch___")
			setBasicData(data || {});
			fetchTokenPricesUsingPools(data.liquiditiesInfo);
			//even if account is still null, this populate the state for the useFetch
			fetchLiquidities(account, data.liquiditiesInfo)
		})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(isFirstRef.current){
			return;
		}
		console.log("____cache_fetch____")
		let fields = `${cacheCollectionInfoKey},${cacheCollectionTraitsKey},${cacheMarketplaceNFTsKey},${cacheLiquiditiesKey},${cacheTokenPriceKey}`
		updateFromCache(fields)
			.then(data => {
				console.log("____cache_fetched____")
				setBasicData(data || {});
				console.log("basic data set");
			})
	}, [onCacheRefresh]);

	useEffect(() => {
		if(isFirstRef.current){
			return;
		}
		console.log("____fetchLiquidities____")
		if(allowedFetchLiquiditiesPaths.indexOf(window.location.pathname) >= 0)
		{
			if(basicData?.liquiditiesInfo)
			{
				console.log("executing")
				updateLiquiditiesFromCache().then(() => {
					fetchLiquidities(account, basicData.liquiditiesInfo);
				})
			}
			else {
				console.log("returning because of empty basic data")
				return;
			}
		}
		else
		{
			console.log("returning")
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onLiquidityRefresh, account?.address]);

	useEffect(() => {
		if(isFirstRef.current){
			return;
		}
		console.log("____fetchBalances____")
		if(basicData?.liquiditiesInfo)
		{
			console.log("executing")
			getTokenBalances();
		}
		else {
			console.log("returning because of empty basic data")
			return;
		}
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onBalancesRefresh, account]);

	useEffect(() => {
		if(isFirstRef.current){
			return;
		}
		console.log("____fetchTokenPricesUsingPools____")
		if(basicData?.liquiditiesInfo)
		{
			console.log("executing")
			updateLiquiditiesFromCache().then(() => {
				fetchTokenPricesUsingPools();
			})
		}
		else {
			console.log("returning because of empty basic data")
			return;
		}
		
	}, [onPriceRefresh, account, basicData?.liquiditiesInfo]);

	useEffect(() => {
		console.log("____fetchAllNFTs____")
		if(allowedFetchNftsPaths.indexOf(window.location.pathname) >= 0)
		{
			console.log("executing")
			fetchAllNFTs(account, basicData);
			if (!account) {
				clearAllNFTs();
			}
		}
		else
		{
			console.log("returning")
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onNftRefresh, account]);

	//Leave this as last to set that the first updater render ended
	useEffect(() => {
		isFirstRef.current = false;
	}, []);

	return null;
}
