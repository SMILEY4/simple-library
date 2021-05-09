import {MutableRefObject} from 'react';
import {useStateRef} from '../../common/commonHooks';
import {clamp, fillArray} from '../../common/common';

export interface PanelData {
    refPanel: MutableRefObject<any>,
    minSize: number,
    maxSize: number
}

export function useSplitPane(dataPanels: PanelData[]) {

    const [
        sizesBC,
        setSizesBC,
        refSizesBC,
    ] = useStateRef<(number | null)[]>(fillArray(null, dataPanels.length));


    function doDragSplitter(splitterIndex: number, diff: number) {

        const sizesPx: number[] = getCurrentSizesPx();
        const totalSizePx: number = calcTotalSizePx(sizesPx);

        const panelDataBefore: PanelData = dataPanels[splitterIndex];
        const panelDataAfter: PanelData = dataPanels[splitterIndex + 1];

        const sizePxBefore: number = sizesPx[splitterIndex];
        const sizePxAfter: number = sizesPx[splitterIndex + 1];
        const sizePxSum: number = sizePxBefore + sizePxAfter;

        let possibleDiff: number = diff;
        if (diff > 0) { // before.max, after.min
            const beforeMaxDiff: number = panelDataBefore.maxSize - sizePxBefore;
            const afterMaxDiff: number = sizePxAfter - panelDataAfter.minSize;
            possibleDiff = Math.min(diff, Math.min(beforeMaxDiff, afterMaxDiff));

        } else { // before.min, after.max
            const beforeMaxDiff: number = panelDataBefore.minSize - sizePxBefore;
            const afterMaxDiff: number = sizePxAfter - panelDataAfter.maxSize;
            possibleDiff = Math.max(diff, Math.max(beforeMaxDiff, afterMaxDiff));
        }

        const newSizePxBefore: number = sizePxBefore + possibleDiff;
        const newSizePxAfter: number = sizePxSum - newSizePxBefore;

        sizesPx[splitterIndex] = newSizePxBefore;
        sizesPx[splitterIndex + 1] = newSizePxAfter;

        const sizesPc: number[] = sizesPxToPc(sizesPx, totalSizePx);
        applySizes(sizesPc.map(s => s * 100), "%");

        refSizesBC.current[splitterIndex] = null;
        refSizesBC.current[splitterIndex + 1] = null;
    }


    function doCollapseOrExpand(panelIndex: number, collapse: boolean, collapseDir: "in" | "against") {

        if (collapse) {
            refSizesBC.current[panelIndex] = getCurrentSizesPx()[panelIndex];
        } else if (sizesBC[panelIndex] === null) {
            return;
        }

        const panelData: PanelData = dataPanels[panelIndex];

        const panelTargetSize: number = collapse
            ? dataPanels[panelIndex].minSize
            : clamp(panelData.minSize, sizesBC[panelIndex], panelData.maxSize);

        const newSizesPx: number[] = setPanelSize(panelIndex, panelTargetSize, collapseDir)
        const newTotalSizePx: number = calcTotalSizePx(newSizesPx);
        const newSizesPc: number[] = sizesPxToPc(newSizesPx, newTotalSizePx);
        applySizes(newSizesPc.map(s => s * 100), "%");
    }


    function setPanelSize(panelIndex: number, targetSizePx: number, collapseDir: "in" | "against"): number[] {

        const sizesPx: number[] = getCurrentSizesPx();
        const oldTotalSizePx: number = calcTotalSizePx(sizesPx);

        sizesPx[panelIndex] = targetSizePx;

        const newTotalSizePx: number = calcTotalSizePx(sizesPx);
        const diffTotalSize: number = newTotalSizePx - oldTotalSizePx;
        propagateDiff(sizesPx, panelIndex, -diffTotalSize, collapseDir);

        return sizesPx;
    }


    function propagateDiff(sizesPx: number[], indexSource: number, diffPx: number, direction: string) {
        let remainingDiffPx: number = diffPx;

        console.log("PROP: " + diffPx + "  " + direction)

        if (direction === "against") {
            for (let i = indexSource + 1; i < sizesPx.length && Math.abs(remainingDiffPx) > 0; i++) {
                const result = propagateDiffTo(sizesPx[i], dataPanels[i], remainingDiffPx);
                sizesPx[i] = result.newSizePx;
                remainingDiffPx = result.remainingDiffPx;
            }
        }
        if (direction === "in") {
            for (let i = indexSource - 1; i >= 0 && Math.abs(remainingDiffPx) > 0; i--) {
                const result = propagateDiffTo(sizesPx[i], dataPanels[i], remainingDiffPx);
                sizesPx[i] = result.newSizePx;
                remainingDiffPx = result.remainingDiffPx;
            }
        }

        console.log("REMAINING AFTER PROPAGATION: " + remainingDiffPx)
    }


    function propagateDiffTo(sizePx: number, panelData: PanelData, diff: number): { newSizePx: number, remainingDiffPx: number } {
        const targetSize: number = clamp(panelData.minSize, sizePx + diff, panelData.maxSize);
        const possibleDiff: number = targetSize - sizePx;
        return {
            newSizePx: sizePx + possibleDiff,
            remainingDiffPx: diff - possibleDiff
        }
    }

    function getLeeway(indexPanel: number): { smaller: number, larger: number } {
        const currentSize: number = getCurrentSizePx(indexPanel);
        const data: PanelData = dataPanels[indexPanel];
        return {
            smaller: data.minSize - currentSize,
            larger: data.maxSize - currentSize
        }
    }

    function getCurrentSizesPx(): number[] {
        return dataPanels.map(data => data.refPanel.current.clientWidth);
    }


    function getCurrentSizePx(index: number) {
        return dataPanels[index].refPanel.current.clientWidth;
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
        dataPanels[index].refPanel.current.style.flexBasis = size + unit;
    }


    return {
        dragSplitter: doDragSplitter,
        collapse: doCollapseOrExpand,
    };
}

