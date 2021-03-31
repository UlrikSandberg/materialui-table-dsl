import { Checkbox, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import BaseColumnHeader from "./BaseColumnHeader";

const useStyles = makeStyles((theme: Theme) => ({
    checked: {
        color: "#F08E43",
        '&$checked': {
          color: "#F08E43",
        },
    }
}))

export interface SelectableHeaderProps {
    numSelected: number,
    rowCount: number,
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    key:any
}

const SelectableHeader = (props: SelectableHeaderProps) => {
    
    const classes = useStyles();
    const {key, numSelected, rowCount, onSelectAllClick} = props;

    const render = () => {
        return <BaseColumnHeader padding="checkbox" key={key}>
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                classes={{checked: classes.checked}}
                onChange={onSelectAllClick}/>
        </BaseColumnHeader>
    }

    return render();
}

export default SelectableHeader;