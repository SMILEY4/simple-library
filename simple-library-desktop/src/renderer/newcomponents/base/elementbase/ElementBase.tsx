import * as React from "react";
import {CSSProperties, MutableRefObject, ReactElement} from "react";
import {concatClasses, getIf, map} from "../../../components/common/common";
import "./elementBase.css"

/**
 * PROPS:
 *
 * - variant: "filled" | "outlined" | "ghost"
 *      * filled = border + background
 *      * outlined = only border
 *      * ghost = no border or background
 *
 * - type: "default", "primary", "success", "warn", "error"
 *      * defines border+background color
 *
 * - interactive
 *      * whether border,background reacts to hover,active states
 *
 * - disabled
 *      * puts the element in disabled state, no longer interactive
 *
 * - error
 *      * put the element in an error state
 *      * forces error-border
 *
 * - groupPos: "left, center, right, top, bottom"
 *      * defines which corners do not have a radius
 */

interface ElementBaseProps {
    outline?: boolean,
    error?: boolean
    interactive?: boolean,
    disabled?: boolean,
    type?: "primary" | "success" | "warn" | "error",


    className?: string,
    style?: CSSProperties,
    forwardRef?: MutableRefObject<any>
}

export function ElementBase(props: React.PropsWithChildren<ElementBaseProps>): ReactElement {

    return (
        <div
            className={concatClasses(
                "element-base",
                getIf(props.outline, "element-base-outline"),
                getIf(props.interactive, "element-base-interactive"),
                map(props.type, type => "element-base-" + type),
                getIf(props.error, "element-base-error-state"),
                props.className
            )}
            style={props.style}
            ref={props.forwardRef}
        >
            {props.children}
        </div>
    );

}
