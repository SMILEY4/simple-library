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
import { Pane, PaneState } from '../../base/pane/Pane';
import {
    CLICKABLE_PANE_CONFIG,
    getFillActive,
    getFillDefault,
    getFillReady,
    getOutline,
} from '../../base/pane/paneConfig';
import { Label } from '../../base/label/Label';

export interface ButtonProps extends BaseProps {
    variant?: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    square?: boolean,
    error?: boolean,
    forcedPaneState?: PaneState,
    disabled?: boolean,
    onAction?: () => void,

    icon?: any, // todo deprecated -> remove
    iconRight?: any, // todo deprecated -> remove
}


export function Button(props: React.PropsWithChildren<ButtonProps>): ReactElement {

    const variant: Variant = orDefault(props.variant, Variant.OUTLINE);
    const type: Type = orDefault(props.type, Type.DEFAULT);

    return (
        <Pane outline={getOutline(CLICKABLE_PANE_CONFIG, variant, type, props.error)}
              fillDefault={getFillDefault(CLICKABLE_PANE_CONFIG, variant, type)}
              fillReady={getFillReady(CLICKABLE_PANE_CONFIG, variant, type, props.disabled)}
              fillActive={getFillActive(CLICKABLE_PANE_CONFIG, variant, type, props.disabled)}
              forcedState={props.forcedPaneState}
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

}
