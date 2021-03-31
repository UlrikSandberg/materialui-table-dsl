import React, { ReactNode } from "react";
import { IEntity } from "../../builders/tableBuilder";
import BaseColumn from "./BaseColumn";

export interface CustomColumnProps<T extends IEntity> {
    key: any
    data: T
    customRenderer: (data: T) => ReactNode
}

const CustomColumn = <T extends IEntity>(props: CustomColumnProps<T>) => {

    const {key, data, customRenderer} = props;

    const render = () => {
        return <BaseColumn key={key}>
            {customRenderer(data)}
        </BaseColumn>
    }

    return render();
}

export default CustomColumn;