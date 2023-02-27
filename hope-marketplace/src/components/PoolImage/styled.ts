import styled, { css } from "styled-components";

type TLiquidityImage = {
	size?: {
		token1: string;
		token2: string;
	};
	displayVerifiedIcon?: boolean
};

export const LiquidityImage = styled.div<TLiquidityImage>`
	display: flex;
	align-items: left;
	width: ${({ size }) =>
		size
			? css`calc(${size.token1} + ${size.token2} - ${size.token2} * 0.3)`
			: "70px"};
	img {
		border-radius: 50%;
		&:nth-child(1) {
			width: ${({ size }) => (size ? size.token1 : "40px")};
			height: ${({ size }) => (size ? size.token1 : "40px")};
		}
		&:nth-child(2) {
			width: ${({ size }) => (size ? size.token2 : "40px")};
			height: ${({ size }) => (size ? size.token2 : "40px")};
			margin-left: -20px;
			z-index: 1;
		}
	}
`;
