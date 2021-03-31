import { Grow} from "@material-ui/core";
import React, { ReactElement, ReactNode } from "react";
import Hidden from "./Hidden";

interface GrowSwitchProps {
    state: boolean
    onUI: ReactElement,
    offUI: ReactElement
}

const GrowSwitch = (props: GrowSwitchProps) => {
    return (
        <>
            <Hidden hide={!props.state}>
                <Grow appear in={props.state} timeout={300}> 
                    {props.onUI}
                </Grow>
            </Hidden>
            <Hidden hide={props.state}>
                <Grow appear in={!props.state} timeout={300}>
                    {props.offUI}
                </Grow>
            </Hidden>
        </>
    )
}

export default GrowSwitch;