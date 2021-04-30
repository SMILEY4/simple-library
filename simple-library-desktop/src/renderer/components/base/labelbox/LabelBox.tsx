import * as React from 'react';
import { ReactElement } from 'react';
import { BaseProps, ColorType, GroupPosition, orDefault, Type, Variant } from '../../common/common';
import { Pane } from '../pane/Pane';
import {
    getFillActive,
    getFillDefault,
    getFillReady,
    getOutline,
    STATIC_PANE_CONFIG,
} from '../pane/paneConfig';
import "./labelbox.css"
import { Label } from '../label/Label';

export interface LabelBoxProps extends BaseProps {
    variant?: Variant,
    type?: Type,
    error?: boolean,
    groupPos?: GroupPosition,
    disabled?: boolean,
}


export function LabelBox(props: React.PropsWithChildren<LabelBoxProps>): ReactElement {

    const variant: Variant = orDefault(props.variant, Variant.OUTLINE);
    const type: Type = orDefault(props.type, Type.DEFAULT);

    return (
        <Pane outline={getOutline(STATIC_PANE_CONFIG, variant, type, props.error)}
              fillDefault={getFillDefault(STATIC_PANE_CONFIG, variant, type)}
              fillReady={getFillReady(STATIC_PANE_CONFIG, variant, type, props.disabled)}
              fillActive={getFillActive(STATIC_PANE_CONFIG, variant, type, props.disabled)}
              groupPos={props.groupPos}
              className={"label-box"}
        >
            <Label color={getContentColor()} style={{ width: "100%", height: "100%" }}>
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

}
