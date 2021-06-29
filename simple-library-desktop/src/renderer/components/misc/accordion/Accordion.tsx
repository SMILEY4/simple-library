import * as React from "react";
import {ReactElement, useState} from "react";
import {BaseProps, concatClasses, getIf} from "../../utils/common";
import "./accordion.css"
import {Label} from "../../base/label/Label";
import {Icon, IconType} from "../../base/icon/Icon";
import getOffsetParent from "@popperjs/core/lib/dom-utils/getOffsetParent";

interface AccordionProps extends BaseProps {
	title: string,
	icon?: IconType,
	label?: string,
	noBorder?: boolean,
}

export function Accordion(props: React.PropsWithChildren<AccordionProps>): ReactElement {

	const [open, setOpen] = useState(false);

	return (
		<div className={getClassName()}>

			<div className="accordion-header" onClick={onToggle}>
				<Icon type={open ? IconType.CHEVRON_DOWN : IconType.CHEVRON_RIGHT}/>
				<Label noSelect overflow="nowrap-hidden">
					{props.icon && (<Icon type={props.icon}/>)}
					{props.title}
				</Label>
				{props.label && (
					<Label className={"accordion-label"} noSelect type="caption" variant="secondary">
						{props.label}
					</Label>
				)}
			</div>

			{open && (
				<div className={"accordion-body"}>
					{props.children}
				</div>
			)}

		</div>
	);

	function getClassName() {
		return concatClasses(
			props.className,
			"accordion",
			getIf(open, "accordion-open"),
			getIf(props.noBorder, "accordion-no-border")
		)
	}

	function onToggle() {
		setOpen(!open)
	}

}
