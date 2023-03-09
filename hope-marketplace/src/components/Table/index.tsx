import React, { useMemo, useState } from "react";
import {
	EmptyRow,
	SortHeaderIcon,
	TableBody,
	TableControlPanel,
	TableHeader,
	TableHeaderContent,
	TableHeaderRow,
	TablePaginator,
	TableSearchInputer,
	TableWrapper,
	Wrapper,
} from "./styled";
import Row from "./TableRow";
import TableTabs from "./TableTabs";
import { ColumnTypes, ITablePaginator, TSortDirection, TTable } from "./type";
import { PaginatorButton } from "./styled";

const Table = <T extends object>({
	data,
	columns,
	renderDetailRow,
	layout,
	option,
	defaultExpanded,
}: TTable<T>) => {
	const pageSize = 15;

	const [sortDirections, setSortDirections] = useState<TSortDirection>(
		{} as TSortDirection
	);
	const [searchValue, setSearchValue] = useState<string>("");

	const handleClickSortDirectionButton = (columnName: string) => {
		if (!columnName) return;

		setSortDirections((prev) => ({
			field: columnName,
			direction: prev?.direction === "up" ? "down" : "up",
		}));
	};

	const handleChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchValue(value);
	};

	const calculateRange = () => {
		const range = [];
		const num = Math.ceil(data.length / pageSize);
		for (let i = 1; i <= num; i++) {
		  range.push(i);
		}
		return range;
	};

	const [paginator, setPaginatorValue] = useState<ITablePaginator>(
		{pageSize:pageSize, currentPage:0, pagesRange:calculateRange() } as ITablePaginator
	);

	const handleChangePaginatorValue = (selectedPage:number) => {
		let tmp = {...paginator};
		tmp.currentPage = selectedPage;
		setPaginatorValue(tmp);
	};

	const selectFirstPage = () => {
		handleChangePaginatorValue(0);
	}

	const selectPageBefore = () => {
		handleChangePaginatorValue(paginator.currentPage - 1);
	}

	const selectPageAfter = () => {
		handleChangePaginatorValue(paginator.currentPage + 1);
	}

	const selectLastPage = () => {
		handleChangePaginatorValue(paginator.pagesRange.length - 1);
	}

	const searchedData = useMemo(
		() =>
			option?.search?.onChange
				? option.search?.onChange(searchValue, data)
				: data,
		[option?.search, searchValue, data]
	);

	const sortedData = useMemo(() => {
		let tmp = {...paginator};
		tmp.pagesRange = calculateRange();
		tmp.currentPage = tmp.pagesRange.length <= tmp.currentPage ? 0 : tmp.currentPage;
		setPaginatorValue(tmp);
		if (!sortDirections?.field) return searchedData;
		const sortedColumn = columns.find((column) =>
			((column?.name || column?.title || "") as string).includes(
				sortDirections.field
			)
		);
		
		if (!sortedColumn || !sortedColumn.sort) return searchedData;
		
		return searchedData.sort((data1, data2) => {
			const defaultValue = sortedColumn.type === ColumnTypes.NUMBER ? 0 : "";
			const value1 = sortedColumn.name
				? data1[sortedColumn.name] || defaultValue
				: defaultValue;
			const value2 = sortedColumn.name
				? data2[sortedColumn.name] || defaultValue
				: defaultValue;
				
			if (typeof sortedColumn.sort === "boolean") {
				return sortDirections.direction === "up"
					? value1 > value2
						? 1
						: -1
					: value2 > value1
					? 1
					: -1;
			}
			return sortedColumn.sort
				? sortedColumn.sort(data1, data2, sortDirections.direction)
				: 0;
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns, searchedData, sortDirections]);

	const paginatedData = useMemo(() => {
		return sortedData.slice(paginator.currentPage * paginator.pageSize, (paginator.currentPage * paginator.pageSize) + paginator.pageSize);
	}, [sortedData, paginator])

	const hasControlPanel = !!option?.tab || !!option?.search;

	return (
		<Wrapper>
			{hasControlPanel && (
				<TableControlPanel>
					{!!option?.tab && <TableTabs {...option.tab} />}
					{!!option?.search && (
						<TableSearchInputer
							placeholder={option.search.placeholder ?? "Search"}
							value={searchValue}
							onChange={handleChangeSearchValue}
						/>
					)}
				</TableControlPanel>
			)}
			<TableWrapper columnsCount={columns.length} layout={layout}>
				<TableHeaderRow>
					{columns.map((column, index) => {
						const directionKey = (column.name || column.title) as string;
						const sortedDirection =
							sortDirections.field === directionKey
								? sortDirections.direction
								: "";
						return (
							<TableHeader key={index}>
								<TableHeaderContent>
									{column.headerRender? column.headerRender() : column.title ?? column.name ?? ""}
									{column.sort && (
										<SortHeaderIcon
											className={`fa fa-sort${
												sortedDirection ? `-${sortedDirection}` : ""
											}`}
											visible={sortedDirection}
											onClick={() =>
												handleClickSortDirectionButton(directionKey)
											}
										/>
									)}
								</TableHeaderContent>
							</TableHeader>
						);
					})}
				</TableHeaderRow>
				<TableBody>
					{paginatedData.map((dataItem, dataIndex) => {
						const expanded = defaultExpanded
							? defaultExpanded(dataItem)
							: false;
						return (
							<Row<T>
								key={dataIndex}
								columns={columns}
								renderDetailRow={renderDetailRow}
								data={dataItem}
								defaultExpanded={expanded}
								index={dataIndex}
							/>
						);
					})}
					{!data?.length && (
						<EmptyRow columnsCount={columns.length}>
							{option?.emptyString || "No Data"}
						</EmptyRow>
					)}
				</TableBody>
				
			</TableWrapper>
			<TablePaginator>
					<PaginatorButton
							enabled={paginator.currentPage > 1}
							key={"<<"}
							onClick={() => selectFirstPage()}
						>
							{"<<"}
					</PaginatorButton>
					<PaginatorButton
							enabled={paginator.currentPage > 0}
							key={"<"}
							onClick={() => selectPageBefore()}
						>
							{"<"}
					</PaginatorButton>
					{paginator.pagesRange.map((el, index) => {
						return (
						<PaginatorButton							
							enabled={true}
							active={paginator.currentPage === index}
							key={el}
							onClick={() => handleChangePaginatorValue(index)}
						>
							{el}
						</PaginatorButton>
						)
					})}
					<PaginatorButton
							enabled={paginator.currentPage < paginator.pagesRange.length - 1}
							key={">"}
							onClick={() => selectPageAfter()}
						>
							{">"}
					</PaginatorButton>
					<PaginatorButton
							enabled={paginator.currentPage < paginator.pagesRange.length - 2}
							key={">>"}
							onClick={() => selectLastPage()}
						>
							{">>"}
					</PaginatorButton>
			</TablePaginator>
		</Wrapper>
	);
};

export default Table;

export * from "./type";
