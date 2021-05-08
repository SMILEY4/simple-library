import {MutableRefObject} from 'react';
import {useStateRef} from '../../common/commonHooks';
import {fillArray} from '../../common/common';

interface SizeBeforeCollapse {
    sizePx: number,
}

export function useSplitPane(panelRefs: MutableRefObject<any>[]) {

    const [
        sizesBC,
        setSizesBC,
        refSizesBC,
    ] = useStateRef<(SizeBeforeCollapse | null)[]>(fillArray(null, panelRefs.length));


    function doDragSplitter(splitterIndex: number, diff: number) {
        const sizesPx: number[] = getCurrentSizesPx();
        const totalSizePx: number = calcTotalSizePx(sizesPx);

        const sizePxBefore: number = sizesPx[splitterIndex];
        const sizePxAfter: number = sizesPx[splitterIndex + 1];
        const sizePxSum: number = sizePxBefore + sizePxAfter;

        const newSizePxBefore: number = Math.max(0, Math.min(sizePxBefore + diff, sizePxSum));
        const newSizePxAfter: number = sizePxSum - newSizePxBefore;

        sizesPx[splitterIndex] = newSizePxBefore;
        sizesPx[splitterIndex + 1] = newSizePxAfter;

        const sizesPc: number[] = sizesPxToPc(sizesPx, totalSizePx);
        applySizes(sizesPc.map(s => s * 100), "%");

        refSizesBC.current[splitterIndex] = null;
        refSizesBC.current[splitterIndex + 1] = null;
    }


    function doCollapse(panelIndex: number, collapsed: boolean, collapseDir: string) {
        if (collapsed) {
            refSizesBC.current[panelIndex] = {sizePx: getCurrentSizesPx()[panelIndex]};
        } else if (sizesBC[panelIndex] === null) {
            return;
        }
        const panelTargetSize = collapsed ? 0 : sizesBC[panelIndex].sizePx;
        const sizesPx: number[] = setPanelSize(panelIndex, panelTargetSize, collapseDir)
        const totalSizePx: number = calcTotalSizePx(sizesPx);
        const sizesPc: number[] = sizesPxToPc(sizesPx, totalSizePx);
        applySizes(sizesPc.map(s => s * 200), "%");
    }


    function setPanelSize(panelIndex: number, targetSizePx: number, collapseDir: string): number[] {

        const sizesPx: number[] = getCurrentSizesPx();
        const totalSizePx: number = calcTotalSizePx(sizesPx);

        sizesPx[panelIndex] = targetSizePx;

        const newTotalSizePx: number = calcTotalSizePx(sizesPx);
        const diffTotalSize: number = newTotalSizePx - totalSizePx;
        propagateDiff(sizesPx, panelIndex, -diffTotalSize, collapseDir);

        return sizesPx;
    }


    function propagateDiff(sizesPx: number[], indexSource: number, diffPx: number, direction: string) {
        let remainingDiffPx: number = diffPx;

        if (direction === "against") {
            for (let i = indexSource + 1; i < sizesPx.length && Math.abs(remainingDiffPx) > 0; i++) {
                const result = applyPropagationTo(sizesPx[i], remainingDiffPx);
                sizesPx[i] = result.newSizePx;
                remainingDiffPx = result.remainingDiffPx;
            }
        }
        if (direction === "in") {
            for (let i = indexSource - 1; i >= 0 && Math.abs(remainingDiffPx) > 0; i--) {
                const result = applyPropagationTo(sizesPx[i], remainingDiffPx);
                sizesPx[i] = result.newSizePx;
                remainingDiffPx = result.remainingDiffPx;
            }
        }
    }


    function applyPropagationTo(sizePx: number, diff: number): { newSizePx: number, remainingDiffPx: number } {

        let d: number;

        if (diff < 0) { // make smaller
            if (Math.abs(diff) > sizePx) {
                d = -sizePx;
            } else {
                d = diff;
            }

        } else { // make larger
            d = diff;
        }

        return {
            newSizePx: sizePx + d,
            remainingDiffPx: diff - d
        }
    }


    function getCurrentSizesPx(): number[] {
        return panelRefs.map(refPanel => refPanel.current.clientWidth);
    }


    function getCurrentSizesPc(): number[] {
        const sizesPx: number[] = getCurrentSizesPx();
        const totalSizePx: number = calcTotalSizePx(sizesPx);
        return sizesPxToPc(sizesPx, totalSizePx);
    }


    function calcTotalSizePx(sizesPx: number[]): number {
        return sizesPx.reduce((a, b) => a + b, 0);
    }


    function sizesPxToPc(sizesPx: number[], sizeTotal: number): number[] {
        return sizesPx.map(s => s / sizeTotal);
    }


    function applySizes(sizes: number[], unit: string) {
        sizes.forEach((size: number, index: number) => {
            applySizeAt(index, size, unit);
        });
    }

    function applySizeAt(index: number, size: number, unit: string) {
        panelRefs[index].current.style.flexBasis = size + unit;
    }


    return {
        dragSplitter: doDragSplitter,
        collapse: doCollapse,
    };
}

