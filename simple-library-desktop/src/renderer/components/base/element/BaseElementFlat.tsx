import React, {ReactElement} from "react";
import {concatClasses, getIf, map} from "../../utils/common";
import "./baseElement.css"
import "./baseElementFlat.css"
import {BaseElementProps, getBaseElementClasses} from "./baseElement";

interface BaseElementFlatProps extends BaseElementProps {
}

export function BaseElementFlat(props: React.PropsWithChildren<BaseElementFlatProps>): ReactElement {

    return (
        <div className={getClassName()} style={props.style} ref={props.forwardRef}>
            {props.children}
        </div>
    )

    function getClassName() {
        return concatClasses(
            props.className,
            "base-elem-flat",
            getBaseElementClasses(props)
        )
    }

}
