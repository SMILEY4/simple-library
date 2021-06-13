import * as React from "react";
import {ReactElement} from "react";
import {BaseProps} from "../../utils/common";
import {concatClasses, getIf, mapOrDefault} from "../../utils/common";
import "./badge.css"
import {Icon, IconType} from "../../base/icon/Icon";

interface BadgeProps extends BaseProps {
	variant?: "info" | "success" | "error" | "warn" | "on-variant"
	text?: string,
	icon?: IconType,
}

export function Badge(props: React.PropsWithChildren<BadgeProps>): ReactElement {

	return (
		<div className={"badge-wrapper"}>
			{props.children}
			<div className={getClassName()}>
				{props.icon
					? <Icon type={props.icon} size="0-75" color="on-variant"/>
					: props.text ? props.text : null}
			</div>
		</div>
	);

	function getClassName() {
		return concatClasses(
			props.className,
			"badge",
			getIf(!!props.text, "badge-text"),
			getIf(!!props.icon, "badge-icon"),
			getIf(!props.text && !props.icon, "badge-point"),
			mapOrDefault(props.variant, "info", variant => "badge-" + variant)
		)
	}

}
