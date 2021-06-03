import * as React from 'react';
import {CSSProperties, ReactElement} from 'react';
import './grid.css';
import {BaseProps, concatClasses, Fill, map, Size} from '../../common/common';


interface GridProps extends BaseProps {
    columns?: string[],
    rows?: string[],
    gap?: Size,
    fill?: Fill,
}

export function Grid(props: React.PropsWithChildren<GridProps>): ReactElement {

    return (
        <div className={getClassNames()} style={getStyle()}>
            {props.children}
        </div>
    );

    function getClassNames(): string {
        return concatClasses(
            'grid',
            map(props.fill, (fill) => 'fill-' + fill),
            props.className,
        );
    }

    function getStyle(): CSSProperties {
        return {
            gridTemplateColumns: props.columns ? props.columns.join(' ') : undefined,
            gridTemplateRows: props.rows ? props.rows.join(' ') : undefined,
            gridGap: props.gap ? "var(--" + props.gap + ")" : undefined,
            ...props.style
        };
    }

}
