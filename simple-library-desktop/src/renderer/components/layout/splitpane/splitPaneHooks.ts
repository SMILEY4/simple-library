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

    console.log("USE SP")

    function doDragSplitter(splitterIndex: number, diff: number) {

        console.log("drag splitter " + splitterIndex + " " + diff)

        const sizesPx: number[] = getCurrentSizesPx();
        const totalSizePx: number = calcTotalSizePx(sizesPx);

        const panelDataBefore: PanelData = dataPanels[splitterIndex];
        const panelDataAfter: PanelData = dataPanels[splitterIndex + 1];

        const sizePxBefore: number = sizesPx[splitterIndex];
        const sizePxAfter: number = sizesPx[splitterIndex + 1];
        const sizePxSum: number = sizePxBefore + sizePxAfter;

        let possibleDiff: number;
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

        console.log("C/E " + panelIndex + " " + collapse + " " + collapseDir + "  BC:" + JSON.stringify(sizesBC))

        if (collapse) {
            console.log("REMEMBER " + getCurrentSizesPx()[panelIndex] + "  @" + panelIndex)
            refSizesBC.current[panelIndex] = getCurrentSizesPx()[panelIndex];
        } else if (sizesBC[panelIndex] === null) {
            return;
        }

        const data: PanelData = dataPanels[panelIndex];

        console.log("LAST: " + sizesBC[panelIndex])

        const targetSize: number = collapse
            ? data.minSize
            : clamp(data.minSize, sizesBC[panelIndex], data.maxSize);

        const newSizesPx: number[] = setPanelSize(panelIndex, targetSize, collapseDir)
        applySizesPxAsPc(newSizesPx);
    }

    function setPanelSize(panelIndex: number, targetSizePx: number, collapseDir: "in" | "against"): number[] {

        console.log("set size " + panelIndex + " " + targetSizePx)

        const sizes: number[] = getCurrentSizesPx();
        const total: number = calcTotalSizePx(sizes);

        sizes[panelIndex] = targetSizePx;

        const newTotal: number = calcTotalSizePx(sizes);
        const diffTotal: number = total - newTotal;

        propagateDiff(panelIndex, diffTotal, sizes, collapseDir === "in" ? "against" : "in");

        return sizes;
    }

    function propagateDiff(indexStart: number, totalDiff: number, sizes: number[], dir: "in" | "against"): number {
        if (dir === "in") {
            const currentIndex: number = indexStart + 1;
            if (currentIndex == sizes.length) {
                return totalDiff;
            } else {
                const remainingDiff: number = applyDiff(currentIndex, totalDiff, sizes);
                return propagateDiff(currentIndex, remainingDiff, sizes, dir);
            }
        }
        if (dir === "against") {
            const currentIndex: number = indexStart - 1;
            if (currentIndex === -1) {
                return totalDiff;
            } else {
                const remainingDiff: number = applyDiff(currentIndex, totalDiff, sizes);
                return propagateDiff(currentIndex, remainingDiff, sizes, dir);
            }
        }
        return 0;
    }

    function applyDiff(index: number, totalDiff: number, sizes: number[]): number {
        const leeway = getLeeway(index);
        const possibleDiff: number = clamp(leeway.smaller, totalDiff, leeway.larger)
        const remainingDiff: number = totalDiff - possibleDiff;
        sizes[index] = getCurrentSizePx(index) + possibleDiff;
        return remainingDiff;
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

    function applySizesPxAsPc(sizesPx: number[]) {
        const totalPx: number = calcTotalSizePx(sizesPx);
        const sizesPc: number[] = sizesPxToPc(sizesPx, totalPx);
        applySizes(sizesPc.map(s => s * 100), "%");
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

