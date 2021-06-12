import {BaseProps} from "../../utils/common";
import React, {ReactElement, useState} from "react";
import {IconType} from "../../base/icon/Icon";
import {orDefault} from "../../utils/common";
import "./treeView.css"
import {ContextMenuBase} from "../../menu/contextmenu/ContextMenuBase";
import {useContextMenu} from "../../menu/contextmenu/contextMenuHook";
import {getChildOfDynamicSlot} from "../../base/slot/DynamicSlot";
import {TreeElementLeaf} from "./TreeElementLeaf";
import {TreeElementNode} from "./TreeElementNode";
import {useClickOutside} from "../../utils/commonHooks";

export interface TreeViewNode {
	id: string,
	children?: TreeViewNode[],
	isLeaf?: boolean,

	value: string,
	icon?: IconType,
	label?: string,

	draggable?: boolean,
	droppable?: boolean
}


export interface TreeElementProps extends BaseProps {

	value: string,
	icon?: IconType,

	selected?: boolean,
	active?: boolean,
	depth: number,

	onSelect?: () => void,
	onDoubleClick?: () => void,
	onContextMenu?: (pageX: number, pageY: number) => void,

	draggable?: boolean,
	onDrag?: (event: React.DragEvent) => void,

	dropTarget?: boolean,
	onDragOver?: (event: React.DragEvent) => void,
	onDrop?: (event: React.DragEvent) => void,
}

export interface TreeViewProps extends BaseProps {
	modalRootId: string,
	rootNode: TreeViewNode,

	forceExpanded?: string[],
	onToggleExpand?: (nodeId: string, expanded: boolean) => void,

	activeNodeId?: string,

	onDoubleClick?: (nodeId: string) => void,
	onDragStart?: (nodeId: string, event: React.DragEvent) => void,
	onDragOver?: (nodeId: string, event: React.DragEvent) => void,
	onDrop?: (nodeId: string, event: React.DragEvent) => void,
}


export function TreeView(props: React.PropsWithChildren<TreeViewProps>): ReactElement {

	const [expanded, setExpanded] = useState<string[]>(props.forceExpanded ? props.forceExpanded : []);
	const [selected, setSelected] = useState<string[]>([]);

	const {
		showContextMenu,
		contextMenuX,
		contextMenuY,
		contextMenuRef,
		openContextMenu,
		closeContextMenu
	} = useContextMenu();

	const clickOutsideRef = useClickOutside(handleClickOutside)

	return (
		<div className={"tree-view"} ref={clickOutsideRef}>
			{renderNode(props.rootNode, 0)}

			<ContextMenuBase
				modalRootId={props.modalRootId}
				show={showContextMenu}
				pageX={contextMenuX}
				pageY={contextMenuY}
				menuRef={contextMenuRef}
				onAction={() => closeContextMenu()}
			>
				{selected.length === 1 && getChildOfDynamicSlot(props.children, "context-menu", selected[0])}
			</ContextMenuBase>

		</div>
	);

	function renderNode(node: TreeViewNode, depth: number): ReactElement {
		return node.isLeaf
			? renderLeaf(node, depth)
			: renderGroup(node, depth)
	}

	function renderGroup(node: TreeViewNode, depth: number): ReactElement {
		return (
			<TreeElementNode
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
				onContextMenu={(pageX: number, pageY: number) => handleContextMenu(node.id, pageX, pageY)}
				draggable={node.draggable}
				dropTarget={node.droppable}
				onDrag={(e: React.DragEvent) => props.onDragStart && props.onDragStart(node.id, e)}
				onDragOver={(e: React.DragEvent) => props.onDragOver && props.onDragOver(node.id, e)}
				onDrop={(e: React.DragEvent) => props.onDrop && props.onDrop(node.id, e)}
			>
				{orDefault(node.children, []).map(child => renderNode(child, depth + 1))}
			</TreeElementNode>
		);
	}

	function renderLeaf(node: TreeViewNode, depth: number): ReactElement {
		return (
			<TreeElementLeaf
				key={node.id}
				value={node.value}
				icon={node.icon}
				label={node.label}
				selected={isSelected(node.id)}
				active={isActive(node.id)}
				depth={depth}
				onSelect={() => handleSelect(node.id)}
				onDoubleClick={() => handleDoubleClick(node.id)}
				onContextMenu={(pageX: number, pageY: number) => handleContextMenu(node.id, pageX, pageY)}
				draggable={node.draggable}
				dropTarget={node.droppable}
				onDrag={(e: React.DragEvent) => props.onDragStart && props.onDragStart(node.id, e)}
				onDragOver={(e: React.DragEvent) => props.onDragOver && props.onDragOver(node.id, e)}
				onDrop={(e: React.DragEvent) => props.onDrop && props.onDrop(node.id, e)}
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

	function handleClickOutside() {
		setSelected([])
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

	function isActive(nodeId: string): boolean {
		return props.activeNodeId && props.activeNodeId === nodeId;
	}

	function handleDoubleClick(nodeId: string) {
		props.onDoubleClick && props.onDoubleClick(nodeId);
		handleSelect(nodeId);
	}

	function handleContextMenu(nodeId: string, pageX: number, pageY: number) {
		handleSelect(nodeId);
		openContextMenu(pageX, pageY)
	}

}
