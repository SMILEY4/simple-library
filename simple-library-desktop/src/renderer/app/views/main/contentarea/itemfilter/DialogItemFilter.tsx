import React, {useState} from "react";
import {Card} from "../../../../../components/layout/card/Card";
import {Slot} from "../../../../../components/base/slot/Slot";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Button} from "../../../../../components/buttons/button/Button";
import "./dialogItemFilter.css";
import {Label} from "../../../../../components/base/label/Label";
import {MenuButton} from "../../../../../components/buttons/menubutton/MenuButton";
import {Menu} from "../../../../../components/menu/menu/Menu";
import {MenuItem} from "../../../../../components/menu/menuitem/MenuItem";
import {Icon, IconType} from "../../../../../components/base/icon/Icon";
import {ArrayUtils} from "../../../../../../common/arrayUtils";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {ChoiceBox} from "../../../../../components/buttons/choicebox/ChoiceBox";


export type ItemFilter = ItemFilterCondition | ItemFilterExpression;

export type FilterOperationType = "eq" | "like"
export type FilterExpressionType = "and" | "or" | "not" | "condition"

export interface ItemFilterCondition {
	id: string,
	type: FilterExpressionType,
	attributeId: string,
	operation: FilterOperationType,
	value: string,
}

export interface ItemFilterExpression {
	id: string,
	type: FilterExpressionType,
	childFilters: ItemFilter[]
}


interface DialogItemFilterProps {
	onClose: () => void;
}

export function DialogItemFilter(props: React.PropsWithChildren<DialogItemFilterProps>): React.ReactElement {

	const [filter, setFilter] = useState<ItemFilter>({
		id: "1",
		type: "and",
		value: "",
		childFilters: [
			{
				id: "2",
				type: "condition",
				attributeId: "myAtt1",
				operation: "eq",
				value: "myvalue1"
			},
			{
				id: "3",
				type: "or",
				value: "",
				childFilters: [
					{
						id: "4",
						type: "condition",
						attributeId: "myAtt2",
						operation: "eq",
						value: "myvalue2"
					},
					{
						id: "5",
						type: "condition",
						attributeId: "myAtt3",
						operation: "eq",
						value: "myvalue3"
					}
				]
			}
		]
	});

	return (
		<Card
			title={"Filter Items"}
			closable={true}
			onClose={props.onClose}
		>
			<Slot name={"body"}>
				<VBox alignMain="start" alignCross="stretch" spacing="0-5" className="filter-container">
					{filter.type === "condition"
						? (<DialogItemFilterCondition
							filter={filter as ItemFilterCondition}
							onRemove={onRemoveExpression}
							onSetAttributeId={onSetAttributeId}
							onSetOperation={onSetOperation}
							onSetValue={onSetValue}
						/>)
						: (<DialogItemFilterExpression
							filter={filter as ItemFilterExpression}
							onAdd={onAddExpression}
							onRemove={onRemoveExpression}
							onSetAttributeId={onSetAttributeId}
							onSetOperation={onSetOperation}
							onSetValue={onSetValue}
						/>)}
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={props.onClose}>Cancel</Button>
				<Button onAction={props.onClose} variant="info">Apply</Button>
			</Slot>
		</Card>
	);


	function onAddExpression(parentId: string, addedType: "and" | "or" | "not" | "condition") {
		const newFilter: ItemFilter = {...filter};
		walkFilter(
			newFilter,
			() => true,
			(current: ItemFilterExpression) => {
				if (current.id === parentId) {
					current.childFilters = [{
						id: Math.random() + "" + Date.now(),
						type: addedType,
						value: "",
						childFilters: []
					}, ...current.childFilters];
					return false;
				} else {
					return true;
				}
			}
		);
		setFilter(newFilter);
	}

	function onRemoveExpression(id: string) {
		const newFilter: ItemFilter = {...filter};
		walkFilter(
			newFilter,
			() => true,
			(current: ItemFilterExpression) => {
				if (current.childFilters.some(c => c.id === id)) {
					ArrayUtils.removeInPlace(current.childFilters, id, (a, b) => a.id === b);
					return false;
				} else {
					return true;
				}
			}
		);
		setFilter(newFilter);
	}

	function onSetAttributeId(id: string, attributeId: string) {
		const newFilter: ItemFilter = {...filter};
		walkFilter(
			newFilter,
			(filter: ItemFilterCondition) => {
				if (filter.id === id) {
					filter.attributeId = attributeId;
					return false;
				} else {
					return true;
				}
			},
			() => true
		);
		setFilter(newFilter);
	}

	function onSetOperation(id: string, op: FilterOperationType) {
		const newFilter: ItemFilter = {...filter};
		walkFilter(
			newFilter,
			(filter: ItemFilterCondition) => {
				if (filter.id === id) {
					filter.operation = op;
					return false;
				} else {
					return true;
				}
			},
			() => true
		);
		setFilter(newFilter);
	}

	function onSetValue(id: string, value: string) {
		const newFilter: ItemFilter = {...filter};
		walkFilter(
			newFilter,
			(filter: ItemFilterCondition) => {
				if (filter.id === id) {
					filter.value = value;
					return false;
				} else {
					return true;
				}
			},
			() => true
		);
		setFilter(newFilter);
	}

	function walkFilter(
		filter: ItemFilter,
		onCondition: (filter: ItemFilterCondition) => boolean,
		onExpression: (filter: ItemFilterExpression) => boolean
	) {
		if (filter.type === "condition") {
			if (!onCondition(filter as ItemFilterCondition)) {
				return false;
			}
		} else {
			const expr = filter as ItemFilterExpression;
			if (!onExpression(expr)) {
				return false;
			}
			for (let child of expr.childFilters) {
				if (!walkFilter(child, onCondition, onExpression)) {
					return false;
				}
			}
		}
		return true;
	}

}


