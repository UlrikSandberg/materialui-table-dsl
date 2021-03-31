import { Checkbox, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { IEntity } from "../../builders/tableBuilder";
import BaseColumn from "./BaseColumn";

const useStyles = makeStyles((theme: Theme) => ({
    checked: {
      color: "#F08E43",
      '&$checked': {
        color: "#F08E43",
      },
    }
  }))

export interface SelectableColumnProps<T extends IEntity> {
    columnKey: any
    isRowSelected: boolean
    handleClick: (event: React.MouseEvent<unknown>, data: T) => void
    data: T
}

const SelectableColumn = <T extends IEntity>(props: SelectableColumnProps<T>) => {

    const classes = useStyles();
    const {columnKey, isRowSelected, handleClick, data} = props;

    const render = () => {
        return <BaseColumn padding="checkbox" key={columnKey}>
            <Checkbox
                classes={{checked: classes.checked}}
                checked={isRowSelected}
                onClick={(event) => handleClick(event, data)}
            />
        </BaseColumn>
    }

    return render();
}

export default SelectableColumn;