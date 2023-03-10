import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { addSuffix } from "../../util/string";
import PoolImage from "../PoolImage";
import PoolName from "../PoolName";
import Text from "../Text";
import {
    LiquiditiesContainer,
    // MyPoolContentItem,
    MyPoolContentRow,
    MyPoolContentRowItem,
    MyPoolItem,
    MyPoolItemRow,
    MyPoolsContainer,
    // Title,
} from "./styled";
import { TPoolConfig } from "../../types/pools";
import { TokenType } from "../../types/tokens";
// import { info } from "console";

type TMyPoolInfo = {
    rewardToken: TokenType;
    apr: string;
    bonded: number;
    pendingReward: number;
    stakingAdress: string;
};

const MyPools: React.FC = () => {
    const history = useHistory();
    const liquidities = useAppSelector((state) => state.liquidities);
    const tokenPrices = useAppSelector((state) => state.tokenPrices);
    const myLiquidities = useMemo(
        () =>
            liquidities.filter((liquidity) => {
                if (!liquidity.bonded) return false;
                const bonded =
                    typeof liquidity.bonded === "number"
                        ? [liquidity.bonded as number]
                        : (liquidity.bonded as number[]);
                const isBonded = bonded.reduce(
                    (result, crrBonded) => result || (crrBonded || 0) > 0,
                    false
                );
                return isBonded;
            }),
        [liquidities]
    );

    // const poolContents = [
    //     { title: "APR", value: (liquidity: TPool) => liquidity.apr },
    //     {
    //         title: "Pool Liquidity",
    //         value: (liquidity: TPool) => addSuffix(liquidity.pool),
    //     },
    //     {
    //         title: "Bonded",
    //         value: (liquidity: TPool) => {
    //             const bonded = liquidity.bonded;
    //             if (!bonded) return null;
    //             let renderInfo = [];
    //             if (typeof bonded === "number") {
    //                 const config = liquidity.config as TPoolConfig;
    //                 renderInfo = [
    //                     {
    //                         bonded,
    //                         rewardToken: config.rewardToken || "",
    //                     },
    //                 ];
    //             } else {
    //                 const config = liquidity.config as TPoolConfig[];
    //                 renderInfo =
    //                     config?.map((item, index) => ({
    //                         bonded: bonded[index],
    //                         rewardToken: item.rewardToken || "",
    //                     })) || [];
    //             }
    //             return (
    //                 <>
    //                     {renderInfo.map((info, index) => (
    //                         <Text
    //                             key={index}
    //                             gap="10px"
    //                             alignItems="center"
    //                             title={"" + info.bonded}
    //                         >
    //                             {info.rewardToken && (
    //                                 <img
    //                                     width={25}
    //                                     alt=""
    //                                     src={`/coin-images/${info.rewardToken.replace(
    //                                         /\//g,
    //                                         ""
    //                                     )}.png`}
    //                                 />
    //                             )}
    //                             <Text
    //                                 flexDirection="column"
    //                                 alignItems="flex-start"
    //                             >
    //                                 <Text color="black" bold>
    //                                     {addSuffix(info.bonded)}
    //                                 </Text>
    //                                 <Text
    //                                     style={{ fontSize: 14 }}
    //                                     color="#787878"
    //                                 >
    //                                     {addSuffix(
    //                                         info.bonded *
    //                                             (liquidity.lpPrice || 0)
    //                                     )}
    //                                     $
    //                                 </Text>
    //                             </Text>
    //                         </Text>
    //                     ))}
    //                 </>
    //             );
    //         },
    //     },
    //     {
    //         title: "Pending Rewards",
    //         value: (liquidity: TPool) => {
    //             const pendingReward = liquidity.pendingReward;
    //             if (!pendingReward) return null;
    //             let renderInfo = [];
    //             if (typeof pendingReward === "number") {
    //                 const config = liquidity.config as TPoolConfig;
    //                 renderInfo = [
    //                     {
    //                         pendingReward,
    //                         rewardToken: config.rewardToken || "",
    //                         rewardTokenPrice: config.rewardToken
    //                             ? tokenPrices[config.rewardToken]?.market_data
    //                                   ?.current_price?.usd || 0
    //                             : 0,
    //                     },
    //                 ];
    //             } else {
    //                 const config = liquidity.config as TPoolConfig[];
    //                 renderInfo =
    //                     config?.map((item, index) => ({
    //                         pendingReward: pendingReward[index],
    //                         rewardToken: item.rewardToken || "",
    //                         rewardTokenPrice: item.rewardToken
    //                             ? tokenPrices[item.rewardToken]?.market_data
    //                                   ?.current_price?.usd || 0
    //                             : 0,
    //                     })) || [];
    //             }
    //             return (
    //                 <>
    //                     {renderInfo.map((info, index) => (
    //                         <Text
    //                             key={index}
    //                             gap="10px"
    //                             alignItems="center"
    //                             title={"" + info.pendingReward}
    //                         >
    //                             {info.rewardToken && (
    //                                 <img
    //                                     width={25}
    //                                     alt=""
    //                                     src={`/coin-images/${info.rewardToken.replace(
    //                                         /\//g,
    //                                         ""
    //                                     )}.png`}
    //                                 />
    //                             )}
    //                             <Text
    //                                 flexDirection="column"
    //                                 alignItems="flex-start"
    //                             >
    //                                 <Text color="black" bold>
    //                                     {addSuffix(info.pendingReward)}
    //                                 </Text>
    //                                 <Text
    //                                     style={{ fontSize: 14 }}
    //                                     color="#787878"
    //                                 >
    //                                     {addSuffix(
    //                                         info.pendingReward *
    //                                             info.rewardTokenPrice
    //                                     )}
    //                                     $
    //                                 </Text>
    //                             </Text>
    //                         </Text>
    //                     ))}
    //                 </>
    //             );
    //         },
    //     },
    // ];

    const displayInfo: TMyPoolInfo[][] = useMemo(
        () =>
            myLiquidities.map((liquidity) => {
                const stakingAdress = liquidity.stakingAddress;
                if (typeof stakingAdress === "string") {
                    const config = liquidity.config as TPoolConfig;
                    const bonded = liquidity.bonded as number;
                    const pendingReward = liquidity.pendingReward as number;
                    const apr = liquidity.apr as string;
                    return [
                        {
                            rewardToken: config.rewardToken as TokenType,
                            bonded,
                            pendingReward,
                            apr,
                            stakingAdress,
                        },
                    ];
                } else {
                    const config = liquidity.config as TPoolConfig[];
                    const bonded = liquidity.bonded as number[];
                    const pendingReward = liquidity.pendingReward as number[];
                    const apr = liquidity.apr as string[];
                    return (stakingAdress || [])
                        .map((address, index) => ({
                            rewardToken: config[index].rewardToken as TokenType,
                            bonded: bonded[index],
                            pendingReward: pendingReward[index],
                            apr: apr[index],
                            stakingAdress: address,
                        }))
                        .filter((item) => item.bonded);
                }
            }),
        [myLiquidities]
    );
    console.log("debug", displayInfo);

    return (
        <LiquiditiesContainer>
            {/* <Title>My Pools</Title> */}
            <MyPoolsContainer>
                {myLiquidities?.map((liquidity, liquidityIndex: number) => (
                    <MyPoolItem
                        key={liquidityIndex}
                        onClick={() =>
                            liquidity.stakingAddress &&
                            history.push(`/bond?poolId=${liquidity.id}`)
                        }
                    >
                        <MyPoolItemRow>
                            <PoolImage
                                token1={liquidity.token1}
                                token2={liquidity.token2}
                            />
                            <PoolName pool={liquidity} />
                        </MyPoolItemRow>
                        <MyPoolContentRow>
                            {/* {poolContents.map((content, contentIndex) => (
                                <MyPoolContentItem key={contentIndex}>
                                    <Text bold color="#c5c5c5">
                                        {content.title}
                                    </Text>
                                    <Text
                                        bold
                                        color="black"
                                        alignItems="center"
                                    >
                                        {content.value(liquidity)}
                                    </Text>
                                </MyPoolContentItem>
                            ))} */}
                            <div />
                            <Text bold color="#c5c5c5">
                                APR
                            </Text>
                            <Text bold color="#c5c5c5">
                                Bonded
                            </Text>
                            <Text bold color="#c5c5c5">
                                Pending Rewards
                            </Text>
                            {displayInfo[liquidityIndex].map((infos) => (
                                <MyPoolContentRowItem key={infos.stakingAdress}>
                                    <img
                                        width={25}
                                        alt=""
                                        src={`/coin-images/${infos.rewardToken.replace(
                                            /\//g,
                                            ""
                                        )}.png`}
                                    />
                                    <Text
                                        bold
                                        color="black"
                                        alignItems="center"
                                    >
                                        {infos.apr}
                                    </Text>
                                    <Text
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Text color="black" bold>
                                            {addSuffix(infos.bonded)}
                                        </Text>
                                        <Text
                                            style={{ fontSize: 14 }}
                                            color="#787878"
                                        >
                                            {addSuffix(
                                                infos.bonded *
                                                    (liquidity.lpPrice || 0)
                                            )}
                                            $
                                        </Text>
                                    </Text>
                                    <Text
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Text color="black" bold>
                                            {addSuffix(infos.pendingReward)}
                                        </Text>
                                        <Text
                                            style={{ fontSize: 14 }}
                                            color="#787878"
                                        >
                                            {addSuffix(
                                                infos.pendingReward *
                                                    (tokenPrices[
                                                        infos.rewardToken
                                                    ]?.market_data
                                                        ?.current_price?.usd ||
                                                        0)
                                            )}
                                            $
                                        </Text>
                                    </Text>
                                </MyPoolContentRowItem>
                            ))}
                        </MyPoolContentRow>
                    </MyPoolItem>
                ))}
            </MyPoolsContainer>
        </LiquiditiesContainer>
    );
};

export default MyPools;
