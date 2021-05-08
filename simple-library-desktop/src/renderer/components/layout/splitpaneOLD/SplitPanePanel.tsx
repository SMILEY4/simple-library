import { BaseProps } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./splitpanepanel.css";

interface SplitPanePanelProps extends BaseProps {
    initialSize: string,
    minSize?: number,
    collapsed?: boolean,
}


export function SplitPanePanel(props: React.PropsWithChildren<SplitPanePanelProps>): ReactElement {

    return (
        <div className={"split-pane-panel"} ref={props.forwardRef} style={{ flexBasis: getFlexBasis() }}>
            {props.children}
        </div>
    );

    function getFlexBasis(): string {
        return props.collapsed === true
            ? props.minSize + "px"
            : props.initialSize;
    }

}
