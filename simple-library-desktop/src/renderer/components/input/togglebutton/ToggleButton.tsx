import * as React from 'react';
import { ReactElement, useState } from 'react';
import { concatClasses, getIf } from '../../common/common';
import { Button, ButtonProps } from '../button/Button';
import { PaneState } from '../../base/pane/Pane';
import "./togglebutton.css"

export interface ToggleButtonProps extends Omit<ButtonProps, 'onAction'> {
    selected?: boolean,
    forceState?: boolean
    switchContent?: boolean,
    keepSize?: boolean,
    onToggle?: (selected: boolean) => void,
}


export function ToggleButton(props: React.PropsWithChildren<ToggleButtonProps>): ReactElement {

    const [isSelected, setSelected] = useState(props.selected === true);

    return (
        <Button
            {...props}
            forwardRef={props.forwardRef}
            className={concatClasses("toggle-button", getIf(props.keepSize, "toggle-button-keep-size"), props.className)}
            forcedPaneState={shouldForceActiveState() ? PaneState.ACTIVE : undefined}
            onAction={handleToggle}
        >
            {getChildren()}
        </Button>
    );

    function getChildren() {
        if (props.switchContent === true) {
            const arrChildren = React.Children.toArray(props.children);
            if (arrChildren.length !== 2) {
                throw "ToggleButton must have exactly two elements to switch between.";
            } else {
                const childIndex = props.forceState === true
                    ? (props.selected ? 1 : 0)
                    : (isSelected ? 1 : 0);
                if (props.keepSize === true) {
                    return (
                        <>
                            {arrChildren[childIndex]}
                            <div className={"toggle-btn-hidden-child"}>
                                {childIndex === 0
                                    ? arrChildren[1]
                                    : arrChildren[0]}
                            </div>
                        </>
                    );
                } else {
                    return arrChildren[childIndex];
                }
            }
        } else {
            return props.children;
        }
    }

    function shouldForceActiveState() {
        if (props.forceState) {
            return props.selected;
        } else {
            return isSelected === true;
        }
    }

    function handleToggle(): void {
        if (props.forceState === true) {
            props.onToggle && props.onToggle(!props.selected);
        } else {
            const nextSelected: boolean = !isSelected;
            setSelected(nextSelected);
            props.onToggle && props.onToggle(nextSelected);
        }
    }

}
