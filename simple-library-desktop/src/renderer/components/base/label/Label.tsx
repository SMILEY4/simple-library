import {addPropsToChildren, BaseProps, ClickableProps, concatClasses, getIf, map, Size} from "../../utils/common";
import React, {ReactElement} from "react";
import "./label.css"
import {Icon, IconProps} from "../icon/Icon";

export interface LabelProps extends BaseProps, ClickableProps {
	type?: "header-1" | "header-2" | "header-3" | "header-4" | "body" | "caption"
	variant?: "primary" | "secondary" | "info" | "success" | "error" | "warn" | "on-variant"
	align?: "left" | "center" | "right"
	disabled?: boolean,
	italic?: boolean,
	bold?: boolean,
	noSelect?: boolean,
	smallIcon?: boolean,
	overflow?: "wrap" | "nowrap" | "nowrap-hidden" | "cutoff"
}

export function Label(props: React.PropsWithChildren<LabelProps>): React.ReactElement {

	return (
		<div
			className={getClassName()}
			style={props.style}
			ref={props.forwardRef}
			onClick={props.onClick}
		>
			{getModifiedChildren()}
		</div>
	)

	function getClassName(): string {
		return concatClasses(
			props.className,
			"label",
			map(props.type, type => "label-" + type),
			map(props.variant, variant => "label-" + variant),
			map(props.overflow, overflow => "label-overflow-" + overflow),
			map(props.align, align => "label-" + align),
			getIf(props.disabled, "label-disabled"),
			getIf(props.italic, "label-italic"),
			getIf(props.bold, "label-bold"),
			getIf(props.noSelect, "label-no-select"),
		)
	}

	function getModifiedChildren() {
		return addPropsToChildren(
			props.children,
			(prevProps: any) => getModifiedIconProps(prevProps),
			(child: ReactElement) => child.type === Icon,
		);
	}

	function getModifiedIconProps(prevProps: IconProps): IconProps {
		return {
			size: getIconSize(),
			color: props.variant ? props.variant : "primary",
			disabled: props.disabled,
			...prevProps
		};
	}

	function getIconSize(): Size {
		switch (props.type) {
			case "header-1":
				return props.smallIcon ? "1" : "1-5"
			case "header-2":
				return props.smallIcon ? "0-75" : "1"
			case "header-3":
				return props.smallIcon ? "0-75" : "1"
			case "header-4":
				return props.smallIcon ? "0-75" : "1"
			case "body":
				return props.smallIcon ? "0-75" : "1"
			case "caption":
				return "0-75"
			default:
				return props.smallIcon ? "0-75" : "1"
		}
	}


}
