import {BaseProps} from "../../common";
import React, {ReactElement} from "react";
import {Label} from "../../base/label/Label";
import {Icon, IconType} from "../../base/icon/Icon";
import "./treeLeaf.css"
import {concatClasses, getIf} from "../../../components/common/common";

export interface TreeLeafProps extends BaseProps {
    title: string,
    icon?: IconType,
    label?: string,
    selected?: boolean,
    __depth?: number,
    // todo: onSelect, onContextMenu, onDropOn, handle drag start -> bubble events with node-id up to root
}

export function TreeLeaf(props: React.PropsWithChildren<TreeLeafProps>): ReactElement {

    return (
        <div
            className={concatClasses(
                "tree-leaf",
                "tree-element",
                getIf(props.selected, "tree-leaf-selected")
            )}
            style={{
                paddingLeft: "calc(var(--s-1) * " + props.__depth + " + var(--s-0-5))"
            }}
        >
            <Label noSelect overflow="nowrap">
                {props.icon && <Icon type={props.icon}/>}
                {props.title}
            </Label>
            {props.label && (
                <Label type="caption" variant="secondary" noSelect>
                    {props.label}
                </Label>
            )}
        </div>
    );

}
