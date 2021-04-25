import * as React from 'react';
import { ReactElement } from 'react';
import "./button.css";
import { BaseProps, ColorType, concatClasses, getIf, GroupPosition, orDefault, Type, Variant } from '../../common/common';
import { Pane } from '../../base/pane/Pane';
import { BUTTON_PANE_CONFIG } from './buttonConfig';
import { Label } from '../../base/label/Label';

export interface ButtonProps extends BaseProps {

    variant: Variant,
    type?: Type,

    icon?: any, // todo deprecated
    iconRight?: any, // todo deprecated

    groupPos?: GroupPosition,
    square?: boolean,

    disabled?: boolean,

    onAction?: () => void,
}


export function Button(props: React.PropsWithChildren<ButtonProps>): ReactElement {

    const type: Type = orDefault(props.type, Type.DEFAULT);

    return (
        <Pane outline={getOutline(props.variant, type)}
              fillDefault={getFillDefault(props.variant, type)}
              fillReady={getFillReady(props.variant, type)}
              fillActive={getFillActive(props.variant, type)}
              groupPos={props.groupPos}
              onClick={handleOnClick}
              className={getClassNames()}
        >
            <Label color={getContentColor()}
                   style={{ width: "100%", height: "100%" }}
                   className={"behaviour-no-select"}
            >
                {props.children}
            </Label>
        </Pane>
    );

    function getContentColor(): ColorType {
        if (props.disabled) {
            if (!props.type || props.type === Type.DEFAULT) {
                return ColorType.TEXT_0;
            } else {
                if (props.variant === Variant.SOLID) {
                    return ColorType.TEXT_ON_COLOR;
                } else {
                    return ColorType.TEXT_0;
                }
            }
        } else {
            if (!props.type || props.type === Type.DEFAULT) {
                return ColorType.TEXT_2;
            } else {
                if (props.variant === Variant.SOLID) {
                    return ColorType.TEXT_ON_COLOR;
                } else {
                    return ColorType.TEXT_2;
                }
            }
        }
    }

    function getClassNames(): string {
        return concatClasses(
            "button",
            getIf(props.disabled !== true, "behaviour-button"),
            getIf(props.variant === Variant.LINK, "button-link"),
            getIf(props.square, "button-square"),
            props.className,
        );
    }

    function handleOnClick(): void {
        if (!props.disabled && props.onAction) {
            props.onAction();
        }
    }

    function getOutline(variant: Variant, type: Type): ColorType {
        return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeOutline;
    }

    function getFillDefault(variant: Variant, type: Type): ColorType {
        return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeDefault;
    }

    function getFillReady(variant: Variant, type: Type): ColorType {
        if (props.disabled === true) {
            return undefined;
        } else {
            return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeReady;
        }
    }

    function getFillActive(variant: Variant, type: Type): ColorType {
        if (props.disabled === true) {
            return undefined;
        } else {
            return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeActive;
        }
    }

}
