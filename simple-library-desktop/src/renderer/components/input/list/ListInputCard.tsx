import {BaseProps} from "../../utils/common";
import React, {useRef, useState} from "react";
import {Card} from "../../layout/card/Card";
import {Slot} from "../../base/slot/Slot";
import {HBox, VBox} from "../../layout/box/Box";
import {Button} from "../../buttons/button/Button";
import {TextField, TFAcceptCause} from "../textfield/TextField";
import {Icon, IconType} from "../../base/icon/Icon";
import {List} from "../../misc/list/List";
import {Label} from "../../base/label/Label";
import "./listInputCard.css"

interface ListInputCardProps extends BaseProps {
	listName: string,
	initItems: string[]
	nVisibleItems?: number
	enforceUnique?: boolean,
	uniquenessCaseSensitive?: boolean,
	onCancel?: () => void,
	onSave?: (items: string[]) => void
}

export function ListInputCard(props: React.PropsWithChildren<ListInputCardProps>): React.ReactElement {

	const [value, setValue] = useState("");
	const [items, setItems] = useState(props.initItems);
	const refInput = useRef(null);
	const refList = useRef(null);

	return (
		<Card
			className={"list-input-card"}
			title={"Edit '" + props.listName + "'"}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">

					<HBox>
						<TextField
							value={value}
							forceState
							autofocus
							refInputField={refInput}
							groupPos="left"
							style={{flexGrow: 1}}
							onChange={setValue}
							onAccept={(value: string, cause: TFAcceptCause) => cause === "enter" && handleOnAddItem(value)}
						/>
						<Button
							groupPos="right"
							square
							onAction={handleOnAddItemCurrent}
						>
							<Icon type={IconType.PLUS}/>
						</Button>
					</HBox>

					<List
						forwardRef={refList}
						items={items}
						nVisibleItems={props.nVisibleItems}
						onRemove={handleOnRemove}
					/>

					<HBox alignMain="space-between" alignCross="center" spacing={"0-25"}>
						<Button onAction={handleOnSort}>
							Sort
						</Button>
						<Label
							type="caption"
							variant="secondary"
							style={{alignSelf: "flex-end"}}
						>
							{items.length + (items.length === 1 ? " Item" : " Items")}
						</Label>
					</HBox>

				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleSave} variant="info">Save</Button>
			</Slot>
		</Card>
	);

	function handleOnAddItemCurrent() {
		handleOnAddItem(value);
	}

	function handleOnAddItem(value: string) {
		const item = value.trim();
		setValue("");
		refInput.current.select();
		if (item.length > 0) {
			let newItems: string[];
			if(props.enforceUnique) {
				const indexExisting = indexOfItem(item);
				if(indexExisting === -1) {
					newItems = [item, ...items];
				} else {
					newItems = items;
					newItems.splice(indexExisting, 1)
					newItems = [value, ...newItems]
				}
			} else {
				newItems = [value, ...items];
			}
			setItems(newItems)
		}
	}

	function indexOfItem(item: string): number {
		const newItem: string = props.uniquenessCaseSensitive ? item : item.toLowerCase();
		return items
			.map(i => props.uniquenessCaseSensitive ? i : i.toLowerCase())
			.indexOf(newItem);
	}

	function handleOnRemove(item: string, index: number) {
		const newItems = [...items];
		newItems.splice(index, 1);
		setItems(newItems);
	}

	function handleOnSort() {
		setItems([...items].sort());
	}

	function handleCancel() {
		props.onCancel && props.onCancel();
	}

	function handleSave() {
		props.onSave && props.onSave(items);
	}

}
