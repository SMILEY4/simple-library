import React, {MutableRefObject, ReactElement, useRef} from "react";
import {IconType} from "../../base/icon/Icon";
import "./treeElement.css"
import {concatClasses, getIf} from "../../../components/common/common";
import {BaseProps} from "../../utils/common";


export interface TreeElementProps extends BaseProps {

	value: string,
	icon?: IconType,

	selected?: boolean,
	depth: number,

	onSelect?: () => void,
	onDoubleClick?: () => void,
	onContextMenu?: (pageX: number, pageY: number) => void,

	draggable?: boolean,
	onDrag?: (event: React.DragEvent) => void,

	dropTarget?: boolean,
	onDragOver?: (event: React.DragEvent) => void,
	onDrop?: (event: React.DragEvent) => void,

	additionalInset?: string,

	onClick?: () => void,
	__onContextMenu?: (e: React.MouseEvent) => void
}

export function TreeElement(props: React.PropsWithChildren<TreeElementProps>): ReactElement {

	const refDropTarget: MutableRefObject<any> = useRef(null);

	return (
		<div
			className={concatClasses(props.className, "tree-element", getIf(props.selected, "tree-element-selected"))}
			style={{...props.style, paddingLeft: calculateInset()}}
			draggable={props.draggable}
			onDragStart={handleDragStart}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragExit}
			onDrop={handleDrop}
			onClick={props.onClick}
			onContextMenu={props.__onContextMenu}
			ref={refDropTarget}
		>
			{props.children}
		</div>
	)

	function calculateInset(): string {
		const inset: string = "var(--s-1) * " + props.depth
			+ " + var(--s-0-25)"
			+ (props.additionalInset ? " + " + props.additionalInset : "")
		return "calc(" + inset + ")";
	}

	function handleDragStart(event: React.DragEvent): void {
		if (props.draggable) {
			props.onDrag && props.onDrag(event)
		}
	}

	function handleDragEnter(event: React.DragEvent): void {
		if (props.dropTarget) {
			props.onDragOver && props.onDragOver(event)
			refDropTarget.current.className += " tree-element-drop"
		} else {
			event.dataTransfer.dropEffect = "none"
		}
	}

	function handleDragExit(event: React.DragEvent): void {
		if (props.dropTarget) {
			refDropTarget.current.className = refDropTarget.current.className.replace(" tree-element-drop", "")
		}
	}

	function handleDragOver(event: React.DragEvent): void {
		event.preventDefault();
		// without this, the drag-and-drop wont work (for some reason)
	}

	function handleDrop(event: React.DragEvent): void {
		if (props.dropTarget) {
			refDropTarget.current.className = refDropTarget.current.className.replace(" tree-element-drop", "")
			event.preventDefault();
			props.onDrop && props.onDrop(event);
		}
	}

}
