import * as React from 'react';
import {ReactElement} from 'react';
import "./splitpanepanel.css";
import {BaseProps} from "../../common";
import {concatClasses, getIf} from "../../../components/common/common";

interface SplitPanePanelProps extends BaseProps {
    initialSize: string,
    minSize?: string,
    maxSize?: string,
    primary?: boolean
    __mode?: "vertical" | "horizontal",
}

export function SplitPanePanel(props: React.PropsWithChildren<SplitPanePanelProps>): ReactElement {
    return (
        <div
            className={concatClasses("split-panel", props.primary ? "split-panel-primary" : "split-panel-secondary")}
            ref={props.forwardRef}
            style={{
                minWidth: getIf(props.__mode === "vertical", props.minSize),
                maxWidth: getIf(props.__mode === "vertical", props.maxSize),
                minHeight: getIf(props.__mode === "horizontal", props.minSize),
                maxHeight: getIf(props.__mode === "horizontal", props.maxSize),
                flexBasis: props.primary ? props.initialSize : undefined
            }}
        >
            {props.children}
        </div>
    );
}
