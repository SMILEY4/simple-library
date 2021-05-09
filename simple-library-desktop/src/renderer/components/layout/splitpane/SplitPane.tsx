import "./splitpane.css";
import * as React from 'react';
import {MutableRefObject, ReactElement, useEffect, useRef} from 'react';
import {BaseProps, getReactElements} from '../../common/common';
import {Splitter} from './Splitter';
import {PanelData, useSplitPane} from './splitPaneHooks';


interface SplitPaneProps extends BaseProps {
    collapseA: boolean,
    collapseB: boolean,
    collapseC: boolean
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

export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const children = buildChildren();
    const {dragSplitter, collapse} = useSplitPane(children.panelData);

    useEffect(() => { // temp: test collapse A
        collapse(0, props.collapseA, "against");
    }, [props.collapseA]);

    useEffect(() => { // temp: test collapse B
        collapse(1, props.collapseB, "against");
    }, [props.collapseB]);

    useEffect(() => { // temp: test collapse C
        collapse(2, props.collapseC, "in");
    }, [props.collapseC]);


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
                // __onChangeCollapse: (collapsed: boolean, dir: "in" | "against") => handleOnChangeCollapse(index, collapsed, dir)
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


    function handleOnChangeCollapse(index: number, collapsed: boolean, dir: "in" | "against") {
        // console.log("CHANGE COLLAPSED: " + index + " => " + collapsed + " " + dir)
        // collapse(index, collapsed, dir);
    }

}
