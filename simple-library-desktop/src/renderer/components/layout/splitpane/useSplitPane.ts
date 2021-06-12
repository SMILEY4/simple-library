import {MutableRefObject} from 'react';
import {useStateRef} from "../../utils/commonHooks";

export function useSplitPane(
    mode: "vertical" | "horizontal",
    primaryAsPercentage: boolean,
    refFirst: MutableRefObject<any>,
    refSecond: MutableRefObject<any>,
    firstIsPrimary: boolean,
) {

    const [sizeBeforeCollapse, setSizeBeforeCollapse, refSizeBeforeCollapse] = useStateRef<string>(null)

    function resize(d: number): number {

        const refPrimary: MutableRefObject<any> = firstIsPrimary ? refFirst : refSecond;
        const refSecondary: MutableRefObject<any> = firstIsPrimary ? refSecond : refFirst;

        const prevSizePrimary = sizePrimary();
        const prevSizeSecondary = sizeSecondary();
        const prevTotalSize = prevSizePrimary + prevSizeSecondary;

        const newSizePrimary: number = firstIsPrimary ? (prevSizePrimary + d) : (prevSizePrimary - d);

        refPrimary.current.style.flexBasis = primaryAsPercentage
            ? ((newSizePrimary / prevTotalSize) * 100) + "%"
            : newSizePrimary + "px";
        refSecondary.current.style.flexBasis = undefined;

        refSizeBeforeCollapse.current = null;

        return newSizePrimary;
    }

    function expandOrCollapse(collapsePanel: boolean) {
        if (collapsePanel) {
            collapse();
        } else {
            expand();
        }
    }

    function collapse() {
        const refPrimary: MutableRefObject<any> = firstIsPrimary ? refFirst : refSecond;
        setSizeBeforeCollapse(refPrimary.current.style.flexBasis);
        refPrimary.current.style.flexBasis = "0px";
    }

    function expand() {
        if (sizeBeforeCollapse) {
            const refPrimary: MutableRefObject<any> = firstIsPrimary ? refFirst : refSecond;
            refPrimary.current.style.flexBasis = sizeBeforeCollapse;
            setSizeBeforeCollapse(null);
        }
    }

    function sizePrimary(): number {
        const refPrimary = firstIsPrimary ? refFirst : refSecond;
        return mode === "vertical"
            ? refPrimary.current.clientWidth
            : refPrimary.current.clientHeight;
    }


    function sizeSecondary() {
        const refSecondary = firstIsPrimary ? refSecond : refFirst;
        return mode === "vertical"
            ? refSecondary.current.clientWidth
            : refSecondary.current.clientHeight;
    }

    return {
        resize: resize,
        expandOrCollapse: expandOrCollapse,
    }

}

