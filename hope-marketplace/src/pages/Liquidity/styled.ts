import styled, { css } from "styled-components";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import { GearIcon } from "../../components/SvgIcons";
import Text from "../../components/Text";

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const LiquidityHeader = styled.div`
	width: 100%;
`;

export const LiquidityList = styled.div`
	background: white;
	border: 1px solid #02e296;
	border-radius: 15px;
	width: 430px;
`;

export const ListHeader = styled.div`
	position: relative;
	padding: 20px;
	border-bottom: 1px solid #000;
	position: relative;
	.remove-button {
		position: absolute;
		right: 10px;
		top: 10px;
		color: #02e296;
		cursor: pointer;
	}
`;

export const StyledGearIcon = styled(GearIcon)`
	position: absolute;
	right: 20px;
	top: 20px;
	fill: black;
	cursor: pointer;
`;

export const ListBody = styled.div`
	min-height: 300px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const MessageContainer = styled.div`
	width: 100%;
	padding: 30px 0 40px;
	margin: auto;
	color: #787878;
	background-color: rgba(217, 217, 217, 35);
`;

export const ConnectWalletButton = styled(Button)`
	width: 350px;
	background: #02e296;
	border: 1px solid black;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 15px;
	color: white;
	font-weight: bold;
	font-size: 20px;
`;

export const LiquiditiesContainer = styled.div`
	width: 100%;
	margin: 50px 0 100px;
`;

export const LiquiditiesTable = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	align-items: center;
`;

export const LiquiditiesTableHeaderRow = styled.div`
	display: contents;
`;

export const LiquidityTableContent = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 95px;
	background: white;
`;

const tableBodyBorderColor = "#02e296";
const tableBorderRadius = "15px";

export const LiquidityTableHeader = styled(Text)`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 50px;
	margin-bottom: 10px;
	font-weight: bold;
	background: rgba(15, 206, 137, 0.4);
	&:first-child {
		border-bottom-left-radius: ${tableBorderRadius};
		border-top-left-radius: ${tableBorderRadius};
	}
	&:last-child {
		border-bottom-right-radius: ${tableBorderRadius};
		border-top-right-radius: ${tableBorderRadius};
	}
`;

export const LiquiditiesTableBody = styled.div`
	display: contents;
	color: black;
	border: 1px solid #02e296;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	margin-top: 20px;
`;

export const LiquiditiesTableRow = styled.div`
	display: contents;
	${LiquidityTableContent} {
		border-bottom: 1px solid #d9d9d9;
		&:first-child {
			border-left: 1px solid ${tableBodyBorderColor};
		}
		&:last-child {
			border-right: 1px solid ${tableBodyBorderColor};
		}
	}
	&:first-child {
		${LiquidityTableContent} {
			border-top: 1px solid ${tableBodyBorderColor};
			&:first-child {
				border-top-left-radius: ${tableBorderRadius};
			}
			&:last-child {
				border-top-right-radius: ${tableBorderRadius};
			}
		}
	}
	&:last-child {
		${LiquidityTableContent} {
			border-bottom: 1px solid ${tableBodyBorderColor};
			&:first-child {
				border-bottom-left-radius: ${tableBorderRadius};
			}
			&:last-child {
				border-bottom-right-radius: ${tableBorderRadius};
			}
		}
	}
`;

export const StyledText = styled(Text)`
	color: black;
`;

export const LiquidityTableControlPanel = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;
`;

export const LiquidityTableTabContainer = styled.div<{ isRight: boolean }>`
	display: flex;
	align-items: center;
	position: relative;
	&:before {
		content: "";
		position: absolute;
		background: #02e296;
		height: 100%;
		width: 165px;
		border-radius: 15px;
		transition: all 0.5s;
		${({ isRight }) =>
			isRight
				? css`
						left: 143px;
						width: 138px;
				  `
				: css`
						left: 0;
				  `}
	}
`;

export const LiquidityTableTab = styled(Text)<{ checked: boolean }>`
	cursor: pointer;
	border-radius: 15px;
	position: relative;
	font-size: 18px;
	font-weight: bold;
	padding: 10px 30px;
	text-align: center;
	color: ${({ checked }) => (checked ? "white" : "#7e7e7e")};
	background: rgba(15, 206, 137, 0.4);
	/* width: 165px; */
	&:last-child {
		left: -20px;
		/* width: 140px; */
	}
`;

export const LiquidityTableSearchInputer = styled.input`
	height: 40px;
	width: 80px;
	background: rgba(15, 206, 137, 0.4);
	opacity: 0.3;
	transition: all 0.5s;
	text-align: right;
	border-radius: 15px;
	border: none;
	font-size: 16px;
	padding: 0 20px;
	color: white;
	&:focus {
		width: 200px;
		opacity: 1;
	}
	&::placeholder {
		color: #cbcaca;
	}
`;

export const MyPoolsContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 20px;
`;

export const MyPoolItem = styled.div`
	background: rgba(2, 226, 150, 0.1);
	border: 1px solid #02e296;
	border-radius: 45px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	gap: 20px;
`;

export const MyPoolItemRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 20px;
`;

export const MyPoolContentItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
`;

export const AddRemoveLiquidityWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
	padding: 10px;
	box-sizing: border-box;
	position: relative;
	& > svg {
		cursor: pointer;
		position: absolute;
		right: 5px;
		top: 5px;
	}
`;

export const AddRemoveLiquidityFooter = styled(Flex)`
	justify-content: center;
	align-items: center;
	width: 100%;
	padding: 10px;
`;

export const AddRemoveLiquidityActionButton = styled(Button)`
	width: 350px;
	background: rgba(2, 226, 150, 0.15);
	border: 1px solid black;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 15px;
	color: black;
	font-weight: bold;
	font-size: 20px;
`;

export const SelectAddPoolItem = styled.div<{ checked?: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px;
	${({ checked }) =>
		checked &&
		css`
			background-color: rgba(2, 226, 150, 0.5);
		`}
	&:hover {
		background-color: rgba(2, 226, 150, 0.15);
	}
`;

export const SelectPoolContainer = styled.div`
	display: flex;
	${SelectAddPoolItem} {
		&:hover {
			background-color: unset;
		}
	}
`;

export const TokenAmountInputerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	padding: 10px;
`;

export const TokenAmountInput = styled(Flex)`
	width: 100%;
	height: 70px;
	align-items: center;
	justify-content: space-between;
	padding: 5px 10px;
	background-color: rgba(2, 226, 150, 0.15);
	border: 1px solid black;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 15px;
	box-sizing: border-box;

	& > input {
		width: 50%;
		height: 100%;
		border: none;
		background: transparent;
		text-align: right;
	}
`;

export const TokenImage = styled(Flex)<{ horizontalName?: boolean }>`
	flex-direction: ${({ horizontalName }) =>
		horizontalName ? "row" : "column"};
	align-items: center;
	gap: 2px;
	font-weight: bold;
	font-size: 14px;
	width: max-content;

	& > img {
		width: 40px;
		height: 40px;
	}
`;