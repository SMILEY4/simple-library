import * as React from 'react';
import {CSSProperties, ReactElement} from 'react';
import './grid.css';
import {BaseProps, Size} from "../../common";
import {concatClasses} from "../../../components/common/common";


interface GridProps extends BaseProps {
    columns?: string[],
    rows?: string[],
    gap?: Size,
}

export function Grid(props: React.PropsWithChildren<GridProps>): ReactElement {

    return (
        <div
            className={getClassNames()}
            style={getStyle()}
            ref={props.forwardRef}
        >
            {props.children}
        </div>
    );

    function getClassNames(): string {
        return concatClasses(
            props.className,
            'grid',
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
