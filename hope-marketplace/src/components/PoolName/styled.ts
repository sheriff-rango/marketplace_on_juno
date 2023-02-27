import styled, { css } from "styled-components";

export const Wrapper = styled.div<{ poolId?: number }>`
	position: relative;
	color: black;
	font-size: 18px;
	font-weight: bold;
	height: max-content;
	justify-content: flex-start;
	white-space: nowrap;
	${({ poolId }) =>
		poolId &&
		css`
			&::after {
				content: "Pool #${poolId > 99 ? "" : poolId > 9 ? "0" : "00"}${poolId}";
				position: absolute;
				left: 0;
				top: 85%;
				width: max-content;
				color: #c5c5c5;
				font-size: 15px;
			}
		`}
`;
