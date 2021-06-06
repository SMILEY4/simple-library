import React, {MutableRefObject, ReactElement, useRef} from "react";
import {concatClasses, getIf} from "../../../components/common/common";
import {calculateInset} from "./treeElementUtils";
import "./treeElement.css"
import "./treeLeaf.css"
import {Label} from "../../base/label/Label";
import {Icon} from "../../base/icon/Icon";
import {TreeElementProps} from "./TreeView";
import {addClass, removeClass} from "../../utils/common";

export interface TreeElementLeafProps extends TreeElementProps {
	label?: string,
}

export function TreeElementLeaf(props: React.PropsWithChildren<TreeElementLeafProps>): ReactElement {

	const refDropTarget: MutableRefObject<any> = useRef(null);

	return (
		<div
			className={concatClasses(props.className, "tree-leaf", "tree-element", getIf(props.selected, "tree-element-selected"))}
			style={{...props.style, paddingLeft: calculateInset(props.depth, "var(--s-1)")}}
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

	function handleDragStart(event: React.DragEvent): void {
		props.onDrag && props.onDrag(event)
		props.onSelect()
	}

	function handleDragEnter(event: React.DragEvent): void {
		event.preventDefault();
		props.onDragOver && props.onDragOver(event)
		if (event.dataTransfer.dropEffect !== "none") {
			addClass(refDropTarget.current, "tree-element-drop")
		}
	}

	function handleDragLeave(event: React.DragEvent): void {
		event.preventDefault();
		removeClass(refDropTarget.current, "tree-element-drop");
	}

	function handleDragOver(event: React.DragEvent): void {
		event.preventDefault();
		props.onDragOver && props.onDragOver(event)
	}

	function handleDrop(event: React.DragEvent): void {
		event.preventDefault();
		removeClass(refDropTarget.current, "tree-element-drop");
		props.onDrop && props.onDrop(event);
	}

	function handleContextMenu(event: React.MouseEvent): void {
		props.onContextMenu && props.onContextMenu(event.pageX, event.pageY)
	}
}
