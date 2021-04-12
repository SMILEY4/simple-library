import * as React from 'react';
import { ReactElement } from 'react';
import { concatClasses, getIf, GroupPosition, map, Size, Type } from '../common';
import "./pane.css";

export interface PaneProps extends React.HTMLAttributes<HTMLDivElement> {

    spacing?: Size,
    padding?: Size,
    margin?: Size,

    outline?: Type,
    fill?: Type,
    disabled?: boolean,

    groupPos?: GroupPosition,
}

export function Pane(props: React.PropsWithChildren<PaneProps>): ReactElement {
    return (
        <div {...props} className={getClassName()}>
            {props.children}
        </div>
    );

    function getClassName(): string {
        return concatClasses(
            "pane",
            getIf(props.disabled, "pane-disabled"),
            map(props.outline, (outline) => 'pane-outline-' + outline),
            map(props.fill, (fill) => 'pane-fill-' + fill),
            map(props.spacing, (spacing) => 'gap-' + spacing),
            map(props.padding, (padding) => 'padding-' + padding),
            map(props.margin, (margin) => 'margin-' + margin),
            map(props.groupPos, (groupPos) => "group-pos-" + groupPos),
            props.className
        );
    }

}

