import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useClickOutside } from '../../common/commonHooks';
import { componentLifecycle } from '../../../app/common/utils/functionalReactLifecycle';

export function useContextMenu(refTarget?: MutableRefObject<any>) {

    const menuRef: MutableRefObject<any> = useClickOutside(handleClickOutside);
    const targetRef: MutableRefObject<any> = refTarget ? refTarget : useRef(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [show, setShow] = useState(false);

    componentLifecycle(
        () => document.addEventListener("contextmenu", handleContextMenu),
        () => document.removeEventListener("contextmenu", handleContextMenu),
    );

    useEffect(() => {
        if (menuRef && menuRef.current) {
            const overflowSide: string = elementOverflowSide(menuRef.current);
            if (overflowSide && targetRef && targetRef.current) {
                const offsets: number[] = elementOverflowOffset(menuRef.current, overflowSide);
                setX(x + offsets[0]);
                setY(y + offsets[1]);
            }
        }
    });

    function handleClickOutside() {
        if (targetRef.current) {
            setShow(false);
        }
    }

    function handleContextMenu(event: any): void {
        if (targetRef && targetRef.current && targetRef.current.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            setX(event.pageX);
            setY(event.pageY);
            setShow(true);
        }
    }

    function elementOverflowOffset(el: any, overflowSide: string): number[] {
        const eHeight = el.offsetHeight;
        const eWidth = el.offsetWidth;
        if (overflowSide === "bottom") {
            return [0, -eHeight];
        }
        if (overflowSide === "right") {
            return [-eWidth];
        }
        if (overflowSide === "bottom-right") {
            return [-eWidth, -eHeight];
        }
        return [0, 0];
    }


    function elementOverflowSide(el: any): string {
        let minX = el.offsetLeft;
        let minY = el.offsetTop;
        let width = el.offsetWidth;
        let height = el.offsetHeight;
        while (el.offsetParent) {
            el = el.offsetParent;
            minX += el.offsetLeft;
            minY += el.offsetTop;
        }
        const maxX = minX + width;
        const maxY = minY + height;

        const windowMinX = window.pageXOffset;
        const windowMinY = window.pageYOffset;
        const windowMaxX = window.pageXOffset + window.innerWidth;
        const windowMaxY = window.pageYOffset + window.innerHeight;

        let sides: string[] = [];

        if (maxY > windowMaxY) {
            sides.push("bottom");
        } else if (minY < windowMinY) {
            sides.push("top");
        }
        if (maxX > windowMaxX) {
            sides.push("right");
        } else if (minX < windowMinX) {
            sides.push("left");
        }
        return sides.length > 0 ? sides.join("-") : undefined;
    }

    return {
        cmTargetRef: targetRef,
        cmMenuRef: menuRef,
        cmPos: { x: x + "px", y: y + "px" },
        isShowContextMenu: show,
        closeContextMenu: () => setShow(false),
    };
}
