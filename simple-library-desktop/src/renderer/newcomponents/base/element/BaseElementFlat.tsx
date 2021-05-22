import React, {CSSProperties, MutableRefObject, ReactElement} from "react";
import {concatClasses, getIf} from "../../../components/common/common";
import "./baseElement.css"
import "./baseElementFlat.css"

interface BaseElementFlatProps {
    error?: boolean,
    className?: string,
    forwardRef?: MutableRefObject<any>,
    style?: CSSProperties,
}

export function BaseElementFlat(props: React.PropsWithChildren<BaseElementFlatProps>): ReactElement {

    return (
        <div className={getClassName()} style={props.style} ref={props.forwardRef}>
            {props.children}
        </div>
    )

    function getClassName() {
        return concatClasses(
            "base-elem",
            "base-elem-flat",
            getIf(props.error, "base-elem-state-error")
        )
    }

}
