import React from "react";
import { IPoolName } from "./type";
import { Wrapper } from "./styled";
import { getTokenName } from "../../types/tokens";
import { UnverifiedBadge, VerifiedBadge } from "../SvgIcons";
import ReactTooltip from "react-tooltip";

const PoolName: React.FC<IPoolName> = ({ pool }) => {
	return (
		<Wrapper poolId={pool.id}>{`${getTokenName(pool.token1)}-${getTokenName(
				pool.token2
			)}`}
			<ReactTooltip
				id="tooltip-verified"
				place="right"
				effect="float"
			>
				Verified
			</ReactTooltip>
			<ReactTooltip
				id="tooltip-not-verified"
				place="right"
				effect="float"
			>
				Not verified
			</ReactTooltip>
			{pool.isVerified ? <VerifiedBadge data-for="tooltip-verified" data-tip />: <UnverifiedBadge data-for="tooltip-not-verified" data-tip/>} 
		</Wrapper>
	);
};

export default PoolName;
