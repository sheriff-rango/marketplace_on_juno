import { useEffect, useRef, useState } from "react";

import useRefresh from "../hook/useRefresh";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import useFetch from "../hook/useFetch";
import getQuery, { BACKEND_URL } from "../util/useAxios";
import { useLocation } from "react-router-dom";

export default function Updater(): null {
	const allowedFetchLiquiditiesPaths: string[] = [
		"",
		"/",
		"/liquidity",
		"/swap",
		"/bond",
		"/stake",
		"/profile",
	];
	const allowedFetchBalancesPaths: string[] = [
		"/liquidity",
		"/swap",
		"/profile",
	];
	const allowedFetchNftsPaths: string[] = [
		"/collections/explore",
		"/activity",
		"/collections/marketplace",
		"/profile",
		"/collections/mint",
	];
	const isFirstRef = useRef(true);
	const [basicData, setBasicData] = useState<any>({});
	const { pathname } = useLocation();
	const {
		onNftRefresh,
		onPriceRefresh,
		onCacheRefresh,
		onLiquidityRefresh,
		onBalancesRefresh,
	} = useRefresh();

	const {
		fetchCollectionInfo,
		setMarketplaceNFTsState,
		fetchMyNFTs,
		fetchLiquidities,
		fetchTokenPricesUsingPools,
		getTokenBalances,
	} = useFetch();

	const cacheLiquiditiesKey = "liquiditiesInfo";
	const cacheTokenPriceKey = "tokenPriceInfo";
	const cacheCollectionInfoKey = "collectionInfo";
	const cacheCollectionTraitsKey = "collectionTraits";
	const cacheMarketplaceNFTsKey = "marketplaceNFTs";

	const account = useAppSelector((state) => state?.accounts?.keplrAccount);

	useAppDispatch();

	const updateFromCache = async (fields: string) => {
		console.log(`Fetching from cache:${fields}`);
		let cacheResult = await getQuery({
			url: `${BACKEND_URL}/cache?fields=${fields}`,
		});
		console.log(`Fetching from cache ended`);
		if (cacheResult) {
			let ret = { ...basicData, ...cacheResult };
			console.log(`Setting basic data`);
			setBasicData(ret);
			console.log(`Basic data set`);
			return ret;
		} else {
			console.log(`Empty cache received`);
			return {};
		}
	};

	const updateLiquiditiesFromCache = async () => {
		let ret = await updateFromCache(
			`${cacheLiquiditiesKey},${cacheTokenPriceKey}`
		);
		return ret;
	};

	const updateNftsFromCache = async () => {
		let ret = await updateFromCache(
			`${cacheCollectionInfoKey},${cacheCollectionTraitsKey},${cacheMarketplaceNFTsKey}`
		);
		return ret;
	};

	useEffect(() => {
		console.log("____initial_cache_fetch___");
		let fields = cacheLiquiditiesKey;
		if (allowedFetchLiquiditiesPaths.indexOf(pathname) >= 0) {
			fields += `,${cacheTokenPriceKey}`;
		}
		fields += `,${cacheCollectionInfoKey},${cacheCollectionTraitsKey},${cacheMarketplaceNFTsKey}`;
		updateFromCache(fields).then((data) => {
			console.log("____initial_cache_fetch_finished fetch___");

			console.log("____initial_cache_fetchTokenPricesUsingPools___");
			fetchTokenPricesUsingPools(data.liquiditiesInfo, true);

			console.log("____initial_cache_fetchLiquidities___");
			//even if account is null, this populate the state for the useFetch
			fetchLiquidities(null, data.liquiditiesInfo);

			console.log("____initial_cache_fetchNfts___");
			//even if account is null, this populate the state
			fetchCollectionInfo(null, data);
			setMarketplaceNFTsState(null, data);

			console.log("____initial_cache_fetchHopersPrice___");
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isFirstRef.current || onCacheRefresh === 0) {
			return;
		}
		console.log("____cache_fetch____");
		let fields = `${cacheCollectionInfoKey},${cacheCollectionTraitsKey},${cacheMarketplaceNFTsKey},${cacheLiquiditiesKey},${cacheTokenPriceKey}`;
		updateFromCache(fields).then((data) => {
			console.log("____cache_fetched____");
			setBasicData(data || {});
			console.log("basic data set");
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onCacheRefresh]);

	useEffect(() => {
		if (isFirstRef.current || onLiquidityRefresh === 0) {
			return;
		}
		console.log("____fetchLiquidities____");
		if (allowedFetchLiquiditiesPaths.indexOf(pathname) >= 0) {
			if (basicData?.liquiditiesInfo) {
				console.log("executing");
				updateLiquiditiesFromCache().then(() => {
					fetchLiquidities(account, basicData.liquiditiesInfo);
					console.log("____fetchTokenPricesUsingPools____");
					fetchTokenPricesUsingPools();
				});
			} else {
				console.log("returning because of empty basic data");
				return;
			}
		} else {
			console.log("returning");
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onLiquidityRefresh, pathname, account]);

	useEffect(() => {
		if (isFirstRef.current || onBalancesRefresh === 0) {
			return;
		}
		console.log("____fetchBalances____");
		if (allowedFetchBalancesPaths.indexOf(pathname) >= 0) {
			console.log("executing");
			getTokenBalances();
			// if (basicData?.liquiditiesInfo) {
			// } else {
			// 	console.log("returning because of empty basic data");
			// 	return;
			// }
		} else {
			console.log("returning");
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onBalancesRefresh, account?.address, pathname, getTokenBalances]);

	useEffect(() => {
		if (isFirstRef.current || onPriceRefresh === 0) {
			return;
		}
		console.log("____fetchHopersPrice____");
		if (basicData?.liquiditiesInfo) {
			console.log("executing");
			fetchTokenPricesUsingPools([], true);
		} else {
			console.log("returning because of empty basic data");
			return;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onPriceRefresh]);

	useEffect(() => {
		if (isFirstRef.current || onNftRefresh === 0) {
			return;
		}
		console.log("____fetchAllNFTs____");
		if (allowedFetchNftsPaths.indexOf(pathname) >= 0) {
			console.log("executing");
			if (!basicData.collectionInfo) {
				updateNftsFromCache().then(() => {
					setMarketplaceNFTsState(account, basicData);
					fetchCollectionInfo(account, basicData);
					console.log("Fetching my nfts");

					if (pathname === "/profile") fetchMyNFTs(account);
				});
			} else {
				updateNftsFromCache().then(() => {
					setMarketplaceNFTsState(account, basicData);
					fetchCollectionInfo(account, basicData);
					console.log("Fetching my nfts");

					if (pathname === "/profile") fetchMyNFTs(account);
				});
			}
		} else {
			console.log("returning");
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onNftRefresh, account, pathname]);

	useEffect(() => {
		console.log("Updater ended hooks");
	}, [
		onNftRefresh,
		onPriceRefresh,
		onCacheRefresh,
		onLiquidityRefresh,
		onBalancesRefresh,
	]);
	//Leave this as last to set that the first updater render ended
	useEffect(() => {
		isFirstRef.current = false;
	}, []);

	return null;
}
