import React, {ReactElement} from "react";
import {Card} from "../../../../../components/layout/card/Card";
import {Slot} from "../../../../../components/base/slot/Slot";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Button} from "../../../../../components/buttons/button/Button";
import "./dialogItemFilter.css";
import {DialogItemFilterCondition} from "./DialogItemFilterCondition";
import {DialogItemFilterExpression} from "./DialogItemFilterExpression";
import {Label} from "../../../../../components/base/label/Label";
import {MenuButton} from "../../../../../components/buttons/menubutton/MenuButton";
import {Icon, IconType} from "../../../../../components/base/icon/Icon";
import {Menu} from "../../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../../components/menu/menuitem/MenuItem";
import {useDialogItemFilter} from "./useDialogItemFilter";
import {
	FilterExpressionTypeDTO, ItemFilterConditionDTO,
	ItemFilterDTO,
	ItemFilterExpressionDTO
} from "../../../../../../common/events/dtoModels";


interface DialogItemFilterProps {
	initFilter?: ItemFilterDTO | null,
	onClose: () => void;
	onApply: (filter: ItemFilterDTO | null) => void
}

export function DialogItemFilter(props: React.PropsWithChildren<DialogItemFilterProps>): React.ReactElement {

	const {
		filter,
		setFilter,
		addExpression,
		removeExpression,
		setAttribute,
		setOperation,
		setValue
	} = useDialogItemFilter(props.initFilter);

	return (
		<Card
			title={"Filter Items"}
			closable={true}
			onClose={props.onClose}
		>
			<Slot name={"body"}>
				<VBox alignMain="start" alignCross="stretch" spacing="0-5" className="filter-container">
					{
						filter
							? renderFilter(filter)
							: renderEmpty(setFilter)
					}
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={props.onClose}>Cancel</Button>
				<Button onAction={() => props.onApply(filter)} variant="info">Apply</Button>
			</Slot>
		</Card>
	);

	function renderFilter(filter: ItemFilterDTO): ReactElement {
		return filter.type === "condition"
			? (
				<DialogItemFilterCondition
					filter={filter as ItemFilterConditionDTO}
					onRemove={removeExpression}
					onSetAttributeId={setAttribute}
					onSetOperation={setOperation}
					onSetValue={setValue}
				/>
			)
			: (
				<DialogItemFilterExpression
					title={filter.type}
					filter={filter as ItemFilterExpressionDTO}
					onAdd={addExpression}
					onRemove={removeExpression}
					onSetAttributeId={setAttribute}
					onSetOperation={setOperation}
					onSetValue={setValue}
				/>
			);
	}

	function renderEmpty(onSet: (type: FilterExpressionTypeDTO) => void): ReactElement {
		return (
			<HBox alignMain="start" alignCross="center" spacing="0-5">
				<Label>No Filter</Label>
				<MenuButton square onAction={(itemId: string) => onSet(itemId as FilterExpressionTypeDTO)}>
					<Slot name={"button"}>
						<Icon type={IconType.PLUS}/>
					</Slot>
					<Slot name={"menu"}>
						<Menu>
							<MenuItem itemId={"and"}>And</MenuItem>
							<MenuItem itemId={"or"}>Or</MenuItem>
							<MenuItem itemId={"not"}>Not</MenuItem>
							<MenuItem itemId={"condition"}>Condition</MenuItem>
						</Menu>
					</Slot>
				</MenuButton>
			</HBox>
		);
	}

}
