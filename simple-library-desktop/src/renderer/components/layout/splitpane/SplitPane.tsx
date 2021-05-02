import "./splitpane.css";
import * as React from 'react';
import { MutableRefObject, ReactElement, useRef } from 'react';
import { BaseProps } from '../../common/common';
import { Splitter } from './Splitter';
import { useStateRef } from '../../common/commonHooks';
import { getReactElements } from '../../base/slot/Slot';

interface SplitPaneProps extends BaseProps {
}


export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const panelRefs: MutableRefObject<any>[] = [];
    const [panelPercentages, setPanelPercentages, refPanelPercentages] = useStateRef([]);


    const [percentages, setPercentages, refPercentages] = useStateRef({
        left: "50%",
        right: "50%",
    });
    const refSplitPane: MutableRefObject<any> = useRef(null);
    const refLeft: MutableRefObject<any> = useRef(null);
    const refRight: MutableRefObject<any> = useRef(null);

    renderContent();

    return (
        <div {...props} className='split-pane' ref={refSplitPane}>
            <div className={"split-pane-panel"} ref={refLeft} style={{ backgroundColor: "#7f7fff", flexBasis: percentages.left }} />
            <Splitter onDrag={handleDragSplitter} />
            <div className={"split-pane-panel"} ref={refRight} style={{ backgroundColor: "#ff7f7f", flexBasis: percentages.right }} />
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
                        backgroundColor: "#7f7fff",
                        flexBasis: percentages.left,
                    }}>
                    {elements[i]}
                </div>,
            );
        }

        const content: ReactElement[] = [];
        for (let i = 0; i < panels.length - 1; i++) {
            const panel: ReactElement = panels[i];
            content.push(panel);
            content.push(<Splitter onDrag={handleDragSplitter} />);
        }
        content.push(panels[panels.length - 1]);

        return content;
    }

    function handleDragSplitter(diff: number): void {
        const splitterSize = 5;
        const prevWidthLeft = refLeft.current.clientWidth;
        const prevWidthRight = refRight.current.clientWidth;
        const widthTotal = refSplitPane.current.clientWidth - splitterSize;
        setPercentages({
            left: ((prevWidthLeft + diff) / widthTotal * 100) + "%",
            right: ((prevWidthRight - diff) / widthTotal * 100) + "%",
        });
    }


}
