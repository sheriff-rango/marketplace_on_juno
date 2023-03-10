import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Flex from "../Flex";
import { IModal } from "../Modal";
import PoolImage from "../PoolImage";
import PoolName from "../PoolName";
import Text from "../Text";
import useContract from "../../hook/useContract";
import useRefresh from "../../hook/useRefresh";
import { TPool, TPoolConfig } from "../../types/pools";
import { getTokenName, TokenType } from "../../types/tokens";
import { addSuffix } from "../../util/string";
import {
    AprText,
    BondAmountInputer,
    ManageBondModalWrapper as Wrapper,
    ModalBody,
    ModalHeader,
    ModalTab,
    ModalTabContainer,
    StyledButton as Button,
    UnbondHistoryContainer,
    UnbondHistoryTable,
    UnbondingPeriodContainer,
    UnbondingPeriodItem,
    UnbondItem,
} from "./styled";
import { useAppSelector } from "../../app/hooks";
import moment from "moment";

interface IMangeBondModal extends IModal {
    liquidity: TPool;
}

enum ModalTabs {
    BOND = "Bond",
    UNBOND = "Unbond",
}

const AutoBondAmounts = [0.25, 0.5, 0.75, 1];

const fetchingLimit = 20;

type TUnbondingPeriodItem = {
    period: number;
    contractAddress: string;
};

type TUnbondingPeriod = { [key in TokenType]: TUnbondingPeriodItem[] };

type TManageBondInfo = {
    unbondingPeriod?: TUnbondingPeriod;
    bondedLpByRewardToken?: {
        rewardToken: string;
        bonded: any;
    }[];
    bondedLpByContract?: {
        [key: string]: number;
    };
    aprByContract?: {
        [key: string]: string;
    };
};

