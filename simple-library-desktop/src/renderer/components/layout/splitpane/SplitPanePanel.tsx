import {BaseProps} from '../../common/common';
import * as React from 'react';
import {ReactElement, useEffect} from 'react';
import "./splitpanepanel.css";

interface SplitPanePanelProps extends BaseProps {
    initialSize: string,

    minSize?: number,
    maxSize?: number,

    resizable?: boolean,

    collapseDir?: "in" | "against",
    collapsed?: boolean,

    __onChangeCollapse?: (collapsed: boolean, dir: "in" | "against") => void;
}


export function SplitPanePanel(props: React.PropsWithChildren<SplitPanePanelProps>): ReactElement {

    // useEffect(() => {
    //     props.__onChangeCollapse && props.__onChangeCollapse(props.collapsed, props.collapseDir)
    // }, [props.collapsed])

    return (
        <div className={"split-pane-panel"} ref={props.forwardRef} style={{flexBasis: getFlexBasis()}}>
            {props.children}
        </div>
    );

    function getFlexBasis(): string {
        return props.collapsed === true
            ? props.minSize + "px"
            : props.initialSize;
    }

}
