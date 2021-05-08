import "./splitpane.css";
import * as React from 'react';
import { MutableRefObject, ReactElement, useEffect, useRef } from 'react';
import { BaseProps, getReactElements } from '../../common/common';
import { Splitter } from './Splitter';
import { SplitPanePanel } from './SplitPanePanel';

interface SplitPaneProps extends BaseProps {
}

// TODO
//  - inspiration: https://greggman.github.io/react-split-it
//  - improve function to recalc sizes:
//      - https://github.com/greggman/react-split-it/blob/main/src/stable-gutters-compute-new-sizes.js
//      - https://github.com/greggman/react-split-it/blob/main/src/move-gutters-compute-new-sizes.js
//  - collapse function for splitter
//      - props:
//          * collapseDir = direction in which to collapse
//          * canCollapse = collapse on click
//          * forceCollapse = overwrite internal collapse logic (canCollapse is ignored) -> listen to change via useEffect(), listener in Splitter-Component ?

export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const refSplitPane: MutableRefObject<any> = useRef(null);
    const panelRefs: MutableRefObject<any>[] = [];
    const panelData: any[] = [];

    useEffect(() => {
        console.log("use Effect")
    })

    return (
        <div {...props} className='split-pane' ref={refSplitPane}>
            {renderContent()}
        </div>
    );

    function renderContent() {
        let indexSplitter: number = 0;
        return getReactElements(props.children)
            .map((child: ReactElement) => {

                if (child.type === Splitter) {
                    const splitterProps = {
                        ...child.props,
                        __splitterId: indexSplitter,
                        __onDrag: handleDragSplitter,
                    };
                    indexSplitter++;
                    return React.cloneElement(child, splitterProps);
                }

                if (child.type === SplitPanePanel) {

                    const refPanel = useRef(null);
                    panelRefs.push(refPanel);
                    panelData.push({
                        minSize: child.props.minSize ? child.props.minSize : 0,
                    });

                    const panelProps = {
                        ...child.props,
                        forwardRef: refPanel,
                    };
                    return React.cloneElement(child, panelProps);
                }

                return null;
            });
    }

    function handleDragSplitter(splitterId: number, diff: number): void {

        const totalSize: number = panelRefs
            .map(refPanel => refPanel.current.clientWidth)
            .reduce((a, b) => a + b, 0);

        const panelSizes: number[] = panelRefs.map(refPanel => refPanel.current.clientWidth);

        const allowedDiff: number = calcAllowedDiff(
            diff,
            panelSizes[splitterId], panelSizes[splitterId + 1],
            panelData[splitterId].minSize, panelData[splitterId + 1].minSize
        );

        panelSizes[splitterId] += allowedDiff;
        panelSizes[splitterId + 1] -= allowedDiff;

        panelSizes
            .map(size => size / totalSize)
            .map(p => p * 100)
            .map(p => p + "%")
            .forEach((percentage, index) => {
                panelRefs[index].current.style.flexBasis = percentage;
            });
    }


    function calcAllowedDiff(diff: number, size0: number, size1: number, min0: number, min1: number): number {

        if (size0 + diff < min0) {
            return min0 - size0;

        } else if (size1 - diff < min1) {
            return size1 - min1;

        } else {
            return diff;
        }

    }

}
