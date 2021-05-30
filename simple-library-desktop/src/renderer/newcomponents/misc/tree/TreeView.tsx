import {BaseProps} from "../../common";
import React, {ReactElement, useState} from "react";
import {IconType} from "../../base/icon/Icon";
import {TreeNode} from "./TreeNode";
import {orDefault} from "../../../components/common/common";
import {TreeLeaf} from "./TreeLeaf";
import "./treeView.css"

export interface TreeViewNode {
    id: string,
    value: string,
    icon?: IconType,
    label?: string,
    children?: TreeViewNode[],
    isLeaf?: boolean,
}

export interface TreeElementProps {

    value: string,
    icon?: IconType,

    selected?: boolean,
    depth: number,

    onSelect?: () => void,
    onDoubleClick?: () => void,
    onContextMenu?: () => void
}


export interface TreeViewProps extends BaseProps {
    rootNode: TreeViewNode,
    forceExpanded?: string[],
    onToggleExpand?: (nodeId: string, expanded: boolean) => void
}


export function TreeView(props: React.PropsWithChildren<TreeViewProps>): ReactElement {

    const [expanded, setExpanded] = useState<string[]>(props.forceExpanded ? props.forceExpanded : []);
    const [selected, setSelected] = useState<string[]>([]);

    return (
        <div className={"tree-view"}>
            {renderNode(props.rootNode, 0)}
        </div>
    );

    function renderNode(node: TreeViewNode, depth: number): ReactElement {
        return node.isLeaf
            ? renderLeaf(node, depth)
            : renderGroup(node, depth)
    }

    function renderGroup(node: TreeViewNode, depth: number): ReactElement {
        return (
            <TreeNode
                key={node.id}
                value={node.value}
                icon={node.icon}
                selected={isSelected(node.id)}
                depth={depth}
                expanded={isExpandable(node) && isExpanded(node.id)}
                expandable={isExpandable(node)}
                onToggle={() => isExpandable(node) && handleToggleExpand(node.id)}
                onSelect={() => handleSelect(node.id)}
                onDoubleClick={() => isExpandable(node) && handleToggleExpand(node.id)}
                onContextMenu={() => console.log("context-menu", node.id)}
            >
                {orDefault(node.children, []).map(child => renderNode(child, depth + 1))}
            </TreeNode>
        );
    }

    function renderLeaf(node: TreeViewNode, depth: number): ReactElement {
        return (
            <TreeLeaf
                key={node.id}
                value={node.value}
                icon={node.icon}
                label={node.label}
                selected={isSelected(node.id)}
                depth={depth}
                onSelect={() => handleSelect(node.id)}
                onDoubleClick={() => console.log("double-click", node.id)}
                onContextMenu={() => console.log("context-menu", node.id)}
            />
        );
    }

    function handleToggleExpand(nodeId: string) {
        if (props.forceExpanded) {
            props.onToggleExpand(nodeId, !isExpanded(nodeId))
        } else {
            if (isExpanded(nodeId)) {
                setExpanded(expanded.filter(expandedId => expandedId !== nodeId))
                props.onToggleExpand && props.onToggleExpand(nodeId, false)
            } else {
                setExpanded([...expanded, nodeId])
                props.onToggleExpand && props.onToggleExpand(nodeId, true)
            }
        }
    }

    function isExpandable(node: TreeViewNode): boolean {
        return !node.isLeaf && node.children && node.children.length > 0
    }

    function isExpanded(nodeId: string): boolean {
        return props.forceExpanded
            ? props.forceExpanded.indexOf(nodeId) !== -1
            : expanded.indexOf(nodeId) !== -1;
    }


    function handleSelect(nodeId: string) {
        setSelected([nodeId])
    }

    function isSelected(nodeId: string): boolean {
        return selected.indexOf(nodeId) !== -1;
    }

}
