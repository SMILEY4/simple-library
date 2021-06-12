import React, {ReactElement} from "react";
import {HBox} from "../box/Box";
import {BaseProps} from "../../utils/common";
import {addPropsToChildren, childrenCount, concatClasses} from "../../utils/common";

interface GroupProps extends BaseProps {
	error?: boolean
}

export function Group(props: React.PropsWithChildren<GroupProps>): React.ReactElement {

	return (
		<HBox
			className={concatClasses(props.className, "group")}
			forwardRef={props.forwardRef}
			style={props.style}
		>
			{getModifiedChildren()}
		</HBox>
	)

	function getModifiedChildren(): ReactElement[] {
		const count: number = childrenCount(props.children);
		return addPropsToChildren(
			props.children,
			(prevProps: any, index: number) => ({
				groupPos: getGroupPos(index, count),
				error: props.error,
				...prevProps
			})
		)
	}

	function getGroupPos(index: number, total: number): "left" | "right" | "center" | undefined {
		if (total === 1) {
			return undefined
		} else if (index === 0) {
			return "left"
		} else if (index === total - 1) {
			return "right"
		} else {
			return "center"
		}
	}

}
