import * as React from 'react';
import {MutableRefObject, ReactElement} from 'react';
import "./divider.css";
import {BaseProps} from "../../utils/common";
import {useDraggable} from "../../utils/commonHooks";
import {concatClasses, map} from "../../utils/common";

interface DividerProps extends BaseProps {
    __mode?: "vertical" | "horizontal",
    __onDrag?: (diff: number) => void,
    __parentRef?: MutableRefObject<any>
}


export function Divider(props: React.PropsWithChildren<DividerProps>): ReactElement {

    const {refTarget, mouseDownHandler} = useDraggable(handleDragStart, handleDrag, handleDragStop, props.__parentRef);

    return (
        <div
            className={concatClasses("divider", map(props.__mode, mode => "divider-" + mode), props.className)}
            ref={refTarget}
            onMouseDown={mouseDownHandler}
            draggable={false}
            style={props.style}
        >
            {props.children}
        </div>
    );

    function handleDragStart() {
        document.body.style.cursor = props.__mode === "vertical" ? "col-resize" : "row-resize";
    }

    function handleDragStop() {
        document.body.style.cursor = "default";
    }

    function handleDrag(dx: number, dy: number) {
        props.__onDrag(props.__mode === "vertical" ? dx : dy);
    }

}
