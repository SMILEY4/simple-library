import * as React from 'react';
import { CSSProperties, ReactElement } from 'react';
import './separator.css';
import { concatClasses, map, Size } from '../common';

export enum SeparatorDirection {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}


interface SeparatorProps {
    dir: SeparatorDirection,
    spacing: Size,
    noBorder?: boolean
    className?: string
}


export function Separator(props: React.PropsWithChildren<SeparatorProps>): ReactElement {

    function getClassNames(): string {
        return concatClasses(
            'separator',
            map(props.dir, (dir) => 'separator-dir-' + dir),
            (props.noBorder ? "separator-no-border" : ""),
            props.className,
        );
    }

    function getStyle(): CSSProperties {
        if (props.dir === SeparatorDirection.VERTICAL) {
            return {
                marginLeft: "var(--" + props.spacing + ")",
                marginRight: "var(--" + props.spacing + ")",
            };
        } else {
            return {
                marginTop: "var(--" + props.spacing + ")",
                marginBottom: "var(--" + props.spacing + ")",
            };
        }
    }

    return (
        <div className={getClassNames()} style={getStyle()} />
    );
}
