import {BaseProps} from "../../../utils/common";
import React, {ReactElement, useState} from "react";
import {addPropsToChildren, concatClasses} from "../../../utils/common";
import "./sidebarGroup.css"
import {Icon, IconType} from "../../../base/icon/Icon";
import {VBox} from "../../../layout/box/Box";

export interface SidebarGroupProps extends BaseProps {
	title?: string,
	icon?: IconType,
	mini?: boolean
}

export function SidebarGroup(props: React.PropsWithChildren<SidebarGroupProps>): ReactElement {

	const [show, setShow] = useState(false);

	if (props.mini) {
		return (
			<div className="sidebar-group-wrapper sidebar-group-wrapper-mini">
				<div className={concatClasses(props.className, "sidebar-group")} onClick={() => setShow(!show)}>
					<div className="sidebar-item-toggle">
						<Icon type={show ? IconType.CHEVRON_DOWN : IconType.CHEVRON_RIGHT} size="0-75"/>
					</div>
					{props.icon && (
						<div className="sidebar-item-icon">
							<Icon type={props.icon} size="1"/>
						</div>
					)}
				</div>
				{show && (
					<VBox
						className={concatClasses(props.className, "sidebar-group-content")}
						alignMain="start"
						alignCross={props.mini ? "center" : "stretch"}
						spacing="0-15"
					>
						{getModifiedChildren()}
					</VBox>
				)}
			</div>

		)

	} else {
		return (
			<div className="sidebar-group-wrapper">
				<div className={concatClasses(props.className, "sidebar-group")} onClick={() => setShow(!show)}>
					<div className="sidebar-item-toggle">
						<Icon type={show ? IconType.CHEVRON_DOWN : IconType.CHEVRON_RIGHT} size="0-75"/>
					</div>
					{props.icon && (
						<div className="sidebar-item-icon">
							<Icon type={props.icon} size="1"/>
						</div>
					)}
					<div className="sidebar-item-title">
						{props.title}
					</div>
				</div>
				{show && (
					<VBox
						className={concatClasses(props.className, "sidebar-group-content")}
						alignMain="start"
						alignCross={props.mini ? "center" : "stretch"}
						spacing="0-15"
					>
						{getModifiedChildren()}
					</VBox>
				)}
			</div>
		)
	}

	function getModifiedChildren(): ReactElement[] {
		return addPropsToChildren(props.children, prevProps => ({...prevProps, mini: props.mini}))
	}
}
