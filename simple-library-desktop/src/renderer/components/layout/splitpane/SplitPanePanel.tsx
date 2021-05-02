import { BaseProps } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./splitpanepanel.css";

interface SplitPanePanelProps extends BaseProps {
    size: string,
}


export function SplitPanePanel(props: React.PropsWithChildren<SplitPanePanelProps>): ReactElement {

    return (
        <div className={"split-pane-panel"} ref={props.forwardRef} style={{ flexBasis: props.size }}>
            {props.children}
        </div>
    );

}
