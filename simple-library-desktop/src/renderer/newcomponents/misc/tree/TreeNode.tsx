import {BaseProps} from "../../utils/common";
import React, {ReactElement} from "react";
import {Icon, IconType} from "../../base/icon/Icon";
import {Label} from "../../base/label/Label";
import "./treeNode.css"
import {TreeElementProps} from "./TreeView";
import {concatClasses, getIf} from "../../../components/common/common";

export interface TreeNodeProps extends TreeElementProps, BaseProps {
    expandable?: boolean,
    expanded: boolean,
    onToggle: () => void
}

export function TreeNode(props: React.PropsWithChildren<TreeNodeProps>): ReactElement {

    return (
        <>
            <div
                className={concatClasses("tree-node", getIf(props.selected, "tree-node-selected"))}
                style={{paddingLeft: calculateInset()}}
                draggable={props.draggable}
                onDragStart={props.draggable && props.onDrag}
                onDragOver={props.dropTarget && props.onDragOver}
                onDrop={props.dropTarget && props.onDrop}
            >
                <div
                    className={"tree-node-icon-wrapper"}
                    onClick={props.onToggle}
                >
                    {props.expandable && (
                        <Icon type={props.expanded ? IconType.CHEVRON_DOWN : IconType.CHEVRON_RIGHT} size="0-75"/>
                    )}
                </div>
                <div
                    className={"tree-node-label-wrapper"}
                    onClick={props.onSelect}
                    onDoubleClick={props.onDoubleClick}
                    onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e.pageX, e.pageY)}
                >
                    <Label noSelect overflow="nowrap">
                        {props.icon && <Icon type={props.icon}/>}
                        {props.value}
                    </Label>
                </div>
            </div>
            {props.expanded && props.expandable && props.children}
        </>
    )

    function calculateInset(): string {
        return "calc(var(--s-1) * " + props.depth + " + var(--s-0-25))";
    }

}
