import React from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {MenuButton} from "../../../../../components/buttons/menubutton/MenuButton";
import {Slot} from "../../../../../components/base/slot/Slot";
import {Icon, IconType} from "../../../../../components/base/icon/Icon";
import {Menu} from "../../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../../components/menu/menuitem/MenuItem";
import {Button} from "../../../../../components/buttons/button/Button";
import {DialogItemFilterCondition} from "./DialogItemFilterCondition";
import {
	FilterExpressionTypeDTO,
	ItemFilterConditionDTO,
	ItemFilterExpressionDTO
} from "../../../../../../common/events/dtoModels";

interface DialogItemFilterExpressionProps {
	title: string,
	filter: ItemFilterExpressionDTO
	onAdd: (parentId: string, type: "and" | "or" | "not" | "condition") => void,
	onRemove: (id: string) => void
	onSetAttributeId: (id: string, attId: string) => void
	onSetOperation: (id: string, op: string) => void
	onSetValue: (id: string, value: string) => void
}

export function DialogItemFilterExpression(props: React.PropsWithChildren<DialogItemFilterExpressionProps>): React.ReactElement {
	return (
		<VBox alignMain="start" alignCross="stretch" spacing="0-25" className="filter-expression">
			<HBox alignMain="start" alignCross="center" spacing="0-5">
				<Label type="header-4">{props.title}</Label>
				<MenuButton square onAction={(itemId: string) => props.onAdd(props.filter.id, itemId as FilterExpressionTypeDTO)}>
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
				<Button square onAction={() => props.onRemove(props.filter.id)} className="btn-remove-expr">
					<Icon type={IconType.CLOSE}/>
				</Button>
			</HBox>
			<VBox alignMain="start" alignCross="stretch" spacing="0-5" className="filter-expression-container">
				{props.filter.childFilters.map(filter => {
					return filter.type === "condition"
						? (
							<DialogItemFilterCondition
								key={filter.id}
								filter={filter as ItemFilterConditionDTO}
								onRemove={props.onRemove}
								onSetAttributeId={props.onSetAttributeId}
								onSetOperation={props.onSetOperation}
								onSetValue={props.onSetValue}
							/>
						)
						: (
							<DialogItemFilterExpression
								key={filter.id}
								title={filter.type}
								filter={filter as ItemFilterExpressionDTO}
								onAdd={props.onAdd}
								onRemove={props.onRemove}
								onSetAttributeId={props.onSetAttributeId}
								onSetOperation={props.onSetOperation}
								onSetValue={props.onSetValue}
							/>
						);
				})}
			</VBox>
		</VBox>
	);
}