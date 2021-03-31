import React, { Fragment, ReactElement, ReactNode } from "react";

interface HiddenProps {
    hide: boolean
    children: ReactElement
}

const Hidden = (props: HiddenProps) => {
    return props.hide ? <></> : props.children;
}

export default Hidden;