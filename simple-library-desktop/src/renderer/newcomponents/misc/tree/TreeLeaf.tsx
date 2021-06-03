import React, {ReactElement} from "react";
import {Label} from "../../base/label/Label";
import {Icon} from "../../base/icon/Icon";
import "./treeLeaf.css"
import {TreeElement, TreeElementProps} from "./TreeElement";
import {concatClasses} from "../../../components/common/common";

export interface TreeLeafProps extends TreeElementProps {
	label?: string,
}

export function TreeLeaf(props: React.PropsWithChildren<TreeLeafProps>): ReactElement {

	return (
		<TreeElement
			{...props}
			className={concatClasses(props.className, "tree-leaf")}
			onClick={props.onSelect}
			additionalInset="var(--s-1)"
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
		</TreeElement>
	);

}
