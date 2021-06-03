import * as React from 'react';
import {ReactElement} from 'react';
import "./separatormenuitem.css";
import {BaseProps} from "../../utils/common";
import {concatClasses} from "../../../components/common/common";


export function SeparatorMenuItem(props: React.PropsWithChildren<BaseProps>): ReactElement {
    return (
        <div
            className={concatClasses(props.className, "separator-menu-item")}
            style={props.style}
            ref={props.forwardRef}
        />
    );
}
