import {BaseProps} from "../../common";
import React, {ReactElement} from "react";
import {Label} from "../../base/label/Label";
import {Icon, IconType} from "../../base/icon/Icon";
import "./treeLeaf.css"
import {concatClasses, getIf} from "../../../components/common/common";

export interface TreeLeafProps extends BaseProps {
    title: string,
    icon?: IconType,
    selected?: boolean,
    __depth?: number,
}

export function TreeLeaf(props: React.PropsWithChildren<TreeLeafProps>): ReactElement {

    return (
        <div
            className={concatClasses("tree-leaf", getIf(props.selected, "tree-leaf-selected"))}
            style={{
                paddingLeft: "calc(var(--s-1) * " + props.__depth + " + var(--s-0-5))"
            }}
        >
            <Label noSelect overflow="nowrap-hidden">
                {props.icon && <Icon type={props.icon}/>}
                {props.title}
            </Label>
        </div>
    );

}
