import React from "react";
import { IEntity } from "../../builders/tableBuilder";
import BaseColumn from "./BaseColumn";

export interface TextColumnProps<T extends IEntity> {
    key: any
    data: T
    fieldGetter: keyof T
    onClick?: (data: T) => void;
}

const TextColumn = <T extends IEntity>(props: TextColumnProps<T>) => {

    const {key, data, fieldGetter, onClick} = props;

    const isClickable = (cellText: any) => {
        if(onClick) {
            return <div className="column-clickable" onClick={() => onClick(data)}>
                {cellText}
            </div>
        } else {
            return cellText;
        }
    }

    const render = () => {
        if(typeof data[fieldGetter] === "string") {
            return <BaseColumn id={key} component="th" scope="row" padding="none" key={key}>
                {isClickable(data[fieldGetter])}
            </BaseColumn>
        }

        if(typeof data[fieldGetter] === "number") {
            return <BaseColumn align="right" key={key}>
                {isClickable(data[fieldGetter])}
            </BaseColumn>
        }

        return <BaseColumn key={key}>
            {isClickable(data[fieldGetter])}
        </BaseColumn>
    }

    return render();
}

export default TextColumn;