import React, {MutableRefObject, useEffect, useState} from 'react';
import {useClickOutside} from "../../utils/commonHooks";

export function useContextMenu() {

    const menuRef: MutableRefObject<any> = useClickOutside(close);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show && menuRef && menuRef.current) {
            const overflowSide: string = elementOverflowSide(menuRef.current);
            if (overflowSide) {
                const offsets: number[] = elementOverflowOffset(menuRef.current, overflowSide);
                setX(x + offsets[0]);
                setY(y + offsets[1]);
            }
        }
    });

    function openWithEvent(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        open(event.pageX, event.pageY);
    }

    function open(pageX: number, pageY: number) {
        setX(pageX);
        setY(pageY);
        setShow(true);
    }

    function close() {
        setShow(false);
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
        showContextMenu: show,
        contextMenuX: x,
        contextMenuY: y,
        contextMenuRef: menuRef,
        openContextMenu: open,
        openContextMenuWithEvent: openWithEvent,
        closeContextMenu: close
    };
}
