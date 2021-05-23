import * as React from 'react';
import {ReactElement} from 'react';
import "./divider.css";
import {BaseProps} from "../../common";
import {useDraggable} from "../../../components/common/commonHooks";
import {concatClasses, map} from "../../../components/common/common";

interface DividerProps extends BaseProps {
    __mode?: "vertical" | "horizontal",
    __onDrag?: (diff: number) => void,
}


export function Divider(props: React.PropsWithChildren<DividerProps>): ReactElement {

    const {refTarget, mouseDownHandler} = useDraggable(handleDragStart, handleDrag, handleDragStop);

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
