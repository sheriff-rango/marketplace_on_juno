import { TPool } from "../types/pools";
import { TokenType } from "../types/tokens";

type TPoolUserDetailInfo = {
    rewardToken?: TokenType;
    pendingReward: number;
    pendingRewards: number[];
    bonded: number;
    stakingAddress: string[];
    priceInUsd: number;
};

export const getPoolUserDetails = (
    pool: TPool,
    tokenPrices: any
): TPoolUserDetailInfo[] => {
    const { config, stakingAddress } = pool;
    if (Array.isArray(config)) {
        let groupedByRewardToken: { [key in TokenType]: TPoolUserDetailInfo } =
            config.reduce((result: any, crrConfig, index) => {
                const crrRewardToken = crrConfig.rewardToken as TokenType;
                const crrPendingReward =
                    ((pool.pendingReward || []) as number[])[index] || 0;
                const crrTokenPriceInUsd = crrRewardToken
                    ? tokenPrices[crrRewardToken]?.market_data.current_price
                          ?.usd || 0
                    : 0;
                const crrBonded = ((pool.bonded || []) as number[])[index];
                return {
                    ...result,
                    [crrRewardToken]: {
                        rewardToken: crrRewardToken,
                        pendingReward:
                            (result[crrRewardToken]?.pendingReward || 0) +
                            crrPendingReward,
                        pendingRewards: [
                            ...(result[crrRewardToken]?.pendingRewards || []),
                            crrPendingReward,
                        ],
                        bonded:
                            (result[crrRewardToken]?.bonded || 0) + crrBonded,
                        stakingAddress: [
                            ...(result[crrRewardToken]?.stakingAddress || []),
                            (stakingAddress as string[])[index],
                        ],
                        priceInUsd:
                            (result[crrRewardToken]?.priceInUsd || 0) +
                            crrPendingReward * crrTokenPriceInUsd,
                    },
                };
            }, {});
        return Object.values(groupedByRewardToken);
        // return config.map((item, index) => {
        //     const pendingReward =
        //         ((pool.pendingReward || []) as number[])[index] || 0;
        //     const tokenPriceInUsd = item.rewardToken
        //         ? tokenPrices[item.rewardToken]?.market_data.current_price
        //               ?.usd || 0
        //         : 0;
        //     return {
        //         rewardToken: item.rewardToken,
        //         pendingReward,
        //         bonded: ((pool.bonded || []) as number[])[index],
        //         stakingAddress: ((pool.stakingAddress || []) as string[])[
        //             index
        //         ],
        //         priceInUsd: pendingReward * tokenPriceInUsd,
        //     };
        // });
    } else {
        const pendingReward = (pool.pendingReward || 0) as number;
        const tokenPriceInUsd = config?.rewardToken
            ? tokenPrices[config.rewardToken]?.market_data.current_price?.usd ||
              0
            : 0;
        return [
            {
                rewardToken: config?.rewardToken,
                pendingReward,
                pendingRewards: [pendingReward],
                bonded: (pool.bonded || 0) as number,
                stakingAddress: [(pool.stakingAddress || "") as string],
                priceInUsd: pendingReward * tokenPriceInUsd,
            },
        ];
    }
};
