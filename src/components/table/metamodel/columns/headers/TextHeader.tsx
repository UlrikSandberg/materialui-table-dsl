import { makeStyles, TableSortLabel, Theme } from "@material-ui/core";
import React from "react";
import { Order } from "../../MetaTable";
import BaseColumnHeader from "./BaseColumnHeader";

const useStyles = makeStyles((theme: Theme) => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    }
}))

export interface TextHeaderProps {
    key: any
    numeric: boolean
    sortable?: {
        orderBy: string,
        order: Order,
        columnOrderKey: string
        onRequestSort: (event: React.MouseEvent<unknown>, columnId: string) => void;
    },
    label: string
    columnId: string
}

const TextHeader = (props: TextHeaderProps) => {

    const classes = useStyles();
    const {key, numeric, sortable, label, columnId} = props;

    const createSortHandler = (columnOrderKey: string) => (event: React.MouseEvent<unknown>) => {
        if(sortable) {
            sortable.onRequestSort(event, columnOrderKey);
        }
    }

    const render = () => {
        return <BaseColumnHeader key={key} padding={numeric ? "default" : "none"} align={numeric ? "right" : "left"}>
            {sortable ? (
                <TableSortLabel
                    active={sortable.orderBy === sortable.columnOrderKey}
                    direction={sortable.orderBy === sortable.columnOrderKey? sortable.order : "asc"}
                    onClick={createSortHandler(sortable.columnOrderKey)}
                >
                    {label}
                    {sortable.orderBy === sortable.columnOrderKey ? (
                        <span className={classes.visuallyHidden}>
                            {sortable.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                    ) : null}
                </TableSortLabel>
            ) : (
                label
            )}
        </BaseColumnHeader>
    }

    return render();
}

export default TextHeader;