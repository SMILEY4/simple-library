import "./splitpane.css";
import * as React from 'react';
import {MutableRefObject, ReactElement, useEffect, useRef} from 'react';
import {BaseProps, concatClasses, getReactElements, map} from '../../common/common';
import {Splitter} from './Splitter';
import {useSplitPane} from './splitPaneHooks';
import {SplitPanePanel} from "./SplitPanePanel";


interface SplitPaneProps extends BaseProps {
    mode: "vertical" | "horizontal",
    primaryCollapsed?: boolean,
    primaryAsPercentage?: boolean,
}

interface SplitPaneContentData {
    children: ReactElement[],
    refFirstPanel: MutableRefObject<any>,
    refSecondPanel: MutableRefObject<any>,
    firstIsPrimary: boolean
}

export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

    const content: SplitPaneContentData = buildContent();
    const {
        resize,
        expandOrCollapse
    } = useSplitPane(props.mode, props.primaryAsPercentage, content.refFirstPanel, content.refSecondPanel, content.firstIsPrimary);

    useEffect(() => resize(0))
    useEffect(() => expandOrCollapse(props.primaryCollapsed), [props.primaryCollapsed])

    return (
        <div {...props} className={concatClasses('split-pane', map(props.mode, mode => "split-pane-" + mode))}>
            {content.children}
        </div>
    );


    function buildContent(): SplitPaneContentData {

        const childrenPanels: ReactElement[] = getReactElements(props.children)
            .filter(child => child.type === SplitPanePanel);

        if (childrenPanels.length !== 2) {
            throw("SplitPane must have exactly two children!");
        }

        const content: ReactElement[] = [];
        const refFirstPanel: MutableRefObject<any> = useRef(null);
        const refSecondPanel: MutableRefObject<any> = useRef(null);

        const firstIsPrimary: boolean = childrenPanels[1].props.primary !== true;

        content.push(React.cloneElement(childrenPanels[0], {
            ...childrenPanels[0].props,
            forwardRef: refFirstPanel,
            primary: firstIsPrimary,
            __mode: props.mode
        }))

        content.push(<Splitter mode={props.mode} __onDrag={(d: number) => resize(d)}/>);

        content.push(React.cloneElement(childrenPanels[1], {
            ...childrenPanels[1].props,
            forwardRef: refSecondPanel,
            primary: !firstIsPrimary,
            __mode: props.mode
        }))

        return {
            children: content,
            refFirstPanel: refFirstPanel,
            refSecondPanel: refSecondPanel,
            firstIsPrimary: firstIsPrimary
        };
    }

}


interface VSplitPaneProps extends Omit<SplitPaneProps, 'mode'> {

}

export function VSplitPane(props: React.PropsWithChildren<VSplitPaneProps>): ReactElement {
    const baseProps: SplitPaneProps = {
        mode: "vertical",
        ...props,
    };
    return (
        <SplitPane {...baseProps} />
    );
}

interface HSplitPaneProps extends Omit<SplitPaneProps, 'mode'> {

}

export function HSplitPane(props: React.PropsWithChildren<HSplitPaneProps>): ReactElement {
    const baseProps: SplitPaneProps = {
        mode: "horizontal",
        ...props,
    };
    return (
        <SplitPane {...baseProps} />
    );
}
