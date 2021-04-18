import * as React from 'react';
import {ReactElement} from 'react';
import "./button.css";
import {
    AlignCross,
    AlignMain,
    ColorType,
    concatClasses,
    getIf,
    GroupPosition,
    map,
    orDefault,
    Size,
    Type,
    Variant
} from '../common';
import {Pane} from '../pane/Pane';
import {HBox} from '../layout/Box';
import {Icon, IconType} from "../icon/Icon";

export interface ButtonProps {

    variant: Variant,
    type?: Type,

    groupPos?: GroupPosition,

    icon?: IconType,
    iconRight?: IconType,
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
        <Pane outline={getOutline(props.variant, orDefault(props.type, Type.DEFAULT))}
              fillDefault={getFillDefault(props.variant, orDefault(props.type, Type.DEFAULT))}
              fillReady={getFillReady(props.variant, orDefault(props.type, Type.DEFAULT))}
              fillActive={getFillActive(props.variant, orDefault(props.type, Type.DEFAULT))}
              groupPos={props.groupPos}
              domProps={{
                  className: getClassNames(),
                  onClick: () => handleOnClick(props),
              }}
        >
            <HBox alignMain={AlignMain.CENTER}
                  alignCross={AlignCross.CENTER}
                  className={"button-content"}
                  spacing={Size.S_0_5}
                  style={{width: "100%", height: "100%"}}
            >
                {renderLeftIcon()}
                {renderCenterContent()}
                {renderRightIcon()}
            </HBox>
        </Pane>
    );

    function renderCenterContent(): ReactElement | null {
        return props.children && (
            <div className={"button-text " + map(getContentColor(), color => "text-color-" + color)}>{
                props.children}
            </div>
        )
    }

    function renderLeftIcon(): ReactElement | null {
        return props.icon
            ? (
                <Icon
                    type={props.icon}
                    color={getContentColor()}
                    size={Size.S_1}
                />
            )
            : null;
    }

    function renderRightIcon(): ReactElement | null {
        return props.iconRight
            ? (
                <Icon
                    type={props.iconRight}
                    color={getContentColor()}
                    size={Size.S_1}
                />
            )
            : null;
    }

    function getContentColor(): ColorType {
        if(props.disabled) {
            if(!props.type || props.type === Type.DEFAULT) {
                return ColorType.TEXT_0
            } else {
                if(props.variant === Variant.SOLID) {
                    return ColorType.TEXT_ON_COLOR
                } else {
                    return ColorType.TEXT_0
                }
            }
        } else {
            if(!props.type || props.type === Type.DEFAULT) {
                return ColorType.TEXT_2
            } else {
                if(props.variant === Variant.SOLID) {
                    return ColorType.TEXT_ON_COLOR
                } else {
                    return ColorType.TEXT_2
                }
            }
        }
    }

    function getClassNames(): string {
        return concatClasses(
            "button",
            "behaviour-button",
            getIf(props.variant === Variant.LINK, "button-link"),
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
