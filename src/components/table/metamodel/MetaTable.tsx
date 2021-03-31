import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Toolbar } from "@material-ui/core";
import React, { ReactNode, useEffect, useState } from "react";
import { IEntity } from "../builders/tableBuilder";
import { SelectableHeaderProps } from "./columns/headers/SelectableHeader";
import { EmptyHeaderProps } from "./columns/headers/EmptyHeader";
import { TextHeaderProps } from "./columns/headers/TextHeader";
import TableToolbar from "./TableToolbar";
import { ColumnConfiguration, ColumnHeaderConfiguration, ColumnHeaderType } from "../builders/columnBuilder";
import MetaRow from "./MetaRow";
import { PagingConfiguration } from "../builders/pagingBuilder";
import TablePaginationActions from "./TablePaginationActions";
import { ToolbarConfiguration } from "../builders/toolbarBuilder";
import "./columns/columnStyles.css";

export const isNullOrWhiteSpace = (str : string) : boolean =>{
    if(str === null || str!.match(/^ *$/) !== null) {
        return true;
    }
    
    return false;
}

interface MetaTableProps<T extends IEntity> {
    columnHeaders: ColumnHeaderConfiguration[];
    columns: ColumnConfiguration[];
    toolbarConfig?: ToolbarConfiguration 
    pagingConfig?: PagingConfiguration
    data: T[];
    caption?: string
    defaultSorting?: keyof T
    currentAccessRole?: string
}

export type Order = 'asc' | 'desc';

