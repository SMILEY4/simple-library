import "./splitpane.css";
import * as React from 'react';
import {MutableRefObject, ReactElement, useEffect, useRef} from 'react';
import {BaseProps, getReactElements} from '../../common/common';
import {Splitter} from './Splitter';
import {PanelData, useSplitPane} from './splitPaneHooks';


interface SplitPaneProps extends BaseProps {
    collapseTest: boolean
}

export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const children = buildChildren();
    const {dragSplitter, collapse} = useSplitPane(children.panelData);

    useEffect(() => { // temp: test collapse
        collapse(0, props.collapseTest, "in");
    }, [props.collapseTest]);


    return (
        <div {...props} className='split-pane'>
            {children.elements}
        </div>
    );


    function buildChildren(): { elements: ReactElement[], panelData: PanelData[] } {

        const outChildren: ReactElement[] = [];
        const panelData: PanelData[] = [];

        const inChildren: ReactElement[] = getReactElements(props.children);

        if (inChildren.length < 2) {
            throw("SplitPane must have at least two children!");
        }

        inChildren.forEach((child: ReactElement, index: number) => {
            const isLastChild: boolean = index == inChildren.length - 1;

            const panelRef: MutableRefObject<any> = useRef(null);
            panelData.push({
                refPanel: panelRef,
                minSize: child.props.minSize ? child.props.minSize : 0,
                maxSize: child.props.maxSize ? child.props.maxSize : Number.MAX_VALUE,
            });

            const newProps = {
                ...child.props,
                forwardRef: panelRef,
            };
            outChildren.push(React.cloneElement(child, newProps));

            if (!isLastChild) {
                outChildren.push(
                    <Splitter
                        __splitterIndex={index}
                        __onDrag={(index, diff) => dragSplitter(index, diff)}
                    />,
                );
            }

        });

        return {
            elements: outChildren,
            panelData: panelData,
        };
    }


    //
    // function renderContent() {
    //     let indexSplitter: number = 0;
    //     return getReactElements(props.children).map((child: ReactElement) => {
    //
    //         if (child.type === Splitter) {
    //             const splitterProps = {
    //                 ...child.props,
    //                 __splitterId: indexSplitter,
    //                 __onDrag: handleDragSplitter,
    //                 __onCollapse: handleCollapse,
    //             };
    //             indexSplitter++;
    //             return React.cloneElement(child, splitterProps);
    //         }
    //
    //         if (child.type === SplitPanePanel) {
    //
    //             const refPanel = useRef(null);
    //             panelRefs.push(refPanel);
    //             panelData.push({
    //                 minSize: child.props.minSize ? child.props.minSize : 0,
    //             });
    //
    //             const panelProps = {
    //                 ...child.props,
    //                 forwardRef: refPanel,
    //             };
    //             return React.cloneElement(child, panelProps);
    //         }
    //
    //         return null;
    //     });
    // }
    //
    //
    // function updateSizes(action: SplitPaneAction | null) {
    //     const totalPanelSize = getTotalPanelSizes();
    //     const oldPanelSizes: number[] = getCurrentPanelSizes();
    //     const newPanelSizes: number[] = calculatePanelSizes(oldPanelSizes, action);
    //     setSizes(sizesToPercentages(newPanelSizes, totalPanelSize));
    // }
    //
    // function getTotalPanelSizes() {
    //     return getCurrentPanelSizes().reduce((a, b) => a + b, 0);
    // }
    //
    // function getCurrentPanelSizes(): number[] {
    //     return panelRefs.map(refPanel => refPanel.current.clientWidth);
    // }
    //
    // function sizesToPercentages(sizes: number[], totalSize: number): string[] {
    //     return sizes
    //         .map(size => size / totalSize)
    //         .map(p => p * 100)
    //         .map(p => p + "%");
    // }
    //
    // function setSizes(sizes: string[]) {
    //     sizes.forEach((size, index) => {
    //         panelRefs[index].current.style.flexBasis = size;
    //     });
    // }
    //
    // /**
    //  * @param currentSizes the sizes of the panels in pixels
    //  * @param action the (optional) action to apply to the panels
    //  */
    // function calculatePanelSizes(currentSizes: number[], action: SplitPaneAction | null): number[] {
    //
    //     const newSizes: number[] = [...currentSizes];
    //
    //     if (action) {
    //         if (action.type === "drag-splitter") {
    //             const splitterIndex: number = action.payload.splitterIndex;
    //             const diff: number = action.payload.diff;
    //
    //             const sizeSum = currentSizes[splitterIndex] + currentSizes[splitterIndex + 1];
    //             const sizeFirst = Math.max(0, Math.min(currentSizes[splitterIndex] + diff, sizeSum));
    //             const sizeSecond = sizeSum - sizeFirst;
    //
    //             newSizes[splitterIndex] = sizeFirst;
    //             newSizes[splitterIndex + 1] = sizeSecond;
    //         }
    //
    //         if (action.type === "collapse-splitter") {
    //             const splitterIndex: number = action.payload.splitterIndex;
    //             const collapsed: boolean = action.payload.collapsed;
    //             const dir: string = action.payload.dir;
    //
    //             const sizeSum = currentSizes[splitterIndex] + currentSizes[splitterIndex + 1];
    //             let sizeFirst, sizeSecond;
    //
    //             if (collapsed) {
    //                 if (dir === "previous") {
    //                     sizeFirst = 0;
    //                     sizeSecond = sizeSum;
    //                 } else {
    //                     sizeFirst = sizeSum;
    //                     sizeSecond = 0;
    //                 }
    //             } else {
    //                 sizeFirst = sizeSum / 2;
    //                 sizeSecond = sizeSum / 2;
    //             }
    //
    //
    //             newSizes[splitterIndex] = sizeFirst;
    //             newSizes[splitterIndex + 1] = sizeSecond;
    //         }
    //
    //     }
    //
    //
    //     return newSizes;
    // }
    //
    //
    // function handleCollapse(splitterId: number, collapsed: boolean, collapseDir: string) {
    //
    //     updateSizes({
    //         type: "collapse-splitter",
    //         payload: {
    //             splitterIndex: splitterId,
    //             collapsed: collapsed,
    //             dir: collapseDir,
    //         },
    //     });
    //
    // }


    // function handleDragSplitter(splitterId: number, diff: number): void {
    //
    //     updateSizes({
    //         type: "drag-splitter",
    //         payload: {
    //             splitterIndex: splitterId,
    //             diff: diff,
    //         },
    //     });

    // const totalSize: number = panelRefs
    //     .map(refPanel => refPanel.current.clientWidth)
    //     .reduce((a, b) => a + b, 0);
    //
    // const panelSizes: number[] = panelRefs.map(refPanel => refPanel.current.clientWidth);
    //
    // const allowedDiff: number = calcAllowedDiff(
    //     diff,
    //     panelSizes[splitterId], panelSizes[splitterId + 1],
    //     panelData[splitterId].minSize, panelData[splitterId + 1].minSize,
    // );
    //
    // panelSizes[splitterId] += allowedDiff;
    // panelSizes[splitterId + 1] -= allowedDiff;
    //
    // panelSizes
    //     .map(size => size / totalSize)
    //     .map(p => p * 100)
    //     .map(p => p + "%")
    //     .forEach((percentage, index) => {
    //         panelRefs[index].current.style.flexBasis = percentage;
    //     });
    // }

    //
    //
    // function calcAllowedDiff(diff: number, size0: number, size1: number, min0: number, min1: number): number {
    //
    //     if (size0 + diff < min0) {
    //         return min0 - size0;
    //
    //     } else if (size1 - diff < min1) {
    //         return size1 - min1;
    //
    //     } else {
    //         return diff;
    //     }
    //
    // }

}
