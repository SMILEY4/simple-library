import {MutableRefObject} from "react";

export function useAppLayout(
    refSidebarLeft: MutableRefObject<any>,
    refSidebarRight: MutableRefObject<any>
) {


    function doResizeLeft(d: number) {
        const size = refSidebarLeft.current.clientWidth + d;
        refSidebarLeft.current.style.flexBasis = size + "px"
    }

    function doResizeRight(d: number) {
        const size = refSidebarRight.current.clientWidth - d;
        refSidebarRight.current.style.flexBasis = size + "px"
    }

    return {
        resizeLeft: doResizeLeft,
        resizeRight: doResizeRight
    }

}