const MetaTable = <T extends IEntity>(props: MetaTableProps<T>) => {

    const [numSelected, setNumSelected] = useState(0);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderColumnBy, setOrderBy] = React.useState<keyof T>(props.defaultSorting ? props.defaultSorting : "id");
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [windowSize, setWindowSize] = React.useState(window.innerWidth);
    const [searchRequest, setSearchRequest] = useState<{isSearching: boolean, searchText: string}>();

    const {columnHeaders, toolbarConfig, columns, data, caption, pagingConfig, currentAccessRole} = props;

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleResize = () => {
        setWindowSize(window.innerWidth);
    }

    const handleClick = (event: React.MouseEvent<unknown>, data: T) => {
        const selectedIndex = selected.indexOf(data.id);
        let newSelected: string[] = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, data.id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        setSelected(newSelected);
      };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        if (event.target.checked) {
          const newSelecteds = data.map((n) => n.id);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
    };

    const filter = (data: T[]) : T[] => {
        
        let visibleRows : T[] = data;
        
        // If sorting key has been set use it to sort the data appropriately
        if(orderColumnBy) {
            visibleRows = stableSort(visibleRows, buildComparator(order, orderColumnBy));
        }

        if(searchRequest && searchRequest.isSearching && !isNullOrWhiteSpace(searchRequest.searchText) ) {
            
            const searchTerm = searchRequest.searchText.trim();
            const newRows: T[] = [];
            visibleRows.forEach((row) => {
                for(const key in row) {
                    if(key === "id") {
                        continue;
                    }
                    const variable = row[key];
                    if(typeof variable === "number" || typeof variable === "string") {
                        let sVariable = `${variable}`.toLowerCase();
                        if(sVariable.includes(searchTerm.toLowerCase())) {
                            newRows.push(row)
                            break;
                        }
                    }
                }
            })
            visibleRows = newRows;
        }

        // If paging is toggled use 
        if(pagingConfig) {
            visibleRows = visibleRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        }

        return visibleRows;
    }

    const buildComparator = <Key extends keyof any>(order: Order, orderBy: Key
        ) : (a: { [key in Key]: number | string | any}, b: { [key in Key]: number | string | any}) => number => {
          return order === "desc"
          ? (a, b) => descendingComparator(a,b, orderBy)
          : (a,b) => -descendingComparator(a,b, orderBy);
    }
    
    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    
    function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

     // If new column selected then set to orderBy that column in ascending order
    const handleRequestSort = (event: React.MouseEvent<unknown>, columnOrderKey: keyof T) => {
        const isAsc = orderColumnBy === columnOrderKey && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnOrderKey);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Render the table header
    const buildTableColumnHead = (columnConfig: ColumnHeaderConfiguration, key: any) : ReactNode => {
        if(columnConfig.breakpointRule) {
            if(windowSize < columnConfig.breakpointRule) {
                return null;
            }
        }

        if(currentAccessRole) {
            if(columnConfig.authorizedRoles && columnConfig.authorizedRoles.length > 0) {
                if(!columnConfig.authorizedRoles.includes(currentAccessRole)) {
                    return null;
                }
            }
        }

        if(columnConfig.columnHeaderType === ColumnHeaderType.Selectable) {
            return React.createElement<SelectableHeaderProps>(columnConfig.component, {
                numSelected: selected.length,
                rowCount: data.length,
                key: key,
                onSelectAllClick: handleSelectAllClick
            } as SelectableHeaderProps);
        }

        if(columnConfig.columnHeaderType === ColumnHeaderType.Empty) {
            return React.createElement<EmptyHeaderProps>(columnConfig.component, {
                key: key
            } as EmptyHeaderProps);
        }
        
        return React.createElement<TextHeaderProps>(columnConfig.component, {
            key: key,
            label: columnConfig.label,
            sortable: columnConfig.sortable ? {
                order: order,
                orderBy: orderColumnBy,
                columnOrderKey: columnConfig.fieldGetter,
                onRequestSort: handleRequestSort
            } : undefined,
            columnId: `${key}`,
            numeric: columnConfig.numeric
        } as TextHeaderProps);
    }

    const renderTableHead = () => {
        return <TableHead>
            <TableRow>
                {columnHeaders.map((ele, key) => {
                    return buildTableColumnHead(ele, key);
                })}
            </TableRow>
        </TableHead>
    }

    const isSelected = (rowId: string) => selected.indexOf(rowId) !== -1;

    const renderTableBody = () => {

        const filterData = filter(data);

        return <TableBody>
            {filterData.length > 0 ? (
                filterData.map((data, key) => {
                    const isRowSelected = isSelected(data.id)
                    return <MetaRow currentAccessRole={props.currentAccessRole} windowSize={windowSize} columns={columns} rowKey={data.id} handleClick={(event, data) => handleClick(event, data)} isRowSelected={isRowSelected} data={data}></MetaRow>
                })) 
                : <TableRow hover
                    role="checkbox">
                    <TableCell style={{textAlign: "center", fontSize: "14px"}} colSpan={12}>Sorry, no matching records found</TableCell>
                </TableRow>
            }
            
        </TableBody>
    }

    const renderTableToolbar = () => {
        if(toolbarConfig) {
            return <TableToolbar 
            toolbarConfiguration={toolbarConfig}
            tableTitle={toolbarConfig.tableName} 
            numSelected={selected.length}
            onRequestCSVExport={() => console.log("Export csv")}
            onRequestPrintExport={() => console.log("Export print")}
            onRequestSearch={(isSearching, searchText) => setSearchRequest({isSearching, searchText})}
            ></TableToolbar>
        }
    }

    const renderCaption = () => {
        if(caption) {
            return <caption>{caption}</caption>
        }
    }

    const renderPaging = () => {
        if(pagingConfig) {
            return <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={pagingConfig.pagingOptions.map(ele => {
                            return typeof ele === "number" ? ele : {label: ele.label, value: ele.value(data)}
                        })}
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        labelDisplayedRows={({from, to, count}) => pagingConfig.dynamic ? `${from}-${to}` : `${from}-${to} of ${count}`}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        }
    }

    const render = () => {
        return <Paper>
            <TableContainer>
                {renderTableToolbar()}
                <Table>
                    {renderTableHead()}
                    {renderTableBody()}
                    {renderPaging()}
                    {renderCaption()}
                </Table>
            </TableContainer>
        </Paper>
    }

    return render();
}

export default MetaTable;