import {BaseProps} from "../../common";
import React, {MutableRefObject, useRef, useState} from "react";
import "./choicebox.css"
import {useClickOutside, useStateRef} from "../../../components/common/commonHooks";
import {ChoiceBoxSelector} from "./ChoiceBoxSelector";
import {Manager, Popper, Reference} from "react-popper";
import {sameWidthModifier} from "../../../components/common/popperUtils";
import {ChoiceBoxMenu} from "./ChoiceBoxMenu";
import {mergeRefs} from "../../../components/common/common";

export interface ChoiceBoxItem {
	id: string,
	text: string,
}

export interface ChoiceBoxProps extends BaseProps {
	items: ChoiceBoxItem[],
	selectedItemId?: string,
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	groupPos?: "left" | "right" | "center",
	maxVisibleItems?: number,
	dynamicSize?: boolean,
	onAction?: (itemId: string) => void
}

export function ChoiceBox(props: React.PropsWithChildren<ChoiceBoxProps>): React.ReactElement {

	const [isOpen, setOpen, refOpen] = useStateRef(false);
	const [selectedItemId, setSelectedItemId] = useState(props.selectedItemId ? props.selectedItemId : props.items[0].id);
	const menuRef: MutableRefObject<any> = useClickOutside(handleClickOutside);
	const targetRef: MutableRefObject<any> = useRef(null);

	return (
		<Manager>
			<Reference>
				{({ref}) => {
					targetRef.current = ref;
					return (
						<ChoiceBoxSelector
							items={props.items}
							selectedId={selectedItemId}
							isOpen={isOpen}
							disabled={props.disabled}
							error={props.error}
							variant={props.variant}
							groupPos={props.groupPos}
							dynamicSize={props.dynamicSize}
							onAction={handleClickButton}
							forwardRef={mergeRefs(ref, targetRef)}
							className={props.className}
							style={props.style}
						/>
					)
				}}
			</Reference>
			{isOpen && (
				<Popper placement={"bottom"} modifiers={[sameWidthModifier()]}>
					{({ref, style, placement}) => (
						<div ref={ref} style={{...style, zIndex: 10}} data-placement={placement}>
							<div ref={menuRef} style={{display: 'inline-block', minWidth: "100%"}}>
								<ChoiceBoxMenu
									items={props.items}
									selectedItemId={selectedItemId}
									maxVisibleItems={props.maxVisibleItems ? props.maxVisibleItems : 10}
									onItemAction={handleSelectItem}
								/>
							</div>
						</div>
					)}
				</Popper>
			)}
		</Manager>
	);


	function handleClickButton() {
		setOpen(!isOpen)
	}

	function handleClickOutside(target: any) {
		if (refOpen.current && targetRef.current && !targetRef.current.contains(target)) {
			setOpen(false);
		}
	}

	function handleSelectItem(itemId: string) {
		if (itemId !== selectedItemId) {
			setSelectedItemId(itemId);
			setOpen(false);
			props.onAction && props.onAction(itemId);
		}
	}

}
