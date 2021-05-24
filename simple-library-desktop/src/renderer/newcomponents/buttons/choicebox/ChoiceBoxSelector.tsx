import React, {PropsWithChildren, ReactElement} from "react";
import {Button} from "../button/Button";
import {SelectionDisplay} from "../../base/selectionDisplay/SelectionDisplay";
import {Label} from "../../base/label/Label";
import {Icon, IconType} from "../../base/icon/Icon";
import {ChoiceBoxItem} from "./ChoiceBox";
import {BaseProps, concatClasses} from "../../../components/common/common";

export interface ChoiceBoxSelectorProps extends BaseProps {
	items: ChoiceBoxItem[]
	selectedId: string,
	isOpen: boolean,
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	groupPos?: "left" | "right" | "center",
	dynamicSize?: boolean,
	onAction?: () => void
}

export function ChoiceBoxSelector(props: PropsWithChildren<ChoiceBoxSelectorProps>): ReactElement {

	return (
		<Button
			disabled={props.disabled}
			error={props.error}
			variant={props.variant}
			groupPos={props.groupPos}
			onAction={props.onAction}
			className={concatClasses("choicebox-selector", props.className)}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			<SelectionDisplay>
				{renderSelectedItem(props.items.find(item => item.id === props.selectedId))}
				{props.dynamicSize !== true && props.items.map(item => <Label type="body" key={item.id}>{item.text}</Label>)}
			</SelectionDisplay>
			<Icon type={props.isOpen ? IconType.CHEVRON_UP : IconType.CHEVRON_DOWN}/>
		</Button>
	);

	function renderSelectedItem(item: ChoiceBoxItem): ReactElement {
		return (
			<Label
				type="body"
				variant={getSelectedLabelVariant()}
				disabled={props.disabled}
				noSelect
				overflow="cutoff"
				key={item.id}
			>
				{item.text}
			</Label>
		);
	}

	function getSelectedLabelVariant() {
		switch (props.variant) {
			case "info":
			case "success":
			case "error":
			case "warn":
				return "on-variant"
			default:
				return "primary"
		}
	}

}