import * as React from "react";
import {ReactElement} from "react";
import "./gradientBorderBox.css"
import {classNameOrEmpty, HighlightType} from "_renderer/components/Common";


interface GradientBorderBoxProps {
    children: any
    gradient: HighlightType,
    className?: string,
    innerClassName?: string
}


export function GradientBorderBox(props: React.PropsWithChildren<GradientBorderBoxProps>): ReactElement {
    return (
        <div className={"gradient-box-border gradient-box-border-" + props.gradient + classNameOrEmpty(props.className)}>
            <div className={"gradient-box-content" + classNameOrEmpty(props.innerClassName)}>
                {props.children}
            </div>
        </div>
    )
}
