import * as React from 'react';
import { ReactElement } from 'react';
import { BaseProps, ClickableProps, ColorType, concatClasses, GroupPosition, map, Size } from '../common';
import "./pane.css";


export interface PaneProps extends BaseProps, ClickableProps{
    padding?: Size,
    margin?: Size,
    outline?: ColorType,
    fillDefault?: ColorType,
    fillReady?: ColorType,
    fillActive?: ColorType,
    groupPos?: GroupPosition,
}

export function Pane(props: React.PropsWithChildren<PaneProps>): ReactElement {
    return (
        <div className={getClassName()} style={props.style} onClick={props.onClick}>
            {props.children}
        </div>
    );

    function getClassName(): string {
        return concatClasses(
            "pane",
            map(props.outline, (outline) => 'pane-outline-' + outline),
            map(props.fillDefault, (fill) => 'pane-fill-default-' + fill),
            map(props.fillReady, (fill) => 'pane-fill-ready-' + fill),
            map(props.fillActive, (fill) => 'pane-fill-active-' + fill),
            map(props.padding, (padding) => 'padding-' + padding),
            map(props.margin, (margin) => 'margin-' + margin),
            map(props.groupPos, (groupPos) => "group-pos-" + groupPos),
            props.className
        );
    }

}

