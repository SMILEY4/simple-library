import {BaseProps, Size} from "../../common";
import React, {ReactElement} from "react";
import "./label.css"
import {addPropsToChildren, concatClasses, getIf, mapOrDefault} from "../../../components/common/common";
import {Icon, IconProps} from "../icon/Icon";

export interface LabelProps extends BaseProps {
	type?: "header-1" | "header-2" | "header-3" | "header-4" | "body" | "caption"
	variant?: "primary" | "secondary" | "info" | "success" | "error" | "warn" | "on-variant"
	disabled?: boolean,
	italic?: boolean,
	noSelect?: boolean,
	overflow?: "wrap" | "nowrap" | "nowrap-hidden" | "cutoff"
}

export function Label(props: React.PropsWithChildren<LabelProps>): React.ReactElement {

	return (
		<div className={getClassName()} style={props.style} ref={props.forwardRef}>
			{getModifiedChildren()}
		</div>
	)

	function getClassName(): string {
		return concatClasses(
			"label",
			mapOrDefault(props.type, "body", type => "label-" + type),
			mapOrDefault(props.variant, "primary", variant => "label-" + variant),
			mapOrDefault(props.overflow, "wrap", overflow => "label-overflow-" + overflow),
			getIf(props.disabled, "label-disabled"),
			getIf(props.italic, "label-italic"),
			getIf(props.noSelect, "label-no-select"),
			props.className
		)
	}

	function getModifiedChildren() {
		let elements = props.children;
		if (props.overflow === "cutoff") {
			elements = React.Children.map(elements, (child: any) => {
				if (typeof child === "string") {
					return <div className="label-text-wrapper">{child}</div>;
				} else {
					return child;
				}
			});
		}
		return addPropsToChildren(
			elements,
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
				return "1-5"
			case "header-2":
				return "1"
			case "header-3":
				return "1"
			case "header-4":
				return "1"
			case "body":
				return "1"
			case "caption":
				return "0-75"
			default:
				return "1"
		}
	}


}
