import React, {MutableRefObject, ReactElement, useRef} from "react";
import {Icon, IconType} from "../../base/icon/Icon";
import {concatClasses, getIf} from "../../../components/common/common";
import {calculateInset} from "./treeElementUtils";
import {Label} from "../../base/label/Label";
import "./treeElement.css"
import "./treeNode.css"
import {TreeElementProps} from "./TreeView";

export interface TreeElementNodeProps extends TreeElementProps {
	expandable?: boolean,
	expanded: boolean,
	onToggle: () => void
}

export function TreeElementNode(props: React.PropsWithChildren<TreeElementNodeProps>): ReactElement {

	const refDropTarget: MutableRefObject<any> = useRef(null);

	return (
		<>
			<div
				className={concatClasses(props.className, "tree-node", "tree-element", getIf(props.selected, "tree-element-selected"))}
				style={{...props.style, paddingLeft: calculateInset(props.depth, null)}}
				draggable={props.draggable}
				onDragStart={props.draggable && handleDragStart}
				onDragEnter={props.dropTarget && handleDragEnter}
				onDragLeave={props.dropTarget && handleDragLeave}
				onDragOver={props.dropTarget && handleDragOver}
				onDrop={props.dropTarget && handleDrop}
				onClick={props.onSelect}
				onContextMenu={handleContextMenu}
				ref={refDropTarget}
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

	function handleDragStart(event: React.DragEvent): void {
		props.onDrag && props.onDrag(event)
	}

	function handleDragEnter(event: React.DragEvent): void {
		event.preventDefault();
		refDropTarget.current.className += " tree-element-drop"
	}

	function handleDragLeave(event: React.DragEvent): void {
		event.preventDefault();
		refDropTarget.current.className = refDropTarget.current.className.replace(" tree-element-drop", "")
	}

	function handleDragOver(event: React.DragEvent): void {
		event.preventDefault();
		props.onDragOver && props.onDragOver(event)
	}

	function handleDrop(event: React.DragEvent): void {
		refDropTarget.current.className = refDropTarget.current.className.replace(" tree-element-drop", "")
		event.preventDefault();
		props.onDrop && props.onDrop(event);
	}

	function handleContextMenu(event: React.MouseEvent): void {
		props.onContextMenu && props.onContextMenu(event.pageX, event.pageY)
	}

}