const ManageBondModal: React.FC<IMangeBondModal> = ({
    isOpen,
    onClose,
    liquidity,
}) => {
    const [isAvailableRedeem, setIsAvailableRedeem] = useState(false);
    const [unbondHistory, setUnbondHistory] = useState<any[]>([]);
    const [selectedTab, setSelectedTab] = useState(ModalTabs.BOND);
    const [bondAmount, setBondAmount] = useState<number | string>();
    const [unbondAmount, setUnbondAmount] = useState<number | string>();
    const [isPendingAction, setIsPendingAction] = useState(false);
    const [isPendingRedeem, setIsPendingRedeem] = useState(false);
    const [selectedStakingContract, setSelectedStakingContract] = useState("");

    const account = useAppSelector((state) => state?.accounts?.keplrAccount);
    const { runExecute, runQuery } = useContract();
    const { refreshPrice } = useRefresh();

    useEffect(() => {
        if (!liquidity) return;
        const stakingAddress = liquidity.stakingAddress;
        if (!account || !stakingAddress) return;
        if (typeof stakingAddress === "string") {
            setSelectedStakingContract(stakingAddress);
        }
        const now = new Date();

        (async () => {
            let fetchedUnbondHistory: any[] = [],
                redeemAvailability = false;
            const fetchUnbondHistory = async (
                address: string,
                config: TPoolConfig,
                startAfter = 0
            ) => {
                if (!address) return;
                const result = await runQuery(address, {
                    unbonding_info: {
                        staker: account?.address,
                        start_after: startAfter,
                        limit: fetchingLimit,
                    },
                });
                const fetchedResult = result?.unbonding_info || [];
                fetchedUnbondHistory = fetchedUnbondHistory.concat(
                    fetchedResult.map((resultItem: any) => {
                        const unlockTime = new Date(
                            resultItem.time * 1e3 + (config?.lockDuration || 0)
                        );
                        redeemAvailability =
                            redeemAvailability ||
                            Number(unlockTime) < Number(now);

                        let remainTimeString = "Ready for Redeem";
                        if (Number(unlockTime) > Number(now)) {
                            const duration = moment.duration(
                                moment(unlockTime).diff(now)
                            );
                            const days = duration.days();
                            const hours = duration.hours();
                            if (!days && !hours) {
                                remainTimeString = "Less than an hour";
                            } else {
                                remainTimeString = `${
                                    hours ? `${hours} hours` : ""
                                } ${
                                    days
                                        ? `${hours ? " and " : ""}${days} days`
                                        : ""
                                }`;
                            }
                        }
                        return {
                            ...resultItem,
                            remainTimeString,
                            rewardToken: config.rewardToken,
                        };
                    })
                );
                if (fetchedResult.length === fetchingLimit) {
                    await fetchUnbondHistory(
                        address,
                        config,
                        fetchedResult[fetchedResult.length - 1].time
                    );
                }
            };
            if (typeof stakingAddress === "string") {
                await fetchUnbondHistory(
                    stakingAddress,
                    liquidity.config as TPoolConfig
                );
                setUnbondHistory(fetchedUnbondHistory);
                setIsAvailableRedeem(redeemAvailability);
            } else {
                stakingAddress.forEach(async (address, index) => {
                    await fetchUnbondHistory(
                        address,
                        ((liquidity.config || []) as TPoolConfig[])[index]
                    );
                    setUnbondHistory(fetchedUnbondHistory);
                    setIsAvailableRedeem(redeemAvailability);
                });
            }
        })();
    }, [account, liquidity, runQuery]);

    useEffect(() => {
        setBondAmount("");
        setUnbondAmount("");
    }, [selectedTab]);

    const {
        unbondingPeriod,
        bondedLpByRewardToken,
        bondedLpByContract,
        aprByContract,
    }: TManageBondInfo = useMemo(() => {
        if (!liquidity) return {};
        const stakingAddresses = liquidity.stakingAddress;
        if (!stakingAddresses) return {};
        let unbondingPeriodResult: TUnbondingPeriod;
        if (typeof stakingAddresses === "string") {
            const config = liquidity.config as TPoolConfig;
            const bonded = (liquidity.bonded || 0) as number;
            return {
                bondedLpByRewardToken: [
                    {
                        rewardToken: config.rewardToken as TokenType,
                        bonded,
                    },
                ],
                bondedLpByContract: {
                    [stakingAddresses]: bonded,
                },
                aprByContract: {
                    [stakingAddresses]: liquidity.apr as string,
                },
            };
        } else {
            unbondingPeriodResult = {} as TUnbondingPeriod;
            let aprByContractResult: { [key: string]: string } = {};
            const config = liquidity.config as TPoolConfig[];
            const bonded = (liquidity.bonded || []) as number[];
            const groupedBonded = bonded.reduce(
                (result: any, bondedItem, index) => {
                    const crrRewardToken = config[index]
                        .rewardToken as TokenType;
                    return {
                        ...result,
                        [crrRewardToken]:
                            (result[crrRewardToken] || 0) + bondedItem,
                    };
                },
                {}
            );
            stakingAddresses.forEach((stakingAddress, index) => {
                const crrConfig = config[index];
                const rewardToken = crrConfig.rewardToken as TokenType;
                unbondingPeriodResult[rewardToken] = [
                    ...(unbondingPeriodResult[rewardToken] || []),
                    {
                        period: crrConfig.lockDuration / 1000 / 60 / 60 / 24,
                        contractAddress: stakingAddress,
                    },
                ];
                aprByContractResult[stakingAddress] = liquidity.apr[index];
            });
            return {
                unbondingPeriod: Object.keys(unbondingPeriodResult).reduce(
                    (orderedResult: TUnbondingPeriod, currentToken) => {
                        const crrResult =
                            unbondingPeriodResult[currentToken as TokenType];
                        return {
                            ...orderedResult,
                            [currentToken as TokenType]: crrResult.sort(
                                (data1, data2) =>
                                    data1.period > data2.period ? 1 : -1
                            ),
                        };
                    },
                    {} as TUnbondingPeriod
                ),
                bondedLpByRewardToken: Object.keys(groupedBonded).map(
                    (rewardToken) => ({
                        rewardToken,
                        bonded: groupedBonded[rewardToken],
                    })
                ),
                bondedLpByContract: stakingAddresses.reduce(
                    (result, address, index) => ({
                        ...result,
                        [address]: bonded[index],
                    }),
                    {}
                ),
                aprByContract: aprByContractResult,
            };
        }
    }, [liquidity]);

    const handleCloseModal = () => {
        if (isPendingAction || isPendingRedeem) return;
        setTimeout(() => {
            setBondAmount("");
            setUnbondAmount("");
        }, 300);
        onClose();
    };

    const handleChangeBondAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (isNaN(Number(value))) return;
        if (selectedTab === ModalTabs.BOND) {
            setBondAmount(value);
        } else {
            setUnbondAmount(value);
        }
    };

    const handleClickBond = async () => {
        if (isPendingAction || !bondAmount) return;
        if (!selectedStakingContract) {
            toast.error("Please select the unbonding period!");
            return;
        }
        if (Number(bondAmount) > (liquidity.balance || 0)) {
            toast.error("Invalid Amount");
            return;
        }
        setIsPendingAction(true);
        try {
            await runExecute(liquidity.lpAddress, {
                send: {
                    contract: selectedStakingContract,
                    amount: "" + Math.floor(Number(bondAmount) * 1e6),
                    msg: btoa(
                        JSON.stringify({
                            bond: {},
                        })
                    ),
                },
            });
            toast.success("Successfully bonded!");
            refreshPrice();
        } catch (err) {
            console.log(err);
            toast.error("Bond Failed!");
        } finally {
            setIsPendingAction(false);
        }
    };

    const handleClickUnBond = async () => {
        if (!selectedStakingContract) return;
        if (isPendingAction || !unbondAmount) return;
        if (Number(unbondAmount) > (liquidity.bonded || 0)) {
            toast.error("Invalid Amount");
            return;
        }
        setIsPendingAction(true);
        try {
            await runExecute(selectedStakingContract, {
                unbond: {
                    amount: "" + Math.floor(Number(unbondAmount) * 1e6),
                },
            });
            toast.success("Successfully unbonded!");
            refreshPrice();
        } catch (err) {
            console.log(err);
            toast.error("Unbond Failed!");
        } finally {
            setIsPendingAction(false);
        }
    };

    const handleClickRedeem = async () => {
        const stakingAddress = liquidity.stakingAddress;
        if (isPendingRedeem || !isAvailableRedeem || !stakingAddress) return;
        const stakingAddressArray =
            typeof stakingAddress === "string"
                ? [stakingAddress]
                : stakingAddress;
        const queries = stakingAddressArray.map((address) =>
            runExecute(address, {
                redeem: {},
            })
        );
        setIsPendingRedeem(true);
        Promise.all(queries)
            .then(() => {
                toast.success("Successfully Redeem!");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Redeem Failed!");
            })
            .finally(() => {
                refreshPrice();
                setIsPendingRedeem(false);
            });
    };

    return !liquidity ? null : (
        <Wrapper isOpen={isOpen} onClose={handleCloseModal}>
            <ModalHeader>
                <PoolImage
                    token1={liquidity.token1}
                    token2={liquidity.token2}
                />
                <PoolName pool={liquidity} />
                <Text bold fontSize="22px" color="black">
                    Manage Bonding
                </Text>
            </ModalHeader>
            <ModalBody>
                <Flex
                    width="100%"
                    flexWrap="wrap"
                    gap="10px"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <ModalTabContainer isRight={selectedTab !== ModalTabs.BOND}>
                        {(
                            Object.keys(ModalTabs) as Array<
                                keyof typeof ModalTabs
                            >
                        ).map((key, index) => (
                            <ModalTab
                                key={index}
                                checked={selectedTab === ModalTabs[key]}
                                onClick={() =>
                                    !isPendingAction &&
                                    !isPendingRedeem &&
                                    setSelectedTab(ModalTabs[key])
                                }
                            >
                                {ModalTabs[key]}
                            </ModalTab>
                        ))}
                    </ModalTabContainer>
                    {unbondingPeriod && (
                        <Flex flexDirection="column">
                            {Object.keys(unbondingPeriod).map(
                                (rewardToken, rewardTokenIndex) => {
                                    return (
                                        <UnbondingPeriodContainer
                                            key={rewardTokenIndex}
                                        >
                                            <img
                                                width={25}
                                                alt=""
                                                src={`/coin-images/${rewardToken.replace(
                                                    /\//g,
                                                    ""
                                                )}.png`}
                                            />
                                            {unbondingPeriod[
                                                rewardToken as TokenType
                                            ].map((period, index) => (
                                                <UnbondingPeriodItem
                                                    key={index}
                                                    selected={
                                                        period.contractAddress ===
                                                        selectedStakingContract
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedStakingContract(
                                                            period.contractAddress
                                                        );
                                                    }}
                                                >{`${period.period} ${
                                                    period.period > 1
                                                        ? "days"
                                                        : "day"
                                                }`}</UnbondingPeriodItem>
                                            ))}
                                        </UnbondingPeriodContainer>
                                    );
                                }
                            )}
                        </Flex>
                    )}
                </Flex>
                <Text
                    color="black"
                    bold
                    fontSize="18px"
                    justifyContent="flex-start"
                >
                    {selectedTab === ModalTabs.BOND ? (
                        <>
                            {`Available LP: ${addSuffix(
                                liquidity.balance || 0
                            )} ${getTokenName(liquidity.token1)}-${getTokenName(
                                liquidity.token2
                            )}`}
                            {aprByContract && (
                                <AprText>
                                    {aprByContract[selectedStakingContract]}
                                </AprText>
                            )}
                        </>
                    ) : (
                        <Flex alignItems="center" gap="10px">
                            <Text color="black" bold>
                                LP Bonded
                            </Text>
                            {bondedLpByRewardToken?.map((bondedItem, index) => (
                                <Text
                                    key={index}
                                    color="black"
                                    alignItems="center"
                                    bold
                                >
                                    {addSuffix(bondedItem.bonded || 0)} in{" "}
                                    <img
                                        width={25}
                                        alt=""
                                        src={`/coin-images/${bondedItem.rewardToken.replace(
                                            /\//g,
                                            ""
                                        )}.png`}
                                    />
                                </Text>
                            ))}
                        </Flex>
                    )}
                </Text>
                <Flex
                    width="100%"
                    justifyContent="space-evenly"
                    margin="20px 0"
                >
                    {AutoBondAmounts.map((amount, index) => (
                        <Text
                            key={index}
                            color="black"
                            cursor="pointer"
                            onClick={() =>
                                selectedTab === ModalTabs.BOND
                                    ? setBondAmount(
                                          (liquidity.balance || 0) * amount
                                      )
                                    : setUnbondAmount(
                                          (bondedLpByContract
                                              ? bondedLpByContract[
                                                    selectedStakingContract
                                                ] || 0
                                              : 0) * amount
                                      )
                            }
                        >{`${amount * 100}%`}</Text>
                    ))}
                </Flex>
                <BondAmountInputer
                    hasError={
                        Number(
                            (selectedTab === ModalTabs.BOND
                                ? bondAmount
                                : unbondAmount) || 0
                        ) >
                        ((selectedTab === ModalTabs.BOND
                            ? liquidity.balance
                            : bondedLpByContract
                            ? bondedLpByContract[selectedStakingContract]
                            : 0) || 0)
                    }
                    value={
                        selectedTab === ModalTabs.BOND
                            ? bondAmount
                            : unbondAmount
                    }
                    onChange={handleChangeBondAmount}
                />
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    gap="20px"
                    margin="10px 0 0 0"
                >
                    {selectedTab === ModalTabs.BOND ? (
                        <>
                            <Button
                                onClick={() => {
                                    handleClickBond();
                                }}
                            >
                                {isPendingAction ? "Bonding" : "Bond"}
                            </Button>
                        </>
                    ) : (
                        <Flex alignItems="center" gap="30px">
                            <Button onClick={handleClickUnBond}>
                                {isPendingAction ? "Unbonding" : "Unbond"}
                            </Button>
                        </Flex>
                    )}
                </Flex>
                {selectedTab === ModalTabs.UNBOND &&
                    unbondHistory.length > 0 && (
                        <UnbondHistoryContainer>
                            <Flex justifyContent="flex-end">
                                <Button
                                    margin="20px 0"
                                    onClick={handleClickRedeem}
                                >
                                    {isPendingRedeem ? "Redeeming" : "Redeem"}
                                </Button>
                            </Flex>
                            <UnbondHistoryTable>
                                {unbondHistory.map((history, index) => {
                                    return (
                                        <UnbondItem key={index}>
                                            <Text
                                                color="black"
                                                alignItems="center"
                                            >
                                                {addSuffix(
                                                    (history.amount || 0) / 1e6
                                                )}
                                                {" from "}
                                                {history.rewardToken && (
                                                    <img
                                                        width={25}
                                                        alt=""
                                                        src={`/coin-images/${history.rewardToken.replace(
                                                            /\//g,
                                                            ""
                                                        )}.png`}
                                                    />
                                                )}
                                            </Text>
                                            <Text color="black">
                                                {history.remainTimeString}
                                            </Text>
                                        </UnbondItem>
                                    );
                                })}
                            </UnbondHistoryTable>
                        </UnbondHistoryContainer>
                    )}
            </ModalBody>
        </Wrapper>
    );
};

export default ManageBondModal;
