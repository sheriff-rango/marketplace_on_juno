import { useEffect, useState } from "react";
import { getDexStatus } from "../util/useAxios";
import { convertStringToNumber } from "../util/string";

const useDexStatus = () => {
	const [dexStatus, setDexStatus] = useState<{
		txNumber: number;
		tradingVolume: number;
		burningVolume: number;
	}>({
		txNumber: 0,
		tradingVolume: 0,
		burningVolume: 0,
	});

	useEffect(() => {
		(async () => {
			const data = await getDexStatus();
			const fetchedDexStatus = data[0] || {};
			const txNumber = convertStringToNumber(fetchedDexStatus.txNumber);
			const tradingVolume =
				convertStringToNumber(fetchedDexStatus.tradingVolume) / 1e6;
			const burningVolume =
				convertStringToNumber(fetchedDexStatus.burningVolume) / 1e6;
			setDexStatus({
				txNumber,
				tradingVolume,
				burningVolume,
			});
		})();
	}, []);

	return dexStatus;
};

export default useDexStatus;
