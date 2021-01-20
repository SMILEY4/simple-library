import * as React from 'react';
import { ReactElement } from 'react';
import './grid.css';
import "./layout.css"
import { concatClasses, Fill, map } from '../common';


interface GridProps {
    columns?: string[],
    rows?: string[],
    fill?: Fill,
    className?: string,
}


export function Grid(props: React.PropsWithChildren<GridProps>): ReactElement {

    function getClassNames(): string {
        return concatClasses(
            'grid',
            map(props.fill, (fill) => 'fill-' + fill),
            props.className,
        );
    }

    function getStyle(): any {
        return {
            gridTemplateColumns: props.columns ? props.columns.join(' ') : undefined,
            gridTemplateRows: props.rows ? props.rows.join(' ') : undefined,
        };
    }

    return (
        <div className={getClassNames()} style={getStyle()}>
            {props.children}
        </div>
    );
}