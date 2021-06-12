import * as React from 'react';
import { ReactElement } from 'react';
import "./titlemenuitem.css";
import {BaseProps} from "../../utils/common";
import {Label} from "../../base/label/Label";
import {concatClasses} from "../../utils/common";

export interface TitleMenuItemProps extends BaseProps {
    title: string
}

export function TitleMenuItem(props: React.PropsWithChildren<TitleMenuItemProps>): ReactElement {
    return (
        <Label
            variant="secondary"
            type="caption"
            bold
            noSelect
            className={concatClasses(props.className, "title-menu-item")}
            forwardRef={props.forwardRef}
            style={props.style}
        >
            {props.title}
        </Label>
    );
}
