import * as React from "react";
import {ReactElement} from "react";
import "./grid.css"
import { classNameOrEmpty } from '../common';


interface GridProps {
    columns?: string[],
    rows?: string[]
    className?: string,
}


export function Grid(props: React.PropsWithChildren<GridProps>): ReactElement {

    function getClassNames(): string {
        return "grid"
            + classNameOrEmpty(props.className)
    }

    function getStyle(): any {
        return {
            gridTemplateColumns: props.columns ? props.columns.join(' ') : undefined,
            gridTemplateRows: props.rows ? props.rows.join(' ') : undefined,
        }
    }

    return (
        <div className={getClassNames()} style={getStyle()}>
            {props.children}
        </div>
    )
}
