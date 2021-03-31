import { TableCell, TableCellProps } from "@material-ui/core";
import React, { ReactNode } from "react";

interface BaseColumnProps {
    children: ReactNode
    key: any
    align?: "left" | "right"
    padding?: "none" | "default" | "checkbox"
    component?: "th"
    scope?: string
    id?: any
}

const BaseColumn = (props: BaseColumnProps) => {

    const render = () => {
        return <TableCell id={props.id} scope={props.scope} component={props.component} padding={props.padding} key={props.key} align={props.align}>
            {props.children}
        </TableCell>
    }

    return render();
}

export default BaseColumn;