import * as React from "react";
import "./gradientBorderWrapper.css"


interface GradientBorderWrapperProps {
    className?: string,
    children: any
}


export function GradientBorderWrapper(props: React.PropsWithChildren<GradientBorderWrapperProps>) {
    return (
        <div className={"gradient-border-wrapper" + (props.className ? " " + props.className : "")}>
            {props.children}
        </div>
    )
}
