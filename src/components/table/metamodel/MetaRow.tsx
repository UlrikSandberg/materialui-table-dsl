import { Box, Checkbox, Collapse, CollapseProps, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import React, { ReactNode, useState } from "react";
import { ColumnConfiguration, ColumnType } from "../builders/columnBuilder";
import { SelectableColumnProps } from "./columns/SelectableColumn";
import { IEntity } from "../builders/tableBuilder";
import { TextColumnProps } from "./columns/TextColumn";
import { CustomColumnProps } from "./columns/CustomColumn";
import { CollapsableColumnProps } from "./columns/CollapsableColumn";

const useStyles = makeStyles((theme: Theme) => ({
    checked: {
      color: "#F08E43",
      '&$checked': {
        color: "#F08E43",
      },
    },
    selected: {
      "&$selected, &$selected:hover": {
        backgroundColor: "rgba(240,142,67,0.16)"
      }
    }
  }))

interface MetaRowProps<T extends IEntity> {
    rowKey: any
    columns: ColumnConfiguration[]
    data: T
    isRowSelected: boolean
    handleClick: (event: React.MouseEvent<unknown>, data: T) => void
    windowSize: number
    currentAccessRole?: string
}

const MetaRow = <T extends IEntity>(props: MetaRowProps<T>) => {

    const classes = useStyles();
    const {rowKey, columns, data, isRowSelected, handleClick, windowSize, currentAccessRole} = props;
    const [collapsableOpenState, setCollapsableOpenState] = useState<Map<number, boolean>>(new Map());
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [collapseRenderer, setCollapseRenderer] = useState<((data: T) => ReactNode) | undefined>()
    
    const onCollapseColumn = (columnId: number, open: boolean) => {
        if(collapsableOpenState.get(columnId) !== undefined) {
            // collapse all columns
            let keys = Array.from( collapsableOpenState.keys());
            keys.forEach(key => collapsableOpenState.set(key, false));
            if(open) {
                collapsableOpenState.set(columnId, open);
            }
            
            setCollapseOpen(open);
            setCollapseRenderer(() => columns[columnId].collapseableViewRenderer);
            setCollapsableOpenState(new Map(collapsableOpenState));
        }
    }

    const registerCollapsableColumn = (columnId: number, open: boolean) => {
        if(collapsableOpenState.get(columnId) === undefined) {
            collapsableOpenState.set(columnId, open); 
        }
    }

    const renderColumn = (columnConfig: ColumnConfiguration, columnId: number) => {
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
        if(columnConfig.columnType === ColumnType.Selectable) {
            return React.createElement<SelectableColumnProps<T>>(columnConfig.component, {
                columnKey: rowKey + columnId,
                isRowSelected: isRowSelected,
                handleClick: handleClick,
                data: data
            } as SelectableColumnProps<T>);
        }
        if(columnConfig.columnType === ColumnType.Text) {
            return React.createElement<TextColumnProps<T>>(columnConfig.component, {
                key: rowKey + columnId,
                data: data,
                fieldGetter: columnConfig.fieldGetter,
                onClick: columnConfig.onClick
            } as TextColumnProps<T>)
        }
        if(columnConfig.columnType === ColumnType.Custom) {
            return React.createElement<CustomColumnProps<T>>(columnConfig.component, {
                key: rowKey + columnId,
                data: data,
                customRenderer: columnConfig.customRenderer
            } as CustomColumnProps<T>)
        }
        
        if(columnConfig.columnType === ColumnType.Collapsable) {
            registerCollapsableColumn(columnId, false);
            return React.createElement<CollapsableColumnProps<T>>(columnConfig.component, {
                columnKey: columnId,
                open: collapsableOpenState.get(columnId),
                setOpen: onCollapseColumn
            } as CollapsableColumnProps<T>)
        }
    }

    const render = () => {
        return (
            <>
                <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isRowSelected}
                    tabIndex={-1}
                    key={rowKey}
                    selected={isRowSelected}
                    classes={{selected: classes.selected}}
                >
                    {columns.map((cConfig, key) => {
                        return renderColumn(cConfig, key);
                    })}
                </TableRow>
                <TableRow key={(rowKey as string)+(rowKey as string)}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                            {collapseRenderer ? collapseRenderer(data) : null}
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        )
    }

    return render();
}

export default MetaRow;