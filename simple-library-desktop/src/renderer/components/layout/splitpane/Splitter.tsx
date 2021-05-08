import { BaseProps } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./splitter.css";
import { useDraggable } from '../../common/commonHooks';

interface SplitterProps extends BaseProps {
    __splitterIndex?: number,
    __onDrag?: (splitterIndex: number, diff: number) => void,
}


export function Splitter(props: React.PropsWithChildren<SplitterProps>): ReactElement {

    const { refTarget, mouseDownHandler } = useDraggable(handleDragStart, handleDrag, handleDragStop);

    return (
        <div className={"splitter"} ref={refTarget} onMouseDown={mouseDownHandler} draggable={false} />
    );

    function handleDragStart() {
        document.body.style.cursor = "col-resize";
    }

    function handleDragStop() {
        document.body.style.cursor = "default";
    }

    function handleDrag(dx: number, dy: number) {
        props.__onDrag(props.__splitterIndex, dx);
    }

}
