import React from "react";
import { useAppSelector } from "../../app/hooks";
import { TPool } from "../../types/pools";
import { TokenStatus, TokenType } from "../../types/tokens";
import { addSuffix } from "../../util/string";
import Flex from "../Flex";
import Text from "../Text";

const TVL: React.FC<{pool: TPool}> = ({pool}) => {
	const tokenPrices = useAppSelector((state) => state.tokenPrices);
    if(!tokenPrices[TokenType.HOPERS])
    {
        return null;
    }
    const token1Reserve =
        pool.token1Reserve /
            Math.pow(
                10,
                TokenStatus[pool.token1].decimal || 6
            );
    const token1Price =
        tokenPrices[pool.token1]?.market_data
            ?.current_price?.usd || 0;
    
    return (
        <Flex flexDirection="column">
            <Text color="black">
                {`${addSuffix(token1Reserve * 2)}`}
            </Text>
            <Text fixedFontSize=".8em" color="#777">
                {`$ ${addSuffix(token1Reserve * token1Price * 2)}`}
            </Text>
        </Flex>
    )
};

export default TVL;
