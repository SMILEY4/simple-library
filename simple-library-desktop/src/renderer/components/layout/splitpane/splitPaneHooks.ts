import {MutableRefObject} from 'react';

export interface PanelData {
    refPanel: MutableRefObject<any>,
    minSize: number,
    maxSize: number
}

export function useSplitPane(
    refFirst: MutableRefObject<any>,
    refSecond: MutableRefObject<any>,
) {

    function resize(d: number): void {
        console.log("resize " + d)
        const sizeFirst: number = refFirst.current.clientWidth; // todo: primary can be either first or second
        const newSizeFirst: number = sizeFirst + d;
        refFirst.current.style.flexBasis = newSizeFirst + "px";
        refSecond.current.style.flexBasis = undefined;
    }

    // todo: collapse/expand first or second

    return {
        resize: resize
    }

}

