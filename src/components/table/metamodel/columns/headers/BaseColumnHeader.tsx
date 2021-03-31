import { TableCell } from "@material-ui/core";
import React, { ReactNode } from "react";

interface BaseColumnHeaderProps {
    children: ReactNode
    key: any
    align?: "left" | "right" | "inherit" | "center" | "justify"
    padding?: "none" | "default" | "checkbox"
    component?: "th"
    scope?: string
}

const BaseColumnHeader = (props: BaseColumnHeaderProps) => {

    const render = () => {
        return <TableCell scope={props.scope} component={props.component} padding={props.padding} key={props.key} align={props.align}>
            {props.children}
        </TableCell>
    }

    return render();
}

export default BaseColumnHeader;



