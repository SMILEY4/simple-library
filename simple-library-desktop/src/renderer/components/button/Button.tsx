import * as React from 'react';
import { ReactElement } from 'react';
import "./button.css";
import { concatClasses, GroupPosition, map, Type, Variant } from '../common';
import { HBox } from '../layout/Box';

export interface ButtonProps {
    variant: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    icon?: any,
    iconRight?: any,
    square?: boolean,
    disabled?: boolean,
    onAction?: () => void,
    renderAsActive?: boolean,
    className?: string
}

type ButtonReactProps = React.PropsWithChildren<ButtonProps>;


export function Button(props: ButtonReactProps): ReactElement {

    function getClassNames() {
        return concatClasses(
            "button",
            "behaviour-button",
            // map(props.variant, (variant) => 'button-variant-' + variant),
            // map(props.type, (type) => 'button-type-' + type),
            // map(props.groupPos, (groupPos) => 'button-group-pos-' + groupPos),
            map(props.square, (square) => 'button-square'),
            // ((props.icon || props.iconRight) && props.children) ? "button-mixed" : null,
            // props.disabled === true ? "button-disabled" : null,
            props.renderAsActive === true ? "button-render-as-active" : null, // TODO in box
            props.className,
        );
    }

    function handleOnClick(props: ButtonReactProps): void {
        if (!props.disabled && props.onAction) {
            props.onAction();
        }
    }

    return (
        <HBox
            interactive
            outlined={props.variant === Variant.SOLID || props.variant === Variant.OUTLINE}
            filled={props.variant === Variant.SOLID || props.variant === Variant.GHOST}
            type={props.type}
            disabled={props.disabled}
            groupPos={props.groupPos}
            onClick={() => handleOnClick(props)}
            className={getClassNames()}
        >
            {props.icon ? props.icon : null}
            <div className={"button-text"}>{props.children}</div>
            {props.iconRight ? props.iconRight : null}
        </HBox>
    );
}
