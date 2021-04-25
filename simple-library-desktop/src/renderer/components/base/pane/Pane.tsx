import * as React from 'react';
import { ReactElement } from 'react';
import { BaseProps, ClickableProps, ColorType, concatClasses, GroupPosition, map, Size } from '../../common/common';
import "./pane.css";

export enum PaneState {
    DEFAULT = "default",
    READY = "ready",
    ACTIVE = "active",
}

export interface PaneProps extends BaseProps, ClickableProps {
    padding?: Size,
    margin?: Size,
    groupPos?: GroupPosition,
    outline?: ColorType,
    fillDefault?: ColorType,
    fillReady?: ColorType,
    fillActive?: ColorType,
    forcedState?: PaneState,
}

/**
 * A simple box that does not affect its content. Background, border, etc can be styled.
 */
export function Pane(props: React.PropsWithChildren<PaneProps>): ReactElement {
    return (
        <div className={getClassName()} style={props.style} onClick={props.onClick}>
            {props.children}
        </div>
    );

    function getClassName(): string {
        return concatClasses(
            "pane",
            map(props.padding, (padding) => 'padding-' + padding),
            map(props.margin, (margin) => 'margin-' + margin),
            map(props.groupPos, (groupPos) => "group-pos-" + groupPos),
            getClassNameOutline(),
            getClassNameFillDefault(),
            getClassNameFillReady(),
            getClassNameFillActive(),
            props.className,
        );
    }

    function getClassNameOutline() {
        return map(props.outline, (outline) => 'pane-outline-' + outline);
    }

    function getClassNameFillDefault() {
        return props.forcedState
            ? getClassNameFill(PaneState.DEFAULT, props.forcedState)
            : getClassNameFill(PaneState.DEFAULT, PaneState.DEFAULT);
    }

    function getClassNameFillReady() {
        return props.forcedState
            ? null
            : getClassNameFill(PaneState.READY, PaneState.READY);
    }

    function getClassNameFillActive() {
        return props.forcedState
            ? null
            : getClassNameFill(PaneState.ACTIVE, PaneState.ACTIVE);
    }

    function getClassNameFill(interactionState: PaneState, fillState: PaneState) {
        switch (fillState) {
            case PaneState.DEFAULT:
                return map(props.fillDefault, (fill) => "pane-fill-" + interactionState + "-" + fill);
            case PaneState.READY:
                return map(props.fillReady, (fill) => "pane-fill-" + interactionState + "-" + fill);
            case PaneState.ACTIVE:
                return map(props.fillActive, (fill) => "pane-fill-" + interactionState + "-" + fill);
        }
    }

}

