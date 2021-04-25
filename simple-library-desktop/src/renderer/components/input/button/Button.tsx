import * as React from 'react';
import { ReactElement } from 'react';
import "./button.css";
import {
    BaseProps,
    ColorType,
    concatClasses,
    getIf,
    GroupPosition,
    orDefault,
    Type,
    Variant,
} from '../../common/common';
import { Pane } from '../../base/pane/Pane';
import { BUTTON_PANE_CONFIG } from './buttonConfig';
import { Label } from '../../base/label/Label';

export interface ButtonProps extends BaseProps {
    variant?: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    square?: boolean,
    error?: boolean,
    disabled?: boolean,
    onAction?: () => void,

    icon?: any, // todo deprecated -> remove
    iconRight?: any, // todo deprecated -> remove
}


export function Button(props: React.PropsWithChildren<ButtonProps>): ReactElement {

    const variant: Variant = orDefault(props.variant, Variant.OUTLINE);
    const type: Type = orDefault(props.type, Type.DEFAULT);

    return (
        <Pane outline={getOutline(variant, type)}
              fillDefault={getFillDefault(variant, type)}
              fillReady={getFillReady(variant, type)}
              fillActive={getFillActive(variant, type)}
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
            if (!type || type === Type.DEFAULT) {
                return ColorType.TEXT_0;
            } else {
                if (variant === Variant.SOLID) {
                    return ColorType.TEXT_ON_COLOR;
                } else {
                    return ColorType.TEXT_0;
                }
            }
        } else {
            if (!type || type === Type.DEFAULT) {
                return ColorType.TEXT_2;
            } else {
                if (variant === Variant.SOLID) {
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
            getIf(variant === Variant.LINK, "button-link"),
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
        if (props.error) {
            return BUTTON_PANE_CONFIG[Type.ERROR.toString()][variant.toString()].typeOutline;
        } else {
            return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeOutline;
        }
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
