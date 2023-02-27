import React, { useEffect, useState } from "react";
import { TableTab, TableTabContainer } from "./styled";
import { ITableTab } from "./type";

const TableTabs: React.FC<ITableTab> = ({ defaultSelected, tabs, onClick }) => {
	const [selectedTab, setSelectedTab] = useState<string>(
		defaultSelected || tabs[0] || ""
	);
	const [highLightElementInfo, setHighLightElementInfo] = useState({
		width: 0,
		left: 0,
		first: false,
		last: false
	});

	useEffect(() => {
		if (defaultSelected) setSelectedTab(defaultSelected);
	}, [defaultSelected]);

	useEffect(() => {
		const selectedTabElement = document.getElementById(
			`table-tab-${selectedTab}`
		);
		setHighLightElementInfo({
			left: selectedTabElement?.offsetLeft || 0,
			width: selectedTabElement?.offsetWidth || 0,
			first: tabs.indexOf(selectedTab) === 0,
			last: tabs.indexOf(selectedTab) === tabs.length -1
		});
	}, [selectedTab, tabs]);

	const handleClickTab = (tab: string) => {
		setSelectedTab(tab);
		if (onClick) onClick(tab);
	};

	return (
		<TableTabContainer
			left={highLightElementInfo.left}
			width={highLightElementInfo.width}
			first={highLightElementInfo.first}
			last={highLightElementInfo.last}
		>
			{tabs.map((tab, index) => (
				<TableTab
					id={`table-tab-${tab}`}
					key={index}
					checked={selectedTab === tab}
					onClick={() => handleClickTab(tab)}
				>
					{tab}
				</TableTab>
			))}
		</TableTabContainer>
	);
};

export default TableTabs;
