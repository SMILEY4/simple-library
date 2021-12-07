import React from "react";
import {HBox} from "../../../../../components/layout/box/Box";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {ChoiceBox} from "../../../../../components/buttons/choicebox/ChoiceBox";
import {Button} from "../../../../../components/buttons/button/Button";
import {Icon, IconType} from "../../../../../components/base/icon/Icon";
import {ItemFilterConditionDTO} from "../../../../../../common/events/dtoModels";

interface DialogItemFilterConditionProps {
	filter: ItemFilterConditionDTO;
	onRemove: (id: string) => void;
	onSetAttributeId: (id: string, attId: string) => void;
	onSetOperation: (id: string, op: string) => void;
	onSetValue: (id: string, value: string) => void;
}

export function DialogItemFilterCondition(props: React.PropsWithChildren<DialogItemFilterConditionProps>): React.ReactElement {
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


