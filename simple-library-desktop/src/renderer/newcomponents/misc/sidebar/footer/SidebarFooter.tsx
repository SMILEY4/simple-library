import {BaseProps} from "../../../common";
import * as React from "react";
import {ReactElement} from "react";
import {concatClasses} from "../../../../components/common/common";
import {Icon, IconType} from "../../../base/icon/Icon";
import "./sidebarFooter.css"

export interface SidebarFooterProps extends BaseProps {
	mini?: boolean,
	onToggleMini?: () => void;
}

export function SidebarFooter(props: React.PropsWithChildren<SidebarFooterProps>): ReactElement {

	if (props.mini) {
		return (
			<div className={concatClasses(props.className, "sidebar-footer")} onClick={props.onToggleMini}>
				<div className="sidebar-footer-icon">
					<Icon type={props.mini ? IconType.CHEVRON_DOUBLE_RIGHT : IconType.CHEVRON_DOUBLE_LEFT} size="1"/>
				</div>
			</div>
		)

	} else {
		return (
			<div className={concatClasses(props.className, "sidebar-footer")} onClick={props.onToggleMini}>
				<div className="sidebar-footer-icon">
					<Icon type={props.mini ? IconType.CHEVRON_DOUBLE_RIGHT : IconType.CHEVRON_DOUBLE_LEFT} size="1"/>
				</div>
				<div className="sidebar-footer-title">
					Collapse
				</div>
			</div>
		)
	}


}
