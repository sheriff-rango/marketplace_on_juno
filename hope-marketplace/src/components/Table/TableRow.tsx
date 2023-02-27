import { useEffect, useState } from "react";
import {
	TableContent,
	TableDetailRow,
	TableRow,
	TableRowMainContent,
} from "./styled";
import { ColumnTypes, TRow } from "./type";

const AnimationTime = 160; // in ms

const Row = <T extends object>({
	renderDetailRow,
	columns,
	index,
	data,
	defaultExpanded,
}: TRow<T>) => {
	const [expanded, setExpanded] = useState<boolean | undefined>(undefined);
	const [finishedExpanding, setFinishedExpanding] = useState<boolean>(false);
	const [element, setElement] = useState<HTMLDivElement | null>(null);
	
	
	useEffect(() => {
		setExpanded(defaultExpanded);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [(data as any)?.id]);

	useEffect(() => {
		if(defaultExpanded)
			setExpanded(defaultExpanded);
	}, [defaultExpanded]);

	const handleClickRow = () => {
		if (!renderDetailRow) {
			return;
		}
		if (expanded) {
			setTimeout(() => setFinishedExpanding(false), AnimationTime);
		} else {
			setFinishedExpanding(true);
		}
		setExpanded((prev) => !prev);
	};

	const detailRowHeight = element?.scrollHeight || 0;


	return (
		<TableRow
			expanded={expanded}
			finishedExpanded={finishedExpanding}
			detailRowHeight={detailRowHeight}
			animationTime={AnimationTime}
		>
			<TableRowMainContent onClick={() => handleClickRow()}>
				{columns.map((column, columnIndex) => {
					const defaultValue = column.type === ColumnTypes.NUMBER ? 0 : "";
					const format = column.format || ((value, data) => "" + value);
					const value = column.name
						? data[column.name] || defaultValue
						: defaultValue;
					const displayValue = column.name
						? format(data[column.name], data)
						: defaultValue;
					return (
						<TableContent key={columnIndex} alignLeft={column.alignLeft}>
							{column.alignLeft}
							{column.render ? column.render(value, data, expanded === true) : displayValue}
						</TableContent>
					);
				})}
			</TableRowMainContent>
			{renderDetailRow && (
				<TableDetailRow
					ref={(node: HTMLDivElement | null) => setElement(node)}
					columnsCount={columns.length}
					index={index}
				>
					{renderDetailRow(data)}
				</TableDetailRow>
			)}
		</TableRow>
	);
};

export default Row;
