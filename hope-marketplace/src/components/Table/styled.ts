import styled, { css, keyframes } from "styled-components";
import Button from "../Button";
import Text from "../Text";

export const Wrapper = styled.div`
	width: 100%;
`;
export const TablePaginator = 
styled.div`
	width: 100%;
	margin-top: 8px;
`;

export const PaginatorButton = styled(Button)<{active?: boolean, enabled?: boolean}>`
	position: relative;
	width: 40px;
	height: 40px;
	margin: 4px;
	border: ${({ enabled, theme }) => (enabled ? `1px solid ${theme.colors.flatBackgroundColor}` : "1px solid #dadada")};
	pointer-events: ${({ enabled }) => (enabled ? "all" : "none")};
	background-color: ${({ active, enabled, theme }) => (active ? theme.colors.flatBackgroundColor : enabled ? "white" : "white")};
	color: ${({ active, enabled, theme }) => (active ? "white" : enabled ? theme.colors.flatBackgroundColor : "#dadada")};
	font-weight: ${({ active }) => (active ? "bold" : "")};
	border-radius: 100%;
	font-size: 16px;
	text-align: center;
`;
export const TableControlPanel = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;
	width: 100%;
	overflow: auto;
`;

export const TableTabContainer = styled.div<{ left: number; width: number, first: boolean, last: boolean }>`
	display: flex;
	align-items: center;
	position: relative;

	&:before {
		content: "";
		position: absolute;
		background: ${({ theme }) => (theme.colors.flatBackgroundColor)};
		height: 100%;
		transition: all 0.2s;
	
		${({ left, width }) => css`
			left: ${left}px;
			width: ${width}px;
		`}

		border-top-left-radius: ${({ first }) => (first ? '15px' : '0px')};
		border-bottom-left-radius: ${({ first }) => (first ? '15px' : '0px')};
		border-top-right-radius: ${({ last }) => (last ? '15px' : '0px')};
		border-bottom-right-radius: ${({ last }) => (last ? '15px' : '0px')};
	}
`;

export const TableTab = styled(Text)<{ checked: boolean }>`
	cursor: pointer;
	position: relative;
	font-size: 18px;
	font-weight: bold;
	padding: 10px 30px;
	text-align: center;
	color: ${({ checked, theme }) => (checked ? theme.colors.tabActiveFontColor : theme.colors.tabDefaultFontColor)};
	border: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
	align-self: stretch;
	align-items: center;
	/* width: 165px; */
	&:first-child {
		border-top-left-radius: 15px;
		border-bottom-left-radius: 15px;
	}
	&:last-child {
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;
	}
`;

export const TableSearchInputer = styled.input`
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
	/* color: white; */
	color: ${({ theme }) => theme.colors.fontColor};
	&:focus {
		width: 200px;
		opacity: 1;
	}
	&::placeholder {
		color: #cbcaca;
	}
`;

export const TableWrapper = styled.div<{
	columnsCount: number;
	layout?: string;
}>`
	width: 100%;
	display: grid;
	grid-template-columns: ${({ layout, columnsCount }) =>
		layout || `repeat(${columnsCount}, auto)`};
	overflow: auto;
`;

export const TableHeaderRow = styled.div`
	display: contents;
`;

const tableBorderRadius = "15px";

export const EmptyRow = styled.div<{ columnsCount: number }>`
	background: white;
	width: 100%;
	height: 70px;
	grid-area: ${({ columnsCount }) => css`2/1/3/${columnsCount + 1}`};
	border-radius: ${tableBorderRadius};
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const SortHeaderIcon = styled.i<{ visible?: string }>`
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	opacity: ${({ visible }) => (visible ? 1 : 0)};
	transition: opacity 0.5s;
`;

export const TableHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 50px;
	margin-bottom: 10px;
	background: ${({ theme }) => (theme.colors.flatBackgroundColor)};
	color: black;
	position: relative;
	cursor: pointer;
	&:first-child {
		border-bottom-left-radius: ${tableBorderRadius};
		border-top-left-radius: ${tableBorderRadius};
	}
	&:last-child {
		border-bottom-right-radius: ${tableBorderRadius};
		border-top-right-radius: ${tableBorderRadius};
	}
	&:hover {
		${SortHeaderIcon} {
			opacity: 1;
		}
	}
`;

export const TableHeaderContent = styled.div`
	position: relative;
	padding: 0 15px;
	font-weight: bold;
`;

export const TableContent = styled.div<{
	alignLeft?: boolean;
}>`
	display: flex;
	justify-content: ${({alignLeft}) => alignLeft ? 'flex-start' : 'center'};	
	align-items: center;
	width: 100%;
	height: 95px;
	padding: 10px;
	background: white;
	color: black;
	cursor: pointer;
	box-sizing: border-box;
`;

export const TableBody = styled.div`
	display: contents;
`;

export const TableRowMainContent = styled.div`
	display: contents;
	${TableContent} {
		&:first-child {
			border-left: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
		}
		&:last-child {
			border-right: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
		}
	}
`;

export const TableDetailRow = styled.div<{
	columnsCount: number;
	index: number;
}>`
	height: 0;
	grid-area: ${({ columnsCount, index }) =>
		`${(index + 1) * 2 + 1} / 1 / ${(index + 1) * 2 + 2} / ${
			columnsCount + 1
		}`};
		border-left: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
		border-right: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
		border-bottom: 1px solid #d9d9d9;
	box-sizing: border-box;
	overflow: hidden;
`;

export const TableRow = styled.div<{
	expanded?: boolean;
	finishedExpanded: boolean;
	detailRowHeight: number;
	animationTime?: number;
}>`
	display: contents;

	&:first-child {
		${TableContent} {
		border-top: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
			&:first-child {
				border-top-left-radius: ${tableBorderRadius};
			}
			&:last-child {
				border-top-right-radius: ${tableBorderRadius};
			}
		}
	}
	&:last-child {
		${TableRowMainContent} {
			&:last-child {
				${TableContent} {
					border-bottom: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
					&:first-child {
						border-bottom-left-radius: ${tableBorderRadius};
					}
					&:last-child {
						border-bottom-right-radius: ${tableBorderRadius};
					}
				}
			}
		}

		${({ finishedExpanded }) =>
			finishedExpanded
				? css`
						${TableDetailRow} {
							border-bottom: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
							border-bottom-left-radius: ${tableBorderRadius};
							border-bottom-right-radius: ${tableBorderRadius};
							&:last-child {
							}
						}
				  `
				: css`
						${TableRowMainContent} {
							${TableContent} {
								border-bottom: ${({ theme }) => (`1px solid ${theme.colors.flatBackgroundColor}`)};
								&:first-child {
									border-bottom-left-radius: ${tableBorderRadius};
								}
								&:last-child {
									border-bottom-right-radius: ${tableBorderRadius};
								}
							}
						}
						${TableDetailRow} {
							border-bottom: none;
						}
				  `}
	}
	${TableDetailRow} {
		animation: ${({ expanded, detailRowHeight }) =>
				expanded
					? keyframes`
                        from {
                            height: 0px;
                        }
                        to {
                            height: ${detailRowHeight}px;
                        }
                    `
					: expanded === false
					? keyframes`
                        from {
                            height: ${detailRowHeight}px;
                        }
                        to {
                            height: 0px;
                        }
                    `
					: null}
			${({ animationTime }) => animationTime ?? 160}ms ease-in-out forwards;
	}
`;
