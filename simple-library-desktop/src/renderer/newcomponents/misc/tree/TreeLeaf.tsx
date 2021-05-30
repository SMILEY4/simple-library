import {BaseProps} from "../../common";
import React, {ReactElement} from "react";
import {Label} from "../../base/label/Label";
import {Icon, IconType} from "../../base/icon/Icon";
import "./treeLeaf.css"
import {concatClasses, getIf} from "../../../components/common/common";
import {TreeElementProps} from "./TreeView";

export interface TreeLeafProps extends TreeElementProps, BaseProps {
    label?: string,
}

export function TreeLeaf(props: React.PropsWithChildren<TreeLeafProps>): ReactElement {

    return (
        <div
            className={concatClasses("tree-leaf", getIf(props.selected, "tree-leaf-selected"))}
            style={{paddingLeft: calculateInset()}}
            onClick={props.onSelect}
            onDoubleClick={props.onDoubleClick}
            onContextMenu={props.onContextMenu}
        >
            <Label noSelect overflow="nowrap">
                {props.icon && <Icon type={props.icon}/>}
                {props.value}
            </Label>
            {props.label && (
                <Label type="caption" variant="secondary" noSelect className={"tree-label"}>
                    {props.label}
                </Label>
            )}
        </div>
    );

    function calculateInset(): string {
        return "calc(var(--s-1) * " + props.depth + " + var(--s-0-5) + var(--s-0-25))";
    }

}
