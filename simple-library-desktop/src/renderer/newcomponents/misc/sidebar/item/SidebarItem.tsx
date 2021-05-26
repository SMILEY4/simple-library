import {BaseProps} from "../../../common";
import React, {ReactElement} from "react";
import {Icon, IconType} from "../../../base/icon/Icon";
import {concatClasses} from "../../../../components/common/common";
import "./sidebarItem.css"

export interface SidebarItemProps extends BaseProps {
	title?: string,
	icon?: IconType,
	label?: string,
	mini?: boolean
	onAction?: () => void;
}

export function SidebarItem(props: React.PropsWithChildren<SidebarItemProps>): ReactElement {

	if (props.mini) {
		return (
			<div className={concatClasses(props.className, "sidebar-item")} onClick={props.onAction}>
				{props.icon && (
					<div className="sidebar-item-icon">
						<Icon type={props.icon} size="1"/>
					</div>
				)}
			</div>
		)

	} else {
		return (
			<div className={concatClasses(props.className, "sidebar-item")} onClick={props.onAction}>

				{props.icon && (
					<div className="sidebar-item-icon">
						<Icon type={props.icon} size="1"/>
					</div>
				)}
				<div className="sidebar-item-title">
					{props.title}
				</div>
				{props.label && (
					<div className="sidebar-item-label">
						{props.label}
					</div>
				)}
			</div>
		)
	}


}