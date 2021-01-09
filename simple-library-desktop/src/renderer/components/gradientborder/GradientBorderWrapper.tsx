import * as React from "react";
import {ReactElement} from "react";
import "./gradientBorderWrapper.css"


interface GradientBorderWrapperProps {
    className?: string,
}


export function GradientBorderWrapper(props: React.PropsWithChildren<GradientBorderWrapperProps>): ReactElement {
    return (
        <div className={"gradient-border-wrapper" + (props.className ? " " + props.className : "")}>
            {props.children}
        </div>
    )
}