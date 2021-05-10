import {BaseProps, concatClasses} from '../../common/common';
import * as React from 'react';
import {ReactElement} from 'react';
import "./splitpanepanel.css";

interface SplitPanePanelProps extends BaseProps {
    initialSize: string,
    minSize?: number,
    maxSize?: number,
    __primary?: boolean
}


export function SplitPanePanel(props: React.PropsWithChildren<SplitPanePanelProps>): ReactElement {
    return (
        <div
            className={concatClasses("split-panel", props.__primary ? "split-panel-primary" : "split-panel-secondary")}
            ref={props.forwardRef}
            style={{
                minWidth: props.minSize,
                maxWidth: props.maxSize,
                flexBasis: props.__primary ? props.initialSize : undefined
            }}
        >
            {props.children}
        </div>
    );
}
