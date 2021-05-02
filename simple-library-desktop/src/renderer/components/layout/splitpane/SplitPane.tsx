import "./splitpane.css";
import * as React from 'react';
import { MutableRefObject, ReactElement, useRef } from 'react';
import { BaseProps, getReactElements } from '../../common/common';
import { Splitter } from './Splitter';
import { SplitPanePanel } from './SplitPanePanel';

interface SplitPaneProps extends BaseProps {
}


export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const refSplitPane: MutableRefObject<any> = useRef(null);
    const panelRefs: MutableRefObject<any>[] = [];

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
        panelSizes[splitterId] += diff;
        panelSizes[splitterId + 1] -= diff;

        panelSizes
            .map(size => size / totalSize)
            .map(p => p * 100)
            .map(p => p + "%")
            .forEach((percentage, index) => {
                panelRefs[index].current.style.flexBasis = percentage;
            });
    }


}
