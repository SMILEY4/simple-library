import * as React from 'react';
import { ReactElement } from 'react';
import "./button.css";
import { AlignCross, AlignMain, ColorType, concatClasses, getIf, GroupPosition, Size, Type, Variant } from '../common';
import { Pane } from '../pane/Pane';
import { HBox } from '../layout/Box';

export interface ButtonProps {

    variant: Variant,
    type: Type,

    groupPos?: GroupPosition,

    icon?: any,
    iconRight?: any,
    square?: boolean,

    disabled?: boolean,
    onAction?: () => void,
    renderAsActive?: boolean,
    className?: string
}


const BUTTON_PANE_CONFIG: any = {
    default: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
        ghost: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: ColorType.BASE_0,
            typeActive: ColorType.BASE_1,
        },
        outline: {
            typeOutline: ColorType.BASE_4,
            typeDefault: undefined,
            typeReady: ColorType.BASE_0,
            typeActive: ColorType.BASE_1,
        },
        solid: {
            typeOutline: ColorType.BASE_4,
            typeDefault: ColorType.BASE_1,
            typeReady: ColorType.BASE_2,
            typeActive: ColorType.BASE_3,
        },
    },
    primary: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
        ghost: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: ColorType.PRIMARY_0,
            typeActive: ColorType.PRIMARY_1,
        },
        outline: {
            typeOutline: ColorType.PRIMARY_4,
            typeDefault: undefined,
            typeReady: ColorType.PRIMARY_0,
            typeActive: ColorType.PRIMARY_1,
        },
        solid: {
            typeOutline: ColorType.PRIMARY_2,
            typeDefault: ColorType.PRIMARY_2,
            typeReady: ColorType.PRIMARY_3,
            typeActive: ColorType.PRIMARY_4,
        },
    },
    success: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
        ghost: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: ColorType.SUCCESS_0,
            typeActive: ColorType.SUCCESS_1,
        },
        outline: {
            typeOutline: ColorType.SUCCESS_4,
            typeDefault: undefined,
            typeReady: ColorType.SUCCESS_0,
            typeActive: ColorType.SUCCESS_1,
        },
        solid: {
            typeOutline: ColorType.SUCCESS_2,
            typeDefault: ColorType.SUCCESS_2,
            typeReady: ColorType.SUCCESS_3,
            typeActive: ColorType.SUCCESS_4,
        },
    },
    error: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
        ghost: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: ColorType.ERROR_0,
            typeActive: ColorType.ERROR_1,
        },
        outline: {
            typeOutline: ColorType.ERROR_4,
            typeDefault: undefined,
            typeReady: ColorType.ERROR_0,
            typeActive: ColorType.ERROR_1,
        },
        solid: {
            typeOutline: ColorType.ERROR_2,
            typeDefault: ColorType.ERROR_2,
            typeReady: ColorType.ERROR_3,
            typeActive: ColorType.ERROR_4,
        },
    },
    warn: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
        ghost: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: ColorType.WARN_0,
            typeActive: ColorType.WARN_1,
        },
        outline: {
            typeOutline: ColorType.WARN_4,
            typeDefault: undefined,
            typeReady: ColorType.WARN_0,
            typeActive: ColorType.WARN_1,
        },
        solid: {
            typeOutline: ColorType.WARN_2,
            typeDefault: ColorType.WARN_2,
            typeReady: ColorType.WARN_3,
            typeActive: ColorType.WARN_4,
        },
    },
};


export function Button(props: React.PropsWithChildren<ButtonProps>): ReactElement {

    return (
        <Pane outline={getOutline(props.variant, props.type)}
              fillDefault={getFillDefault(props.variant, props.type)}
              fillReady={getFillReady(props.variant, props.type)}
              fillActive={getFillActive(props.variant, props.type)}
              groupPos={props.groupPos}
              domProps={{
                  className: getClassNames(),
                  onClick: () => handleOnClick(props),
              }}
        >
            <HBox alignMain={AlignMain.CENTER}
                  alignCross={AlignCross.CENTER}
                  className={"button-content"}
                  spacing={ (props.icon || props.iconRight) && !props.children ? Size.S_0_5 : Size.S_0}
                  style={{
                      width: "100%",
                      height: "100%"
                  }}
            >
                {props.icon ? props.icon : null}
                <div className={"button-text"}>
                    {props.children}
                </div>
                {props.iconRight ? props.iconRight : null}
            </HBox>
        </Pane>
    );

    function getClassNames(): string {
        return concatClasses(
            "button",
            "behaviour-button",
            getIf(props.square, "button-square"),
            props.className,
        );
    }

    function handleOnClick(props: ButtonProps): void {
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
        return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeReady;
    }

    function getFillActive(variant: Variant, type: Type): ColorType {
        return BUTTON_PANE_CONFIG[type.toString()][variant.toString()].typeActive;
    }

}
