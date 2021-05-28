import {BaseProps} from "../../../common";
import * as React from "react";
import {ReactElement} from "react";
import "./sidebarSection.css"
import {VBox} from "../../../layout/box/Box";
import {addPropsToChildren, concatClasses, getIf} from "../../../../components/common/common";
import {SidebarTitle} from "../title/SidebarTitle";

export interface SidebarSectionProps extends BaseProps {
	scrollable?: boolean,
	title?: string,
	mini?: boolean,
}

export function SidebarSection(props: React.PropsWithChildren<SidebarSectionProps>): ReactElement {

	return (
		<>
			{props.title && <SidebarTitle text={props.title}/>}
			<VBox
				className={concatClasses(
					props.className,
					"sidebar-section",
					getIf(props.scrollable, "sidebar-section-scrollable")
				)}
				alignMain="start"
				alignCross={props.mini ? "center" : "stretch"}
				spacing="0-15"
				style={props.style}
				forwardRef={props.forwardRef}
			>
				{getModifiedChildren()}
			</VBox>
		</>
	);


	function getModifiedChildren(): ReactElement[] {
		return addPropsToChildren(props.children, prevProps => ({...prevProps, mini: props.mini}))
	}

}
