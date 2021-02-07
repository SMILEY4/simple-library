import * as React from 'react';
import { ReactElement } from 'react';
import "./labelBox.css";
import { concatClasses, GroupPosition, map, Type, Variant } from '../common';


interface LabelBoxProps {
    variant: Variant,
    type?: Type,
    groupPos?: GroupPosition,
    icon?: any,
    iconRight?: any
}

type LabelBoxReactProps = React.PropsWithChildren<LabelBoxProps>;


export function LabelBox(props: LabelBoxReactProps): ReactElement {

    function getClassNames(props: LabelBoxReactProps) {
        return concatClasses(
            "labelbox",
            map(props.variant, (variant) => 'labelbox-variant-' + variant),
            map(props.type, (type) => 'labelbox-type-' + type),
            map(props.groupPos, (groupPos) => 'labelbox-group-pos-' + groupPos),
            ((props.icon || props.iconRight) && props.children) ? "labelbox-mixed" : null,
        );
    }

    return (
        <div className={getClassNames(props)}>
            {props.icon ? props.icon : null}
            <div className={"labelbox-text"}>
                {props.children}
            </div>
            {props.iconRight ? props.iconRight : null}
        </div>
    );
}