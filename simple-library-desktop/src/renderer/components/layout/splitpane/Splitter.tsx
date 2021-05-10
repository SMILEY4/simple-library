import {BaseProps, concatClasses, map} from '../../common/common';
import * as React from 'react';
import {ReactElement} from 'react';
import "./splitter.css";
import {useDraggable} from '../../common/commonHooks';

interface SplitterProps extends BaseProps {
    mode: "vertical" | "horizontal",
    __onDrag?: (diff: number) => void,
}


export function Splitter(props: React.PropsWithChildren<SplitterProps>): ReactElement {

    const {refTarget, mouseDownHandler} = useDraggable(handleDragStart, handleDrag, handleDragStop);

    return (
        <div
            className={concatClasses("splitter", map(props.mode, mode => "splitter-" + mode))}
            ref={refTarget}
            onMouseDown={mouseDownHandler}
            draggable={false}
        />
    );

    function handleDragStart() {
        document.body.style.cursor = props.mode === "vertical" ? "col-resize" : "row-resize";
    }

    function handleDragStop() {
        document.body.style.cursor = "default";
    }

    function handleDrag(dx: number, dy: number) {
        props.__onDrag(props.mode === "vertical" ? dx : dy);
    }

}
