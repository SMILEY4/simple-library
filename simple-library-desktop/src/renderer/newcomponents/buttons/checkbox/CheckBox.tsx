import {BaseProps} from "../../common";
import React, {useState} from "react";
import {Button} from "../button/Button";
import {Icon, IconType} from "../../base/icon/Icon";
import {Label} from "../../base/label/Label";
import {concatClasses} from "../../../components/common/common";
import "./checkbox.css"

export interface CheckBoxProps extends BaseProps {
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	selected?: boolean,
	forceState?: boolean,
	onToggle?: (selected: boolean) => void
}

export function CheckBox(props: React.PropsWithChildren<CheckBoxProps>): React.ReactElement {

	const [selected, setSelected] = useState(props.selected === true);

	return (
		<div
			className={concatClasses(props.className, "checkbox")}
			style={props.style}
			ref={props.forwardRef}
		>
			<Button
				disabled={props.disabled}
				error={props.error}
				variant={props.variant}
				onAction={handleAction}
				square
			>
				{isCheckboxSelected()
					? <Icon type={IconType.CHECKMARK} size="0-75"/>
					: null}
			</Button>
			<Label
				disabled={props.disabled}
				type="body"
				variant="primary"
				overflow="cutoff"
			>
				{props.children}
			</Label>
		</div>
	);

	function isCheckboxSelected(): boolean {
		return props.forceState
			? props.selected === true
			: selected
	}

	function handleAction() {
		if(!props.disabled) {
			const nextSelected = !isCheckboxSelected();
			if(!props.forceState) {
				!props.forceState && setSelected(nextSelected);
			}
			props.onToggle && props.onToggle(nextSelected)
		}
	}

}
