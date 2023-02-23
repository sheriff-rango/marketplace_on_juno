import React, { useCallback, useState, useContext } from "react";

import { PopoutContext } from "../../context/PopoutContext";

import "./style.scss";
import { ThemeContext } from "../../context/ThemeContext";
import { TokenStatus, TokenType } from "../../types/tokens";
import { ChainConfigs } from "../../constants/ChainTypes";

const ExternalIcon = ({ ...props }) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M11.9544 2.43607C11.9544 3.25182 11.9544 4.01898 11.9544 4.85903C11.62 4.87465 11.3101 4.90242 11.0002 4.90415C8.49145 4.90763 5.98266 4.92151 3.47387 4.89721C2.82786 4.89027 2.53724 5.03086 2.54249 5.76156C2.57225 10.7376 2.56875 15.7137 2.54599 20.6881C2.54249 21.3407 2.76308 21.5299 3.40559 21.5264C8.42317 21.5056 13.4407 21.5056 18.4601 21.5281C19.1078 21.5316 19.3267 21.3389 19.3197 20.6898C19.2917 18.0291 19.3092 15.3666 19.3092 12.7059C19.3092 12.3934 19.3092 12.081 19.3092 11.7148C20.1653 11.7148 20.9373 11.7148 21.7934 11.7148C21.811 11.9977 21.8442 12.2754 21.8442 12.5514C21.8477 15.3284 21.8512 18.1054 21.8442 20.8825C21.839 22.9409 20.7343 24.0483 18.6579 24.0535C13.495 24.0622 8.33038 24.0639 3.1675 24.0535C1.15416 24.05 0.0161942 22.9305 0.010942 20.9293C-0.00306377 15.7797 -0.00481449 10.63 0.0126927 5.48212C0.0196956 3.46878 1.14191 2.39789 3.185 2.39268C5.8391 2.38574 8.49495 2.38921 11.149 2.39268C11.4029 2.39268 11.6585 2.41871 11.9544 2.43607Z"
			fill="black"
		/>
		<path
			d="M19.5332 2.08975C18.1152 2.08975 16.8756 2.08975 15.6379 2.08975C15.0251 2.08975 14.4124 2.11231 13.8014 2.08454C13.2236 2.05851 12.884 1.72353 12.856 1.14903C12.828 0.5728 13.1379 0.149304 13.7051 0.131947C16.3539 0.055579 19.0045 -0.00169723 21.6551 3.84141e-05C22.4359 3.84141e-05 22.9437 0.522467 23.0522 1.31218C23.1432 1.96826 23.2063 2.63127 23.222 3.29255C23.264 5.11324 23.2605 6.93566 23.3043 8.75635C23.3218 9.47664 23.159 10.0459 22.3432 10.1466C21.6831 10.2282 21.277 9.71443 21.2665 8.78586C21.249 7.11444 21.2612 5.44128 21.2612 3.76985C21.1614 3.73688 21.0616 3.7039 20.9636 3.67266C20.7465 3.87226 20.5189 4.05971 20.3141 4.26972C17.9891 6.6649 15.6676 9.0653 13.3427 11.4622C13.0801 11.733 12.8455 12.1183 12.5233 12.2207C12.1399 12.3439 11.4869 12.3804 11.2943 12.1599C11.051 11.884 11.107 11.3043 11.135 10.8617C11.1455 10.6812 11.4204 10.5146 11.5815 10.3479C14.0062 7.84514 16.431 5.34408 18.854 2.84128C19.0465 2.64516 19.2251 2.43341 19.5332 2.08975Z"
			fill="black"
		/>
	</svg>
);

const Tranfer: React.FC = () => {
	const [logoHeight, setLogoHeight] = useState(0);
	const { isDark } = useContext(ThemeContext);

	return (
		<div
			className="wrapper"
			style={{
				...(isDark && {
					color: "white",
				}),
			}}
		>
			<div>
				<img
					alt=""
					className="logo"
					src={`https://hopers.io/others/hopeHeaderLogo${
						isDark ? "_dark" : ""
					}.png`}
					onLoad={(e: React.SyntheticEvent<HTMLImageElement>) =>
						setLogoHeight((e.target as any).clientHeight || 0)
					}
				/>
				<div
					style={{
						height: `calc(100% - ${logoHeight || 70}px - 70px)`,
					}}
					className="container"
				>
					<div className="transfer-title">
						<div>Transfer</div>
						<div>From official third part dApps</div>
					</div>
					<div className="transfer-assets-wrapper">
						<div className="transfer-assets-container">
							{(
								Object.keys(TokenType) as Array<
									keyof typeof TokenType
								>
							).map((key) => {
								const denom = TokenType[key];
								const tokenStatus = TokenStatus[denom];
								if (
									!tokenStatus.isIBCCoin ||
									!tokenStatus.externalLink
								)
									return null;
								const chain = tokenStatus.chain;
								const externalLink = tokenStatus.externalLink;
								return (
									<div className="transfer-assets-item">
										<img
											alt=""
											src={`https://hopers.io/coin-images/${denom.replace(
												/\//g,
												""
											)}.png`}
										/>
										<div
											className="transfer-assets-item-name"
											data-chainname={
												ChainConfigs[chain].chainName
											}
										>
											{key}
										</div>
										<a
											href={externalLink}
											target="_blank"
											rel="noreferrer"
										>
											<ExternalIcon className="external-link" />
										</a>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const usePopoutTransfer = () => {
	const { showNewWindow } = useContext(PopoutContext);

	const popoutTranfer = useCallback(() => {
		showNewWindow(<Tranfer />, {
			title: "Transfer",
		});
	}, [showNewWindow]);
	return popoutTranfer;
};
