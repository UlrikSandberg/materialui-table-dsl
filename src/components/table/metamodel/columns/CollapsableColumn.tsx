import { IconButton } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import React from "react";
import { IEntity } from "../../builders/tableBuilder";
import BaseColumn from "./BaseColumn";

export interface CollapsableColumnProps<T extends IEntity> {
    columnKey: any
    open: boolean
    setOpen: (columnId: number, open: boolean) => void
}

const CollapsableColumn = <T extends IEntity>(props: CollapsableColumnProps<T>) => {

    const {columnKey, open, setOpen} = props;
    const render = () => {
        return <BaseColumn key={columnKey}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(columnKey, !open)}>
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
        </BaseColumn>
    }

    return render();
}

export default CollapsableColumn;