import React, { useMemo } from "react";
import ExploreHeader from "../../components/ExploreHeader";
import PageWrapper from "../../components/PageWrapper";
import Text from "../../components/Text";
import useMatchBreakpoints from "../../hook/useMatchBreakpoints";
import { getResponsiveSize } from "../../util/basic";
import { Panel, StyledImg } from "../Home/styled";

const Stake: React.FC = () => {

	const breakpoints = useMatchBreakpoints();
	const fontSizes = useMemo(() => {
		const { isXs, isSm } = breakpoints;
		if (isXs || isSm) {
			return {
				size1: "34px",
				size2: "23px",
				size3: "17px",
			};
		}
		let matchedKey = "";
		Object.keys(breakpoints).forEach((key) => {
			if (breakpoints[key]) matchedKey = key;
		});
		matchedKey = matchedKey.replace(/is/g, "").toLowerCase();
		const responsiveSize = getResponsiveSize("xxxxl", {
			size1: 100,
			size2: 45,
			size3: 25,
		});
		return {
			size1: `${Math.floor(responsiveSize[matchedKey]?.size1)}px`,
			size2: `${Math.floor(responsiveSize[matchedKey]?.size2)}px`,
			size3: `${Math.floor(responsiveSize[matchedKey]?.size3)}px`,
		};
	}, [breakpoints]);

	return (
		<PageWrapper>
			<ExploreHeader
				title="Stake"
				tabs={[
					{ title: "Bond", url: "/bond" },
					{ title: "Stake", url: "/stake" },
					// { title: "Airdrop", url: "/airdrop" },
				]}
			/>
			<Panel fill>
				<StyledImg
					src="/characters/character_004.png"
					alt=""
					width="35%"
					float="left"
					margin="0 20px"
				/>
				<Text
					fontSize={fontSizes.size2}
					justifyContent="flex-start"
					margin="30px 0 0 0"
				>
					<Text fontSize={fontSizes.size1} bold color="#02e296">
						Coming soon
					</Text>
				</Text>
			</Panel>
		</PageWrapper>
	);
};

export default Stake;
