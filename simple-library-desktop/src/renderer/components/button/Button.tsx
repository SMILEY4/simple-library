import * as React from 'react';
import { ReactElement } from 'react';
import "./button.css";
import { concatClasses, GroupPosition, map, Type, Variant } from '../common';

interface ButtonProps {
    variant: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    icon?: any,
    iconRight?: any
    disabled?: boolean,
    onAction?: () => void,
    renderAsActive?: boolean
}

type ButtonReactProps = React.PropsWithChildren<ButtonProps>;


export function Button(props: ButtonReactProps): ReactElement {

    function getClassNames(props: ButtonReactProps) {
        return concatClasses(
            "button",
            map(props.variant, (variant) => 'button-variant-' + variant),
            map(props.type, (type) => 'button-type-' + type),
            map(props.groupPos, (groupPos) => 'button-group-pos-' + groupPos),
            ((props.icon || props.iconRight) && props.children) ? "button-mixed" : null,
            props.disabled === true ? "button-disabled" : null,
            props.renderAsActive === true ? "button-render-as-active" : null,
        );
    }

    return (
        <div className={getClassNames(props)} onClick={props.onAction}>
            {props.icon ? props.icon : null}
            <div className={"button-text"}>
                {props.children}
            </div>
            {props.iconRight ? props.iconRight : null}
        </div>
    );
}