interface DialogItemFilterExpressionProps {
	filter: ItemFilterExpression
	onAdd: (parentId: string, type: "and" | "or" | "not" | "condition") => void,
	onRemove: (id: string) => void
	onSetAttributeId: (id: string, attId: string) => void
	onSetOperation: (id: string, op: string) => void
	onSetValue: (id: string, value: string) => void
}

function DialogItemFilterExpression(props: React.PropsWithChildren<DialogItemFilterExpressionProps>): React.ReactElement {
	return (
		<VBox alignMain="start" alignCross="stretch" spacing="0-25" className="filter-expression">
			<HBox alignMain="start" alignCross="center" spacing="0-5">
				<Label type="header-4">{props.filter.type.toUpperCase()}</Label>
				<MenuButton square onAction={(itemId: string) => props.onAdd(props.filter.id, itemId as FilterExpressionType)}>
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
						? (<DialogItemFilterCondition
							key={filter.id}
							filter={filter as ItemFilterCondition}
							onRemove={props.onRemove}
							onSetAttributeId={props.onSetAttributeId}
							onSetOperation={props.onSetOperation}
							onSetValue={props.onSetValue}
						/>)
						: (<DialogItemFilterExpression
							key={filter.id}
							filter={filter as ItemFilterExpression}
							onAdd={props.onAdd}
							onRemove={props.onRemove}
							onSetAttributeId={props.onSetAttributeId}
							onSetOperation={props.onSetOperation}
							onSetValue={props.onSetValue}
						/>);
				})}
			</VBox>
		</VBox>
	);
}


interface DialogItemFilterConditionProps {
	filter: ItemFilterCondition;
	onRemove: (id: string) => void;
	onSetAttributeId: (id: string, attId: string) => void;
	onSetOperation: (id: string, op: string) => void;
	onSetValue: (id: string, value: string) => void;
}

function DialogItemFilterCondition(props: React.PropsWithChildren<DialogItemFilterConditionProps>): React.ReactElement {
	return (
		<HBox alignMain="space-between" alignCross="center" className="filter-condition">
			<HBox alignMain="start" alignCross="center" spacing="0-15" className="filter-condition-content">
				<TextField
					placeholder={"Attribute Id"}
					value={props.filter.attributeId}
					onAccept={value => props.onSetAttributeId(props.filter.id, value)}
				/>
				<ChoiceBox
					items={[
						{id: "eq", text: "Equals"},
						{id: "like", text: "Like"}
					]}
					selectedItemId={props.filter.operation}
					onAction={value => props.onSetOperation(props.filter.id, value)}
				/>
				<TextField
					placeholder={"Value"}
					value={props.filter.value}
					onAccept={value => props.onSetValue(props.filter.id, value)}
				/>
			</HBox>
			<Button square onAction={() => props.onRemove(props.filter.id)} className="btn-remove-expr">
				<Icon type={IconType.CLOSE}/>
			</Button>
		</HBox>
	);
}


