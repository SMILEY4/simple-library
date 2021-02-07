import * as React from 'react';
import { ReactElement } from 'react';
import "./button.css";
import { concatClasses, map } from '../common';

export enum ButtonVariant {
    SOLID = "solid",
    OUTLINE = "outline",
    GHOST = "ghost",
    LINK = "link"
}

export enum ButtonType {
    PRIMARY = "primary",
    SUCCESS = "success",
    ERROR = "error",
    WARN = "warn"
}

export enum GroupPosition {
    START = "start",
    MIDDLE = "middle",
    END = "end",
}

interface ButtonProps {
    variant: ButtonVariant,
    type?: ButtonType,
    groupPos?: GroupPosition,
    icon?: any,
    disabled?: boolean,
}

type ButtonReactProps = React.PropsWithChildren<ButtonProps>;


export function Button(props: ButtonReactProps): ReactElement {

    function getClassNames(props: ButtonReactProps) {
        return concatClasses(
            "button",
            map(props.variant, (variant) => 'button-variant-' + variant),
            map(props.type, (type) => 'button-type-' + type),
            map(props.groupPos, (groupPos) => 'button-group-pos-' + groupPos),
            (props.icon && props.children) ? "button-mixed" : null,
            props.disabled === true ? "button-disabled" : null,
        );
    }

    return (
        <div className={getClassNames(props)}>
            {props.icon ? props.icon : null}
            <div className={"button-text"}>
                {props.children}
            </div>
        </div>
    );
}