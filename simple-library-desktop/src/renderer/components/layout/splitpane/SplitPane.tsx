import "./splitpane.css";
import * as React from 'react';
import {MutableRefObject, ReactElement, useRef} from 'react';
import {BaseProps, getReactElements} from '../../common/common';
import {Splitter} from './Splitter';
import {useSplitPane} from './splitPaneHooks';


interface SplitPaneProps extends BaseProps {
}

/*
TODO IDEA: simplify
 - https://github.com/tomkp/react-split-pane
 - split pane has exactly 2 children/panels
 - easier to calculate / update / handle / extend
    - drag-resizer: no propagation, only update size of first, browser takes care of second panel
    - collapse/expand: set size of panel, browser takes care of second other
    - more flexible sizes possible: px, %
    - one panel is "primary" = set fixed size, size of secondary is computed by browser
    - set flex-base of primary, allow secondary to grow/shrink accordingly
 - nest splitPane in splitPane to allow multiple columns/rows
 */

interface SplitPaneContentData {
    children: ReactElement[],
    refFirstPanel: MutableRefObject<any>,
    refSecondPanel: MutableRefObject<any>,
}

export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const content = buildContent();
    const {resize} = useSplitPane(content.refFirstPanel, content.refSecondPanel);


    return (
        <div {...props} className='split-pane'>
            {content.children}
        </div>
    );


    function buildContent(): SplitPaneContentData {

        const children: ReactElement[] = getReactElements(props.children);

        if (children.length !== 2) {
            throw("SplitPane must have exactly two children!");
        }

        const content: ReactElement[] = [];
        const refFirstPanel: MutableRefObject<any> = useRef(null);
        const refSecondPanel: MutableRefObject<any> = useRef(null);

        content.push(React.cloneElement(children[0], {
            ...children[0].props,
            forwardRef: refFirstPanel,
            __primary: true // todo: choose primary
        }))

        content.push(<Splitter __onDrag={(d:number) => resize(d)}/>);

        content.push(React.cloneElement(children[1], {
            ...children[1].props,
            forwardRef: refSecondPanel,
            __primary: false // todo: choose primary
        }))

        return {
            children: content,
            refFirstPanel: refFirstPanel,
            refSecondPanel: refSecondPanel
        };
    }


}
