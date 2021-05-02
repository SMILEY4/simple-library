import "./splitpane.css";
import * as React from 'react';
import { MutableRefObject, ReactElement, useRef } from 'react';
import { BaseProps } from '../../common/common';
import { Splitter } from './Splitter';
import { getReactElements } from '../../base/slot/Slot';

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

        const elements: ReactElement[] = getReactElements(props.children);

        const panels: ReactElement[] = [];
        for (let i = 0; i < elements.length; i++) {
            const elementRef = useRef(null);
            panelRefs.push(elementRef);
            panels.push(
                <div
                    className={"split-pane-panel"}
                    ref={elementRef}
                    style={{
                        flexBasis: (100 / elements.length) + "%",
                    }}>
                    {elements[i]}
                </div>,
            );
        }

        const content: ReactElement[] = [];
        for (let i = 0; i < panels.length - 1; i++) {
            const panel: ReactElement = panels[i];
            content.push(panel);
            content.push(<Splitter splitterId={i} onDrag={handleDragSplitter} />);
        }
        content.push(panels[panels.length - 1]);

        return content;
    }

    function handleDragSplitter(splitterId: number, diff: number): void {

        const splitterSize = 5;
        const totalSize: number = refSplitPane.current.clientWidth - (splitterSize * (panelRefs.length - 1));

        const refPanel0 = panelRefs[splitterId];
        const refPanel1 = panelRefs[splitterId + 1];

        const nextSizePanel0 = refPanel0.current.clientWidth + diff;
        const nextSizePanel1 = refPanel1.current.clientWidth - diff;

        const nextPercentagePanel0 = nextSizePanel0 / totalSize;
        const nextPercentagePanel1 = nextSizePanel1 / totalSize;

        refPanel0.current.style.flexBasis = (nextPercentagePanel0 * 100) + "%";
        refPanel1.current.style.flexBasis = (nextPercentagePanel1 * 100) + "%";

    }


}
