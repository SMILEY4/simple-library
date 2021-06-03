import "./splitpane.css";
import * as React from 'react';
import {MutableRefObject, ReactElement, useEffect, useRef} from 'react';
import {BaseProps, concatClasses, getReactElements, map} from '../../common/common';
import {Divider} from './Divider';
import {useSplitPane} from './useSplitPane';
import {SplitPanePanel} from "./SplitPanePanel";
import {getChildOfSlot} from "../../base/slot/Slot";

export const SLOT_DIVIDER = "divider";

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

        const content: ReactElement[] = [];
        const refFirstPanel: MutableRefObject<any> = useRef(null);
        const refSecondPanel: MutableRefObject<any> = useRef(null);

        const childrenPanels: ReactElement[] = getPanelChildren();
        const firstIsPrimary: boolean = childrenPanels[1].props.primary !== true;

        content.push(enrichPanel(childrenPanels[0], refFirstPanel, firstIsPrimary));
        content.push(buildDivider());
        content.push(enrichPanel(childrenPanels[1], refSecondPanel, !firstIsPrimary));

        return {
            children: content,
            refFirstPanel: refFirstPanel,
            refSecondPanel: refSecondPanel,
            firstIsPrimary: firstIsPrimary
        };
    }

    function getPanelChildren() {
        const childrenPanels: ReactElement[] = getReactElements(props.children)
            .filter(child => child.type === SplitPanePanel);
        if (childrenPanels.length !== 2) {
            throw("SplitPane must have exactly two children!");
        } else {
            return childrenPanels;
        }
    }


    function enrichPanel(panel: ReactElement, ref: MutableRefObject<any>, isPrimary: boolean) {
        return React.cloneElement(panel, {
            ...panel.props,
            forwardRef: ref,
            primary: isPrimary,
            __mode: props.mode
        });
    }

    function buildDivider() {
        const dividerTemplate: ReactElement | undefined = getChildOfSlot(props.children, SLOT_DIVIDER)
        if (dividerTemplate) {
            return React.cloneElement(dividerTemplate, {
                ...dividerTemplate.props,
                __mode: props.mode,
                __onDrag: (d: number) => resize(d)
            })
        } else {
            return (
                <Divider __mode={props.mode} __onDrag={(d: number) => resize(d)}/>
            );
        }
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
