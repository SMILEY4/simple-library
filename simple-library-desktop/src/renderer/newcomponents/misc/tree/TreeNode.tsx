import React, {ReactElement} from "react";
import {Icon, IconType} from "../../base/icon/Icon";
import {Label} from "../../base/label/Label";
import "./treeNode.css"
import {TreeElement, TreeElementProps} from "./TreeElement";
import {concatClasses} from "../../../components/common/common";

export interface TreeNodeProps extends TreeElementProps {
	expandable?: boolean,
	expanded: boolean,
	onToggle: () => void
}

export function TreeNode(props: React.PropsWithChildren<TreeNodeProps>): ReactElement {

	return (
		<>
			<TreeElement {...props} className={concatClasses(props.className, "tree-node")}>
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
			</TreeElement>
			{props.expanded && props.expandable && props.children}
		</>
	)

}
