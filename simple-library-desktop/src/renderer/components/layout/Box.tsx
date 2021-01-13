import {classNameOrEmpty} from "_renderer/components/Common";
import * as React from "react";
import {ReactElement} from "react";
import "./box.css"

interface ExpandingBoxProps {
    expandFully?: boolean,
    expandChildrenFully?: boolean,
    borderBox?: boolean,
    padded?: boolean,
    className?: string
}


export function Box(props: React.PropsWithChildren<ExpandingBoxProps>): ReactElement {

    function getClassNames(): string {
        return "box"
            + (props.expandFully === true ? " box-expand-fully" : "")
            + (props.expandChildrenFully === true ? " box-expand-children-fully" : "")
            + (props.borderBox === true ? " box-border-box" : "")
            + (props.padded === true ? " box-padded" : "")
            + classNameOrEmpty(props.className)
    }

    return (
        <div className={getClassNames()}>
            {props.children}
        </div>
    )
}
