import { useEffect, useState } from "react";

import useRefresh from "../hook/useRefresh";
import { useAppSelector } from "../app/hooks";
import useFetch from "../hook/useFetch";
import getQuery, { BACKEND_URL } from "../util/useAxios";

export default function Updater(): null {
	const [basicData, setBasicData] = useState<any>({});
	const {
		nftRefresh,
		// priceRefresh,
	} = useRefresh();
	const account = useAppSelector((state) => state?.accounts?.keplrAccount);
	const { fetchAllNFTs, clearAllNFTs, fetchLiquidities, fetchOtherTokenPrice } =
		useFetch();

	useEffect(() => {
		(async () => {
			const data = await getQuery({
				url: `${BACKEND_URL}/cache?fields=collectionInfo,collectionTraits,marketplaceNFTs,liquiditiesInfo`,
			});
			setBasicData(data || {});
		})();
	}, [nftRefresh]);

	useEffect(() => {
		fetchOtherTokenPrice();
	}, [fetchOtherTokenPrice, nftRefresh]);

	useEffect(() => {
		fetchLiquidities(account, basicData.liquiditiesInfo);
	}, [account, basicData.liquiditiesInfo, fetchLiquidities, nftRefresh]);

	useEffect(() => {
		fetchAllNFTs(account, basicData);
		if (!account) {
			clearAllNFTs();
		}
	}, [nftRefresh, account, basicData, fetchAllNFTs, clearAllNFTs]);

	return null;
}
