import { BaseProps } from '../../common/common';
import * as React from 'react';
import { ReactElement, useRef } from 'react';
import "./splitter.css";
import { componentLifecycle } from '../../../app/common/utils/functionalReactLifecycle';
import { useStateRef } from '../../common/commonHooks';

interface SplitterProps extends BaseProps {
    splitterId: number,
    onDrag: (splitterId:number, diff: number) => void
}


export function Splitter(props: React.PropsWithChildren<SplitterProps>): ReactElement {

    const refSplitter = useRef(null);
    const [isDragging, setDragging, refDragging] = useStateRef(false);

    componentLifecycle(
        () => {
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mousemove", handleMouseMove);
        },
        () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        },
    );

    return (
        <div className={"splitter"} ref={refSplitter} onMouseDown={handleMouseDown} draggable={false} />
    );


    function handleMouseDown() {
        if (!refDragging.current) {
            setDragging(true);
            document.body.style.cursor = "col-resize";
        }
    }

    function handleMouseUp() {
        if (refDragging.current) {
            setDragging(false);
            document.body.style.cursor = "default";
        }
    }

    function handleMouseMove(event: any) {
        if (refDragging.current) {
            const splitterPageX = refSplitter.current.getBoundingClientRect().x;
            const mousePageX = event.pageX;
            const diff = mousePageX - splitterPageX;
            props.onDrag(props.splitterId, diff);
        }
    }

}
