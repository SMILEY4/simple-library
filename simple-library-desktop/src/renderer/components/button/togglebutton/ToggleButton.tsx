import * as React from 'react';
import { ReactElement } from 'react';
import { Button, ButtonProps } from '../Button';


export interface ToggleButtonProps extends Omit<ButtonProps, 'renderAsActive'> {
    onToggle?: (active: boolean) => void
    active?: boolean,
}

export function ToggleButton(props: React.PropsWithChildren<ToggleButtonProps>): ReactElement {

    function handleClick() {
        if (props.onToggle && !props.disabled) {
            props.onToggle(!props.active);
        }
    }

    function getButtonProps(): ButtonProps {
        return {
            renderAsActive: props.active,
            onAction: handleClick,
            ...props,
        };
    }

    return (
        <Button {...getButtonProps()}>
            {props.children}
        </Button>
    );
}
