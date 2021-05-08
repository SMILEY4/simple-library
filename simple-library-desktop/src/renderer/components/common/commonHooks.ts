import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { componentLifecycle } from '../../app/common/utils/functionalReactLifecycle';

export function useStateRef<S>(initialValue: S): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
    const [value, setValue] = useState(initialValue);

    const ref = useRef(value);

    useEffect(
        () => {
            ref.current = value;
        },
        [value]);

    return [value, setValue, ref];
}


export function useEventListener(type: string, action: (e: any) => void) {
    componentLifecycle(
        () => document.addEventListener(type, action),
        () => document.removeEventListener(type, action),
    );
}


export function useClickOutside(action: (target: any) => void, targetRef?: MutableRefObject<any>): MutableRefObject<any> {
    const targetElementRef: MutableRefObject<any> = useRef(targetRef ? targetRef : null);

    useEventListener("mousedown", handleClick)

    function handleClick(event: Event) {
        if (targetElementRef && targetElementRef.current && !targetElementRef.current.contains(event.target)) {
            action(event.target);
        }
    }

    return targetElementRef;
}


export function useDraggable(onStart: () => void, onDrag: (dx: number, dy: number) => void, onStop: () => void) {

    const refTarget = useRef(null);
    const [isDragging, setDragging, refDragging] = useStateRef(false);

    useEventListener("mouseup", handleMouseUp)
    useEventListener("mousemove", handleMouseMove)

    function handleMouseDown() {
        if (!refDragging.current) {
            setDragging(true);
            refDragging.current = true;
            onStart();
        }
    }

    function handleMouseUp() {
        if (refDragging.current) {
            setDragging(false);
            refDragging.current = false;
            onStop();
        }
    }

    function handleMouseMove(event: any) {
        if (refDragging.current) {
            const targetPageX = refTarget.current.getBoundingClientRect().x;
            const targetPageY = refTarget.current.getBoundingClientRect().y;
            const mousePageX = event.pageX;
            const mousePageY = event.pageY;
            const dx = mousePageX - targetPageX;
            const dy = mousePageY - targetPageY;
            onDrag(dx, dy);
        }
    }

    return {
        refTarget: refTarget,
        mouseDownHandler: handleMouseDown,
    };
}
