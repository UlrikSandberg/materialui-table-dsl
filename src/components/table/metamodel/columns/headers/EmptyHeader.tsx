import React from "react";
import BaseColumnHeader from "./BaseColumnHeader";

export interface EmptyHeaderProps {
    key: any
}

const EmptyHeader = (props: EmptyHeaderProps) => {

    const render = () => {
        return <BaseColumnHeader key={props.key}>
        </BaseColumnHeader>
    }

    return render();
}

export default EmptyHeader;