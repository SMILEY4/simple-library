import {BaseProps} from "../../utils/common";
import React, {ReactElement, useState} from "react";
import {IconType} from "../../base/icon/Icon";
import {TreeNode} from "./TreeNode";
import {orDefault} from "../../../components/common/common";
import {TreeLeaf} from "./TreeLeaf";
import "./treeView.css"
import {ContextMenuBase} from "../../menu/contextmenu/ContextMenuBase";
import {useContextMenu} from "../../menu/contextmenu/contextMenuHook";
import {getChildOfDynamicSlot} from "../../base/slot/DynamicSlot";
import {
	DragDataContainer,
	DragOpType,
	extractMimeTypeProvidedMetadata,
	getMetadataMimeType,
	setDragData
} from "../../utils/dragAndDropUtils";

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


export interface TreeViewProps extends BaseProps {
	modalRootId: string,
	rootNode: TreeViewNode,

	forceExpanded?: string[],
	onToggleExpand?: (nodeId: string, expanded: boolean) => void

	onDragStart?: (nodeId: string) => DragDataContainer;
	onDragOver?: (nodeId: string, metaId: string | null, metadata: any | null) => DragOpType;
	onDrop?: (nodeId: string, metaId: string | null, metadata: any | null, data: any) => void;
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

	return (
		<div className={"tree-view"}>
			{renderNode(props.rootNode, 0)}

			<ContextMenuBase
				modalRootId={"showcase-root"}
				show={showContextMenu}
				pageX={contextMenuX}
				pageY={contextMenuY}
				menuRef={contextMenuRef}
				onAction={(itemId: string) => closeContextMenu()}
			>
				{getChildOfDynamicSlot(props.children, "context-menu", selected)}
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
			<TreeNode
				key={node.id}
				value={node.value}
				icon={node.icon}
				selected={isSelected(node.id)}
				depth={depth}
				modalRootId={props.modalRootId}
				expanded={isExpandable(node) && isExpanded(node.id)}
				expandable={isExpandable(node)}
				onToggle={() => isExpandable(node) && handleToggleExpand(node.id)}
				onSelect={() => handleSelect(node.id)}
				onDoubleClick={() => isExpandable(node) && handleToggleExpand(node.id)}
				onContextMenu={(pageX: number, pageY: number) => handleContextMenu(node.id, pageX, pageY)}
				draggable={node.draggable}
				onDrag={(e: React.DragEvent) => handleDrag(node.id, e)}
				dropTarget={node.droppable}
				onDragOver={(e: React.DragEvent) => handleDragOver(node.id, e)}
				onDrop={(e: React.DragEvent) => handleDrop(node.id, e)}
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
				modalRootId={props.modalRootId}
				onSelect={() => handleSelect(node.id)}
				onDoubleClick={() => handleDoubleClick(node.id)}
				onContextMenu={(pageX: number, pageY: number) => handleContextMenu(node.id, pageX, pageY)}
				draggable={node.draggable}
				onDrag={(e: React.DragEvent) => handleDrag(node.id, e)}
				dropTarget={node.droppable}
				onDragOver={(e: React.DragEvent) => handleDragOver(node.id, e)}
				onDrop={(e: React.DragEvent) => handleDrop(node.id, e)}
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

	function handleDoubleClick(nodeId: string) {
		handleSelect(nodeId);
		console.log("double-click", nodeId) // todo
	}

	function handleContextMenu(nodeId: string, pageX: number, pageY: number) {
		handleSelect(nodeId);
		openContextMenu(pageX, pageY)
	}

	function handleDrag(nodeId: string, event: React.DragEvent) {
		handleSelect(nodeId);
		if (props.onDragStart) {
			const dragDataContainer: DragDataContainer = props.onDragStart(nodeId)
			setDragData(dragDataContainer.metaId, dragDataContainer.metaData, dragDataContainer.data, event.dataTransfer)
			event.dataTransfer.effectAllowed = dragDataContainer.allowedOps
		}
	}

	function handleDragOver(nodeId: string, event: React.DragEvent) {
		if (props.onDragOver) {
			const metaId: string | null = getMetadataMimeType(event.dataTransfer);
			const metadata: any | null = metaId ? extractMimeTypeProvidedMetadata(event.dataTransfer, metaId) : null;
			event.dataTransfer.dropEffect = props.onDragOver(nodeId, metaId.replace("custom/", ""), metadata);
		}
	}

	function handleDrop(nodeId: string, event: React.DragEvent) {
		if(props.onDrop) {
			const metaId: string | null = getMetadataMimeType(event.dataTransfer);
			const metadata: any | null = metaId ? extractMimeTypeProvidedMetadata(event.dataTransfer, metaId) : null;
			props.onDrop(nodeId, metaId.replace("custom/", ""), metadata, event.dataTransfer.getData("application/json"))
		}
	}

}
