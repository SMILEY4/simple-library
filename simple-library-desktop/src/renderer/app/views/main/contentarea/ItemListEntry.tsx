import React, {CSSProperties} from "react";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {concatClasses, getIf, getSelectModifier, SelectModifier} from "../../../../components/utils/common";
import "./listItemEntry.css";
import {AttributeDTO, AttributeValueDTO, CollectionTypeDTO, ItemDTO} from "../../../../../common/events/dtoModels";
import {MetadataListEntry} from "../sidebarmenu/metadata/MetadataListEntry";

interface ItemListEntryProps {
	item: ItemDTO,
	activeCollectionType: CollectionTypeDTO,
	selected: boolean,
	onSelect: (itemId: number, selectMod: SelectModifier) => void,
	onOpen: (itemId: number) => void,
	onDragStart: (itemId: number, event: React.DragEvent) => void
	onContextMenu: (itemId: number, event: React.MouseEvent) => void,
	onUpdateAttributeValue: (itemId: number, attribKey: string, prevValue: AttributeValueDTO, nextValue: AttributeValueDTO) => Promise<void>
	onLoadImage?: () => void,
	style?: CSSProperties
}

export function ItemListEntry(props: React.PropsWithChildren<ItemListEntryProps>): React.ReactElement {

	return (
		<div
			style={props.style}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			draggable
			onDragStart={handleOnDragStart}
			onContextMenu={handleContextMenu}
		>
			<HBox
				alignMain="start"
				alignCross="center"
				className={concatClasses(
					"list-item-entry",
					getIf(props.selected, "list-item-entry-selected")
				)}
			>
				<div className={"list-item-thumbnail-container"}>
					<img
						className={"list-item-thumbnail"}
						src={props.item.thumbnail}
						alt="img"
						draggable={false}
						onLoad={props.onLoadImage}
					/>
				</div>

				<VBox spacing="0-5" padding="0-75" alignMain="start" alignCross="stretch" fill>
					{props.item.attributes
						.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()))
						.map((entry: AttributeDTO) => (
							<MetadataListEntry
								key={entry.key}
								isEmpty={entry.type === "none" || entry.value === null || entry.value === undefined}
								entry={entry}
								shortName={attributeKey(entry)}
								keySize={30}
								styleType="focus-value"
								onUpdateValue={(prev, next) => handleUpdateAttributeValue(entry.key, prev, next)}
							/>
						))}
				</VBox>
			</HBox>
		</div>
	);

	function handleOnDragStart(event: React.DragEvent): void {
		props.onDragStart(props.item.id, event);
	}

	function handleClick(event: React.MouseEvent): void {
		event.preventDefault();
		event.stopPropagation();
		props.onSelect(props.item.id, getSelectModifier(event));
	}

	function handleDoubleClick(): void {
		props.onOpen(props.item.id);
	}

	function handleContextMenu(event: React.MouseEvent): void {
		props.onContextMenu(props.item.id, event);
	}

	function handleUpdateAttributeValue(key: string, prevValue: AttributeValueDTO, nextValue: AttributeValueDTO): Promise<void> {
		if (prevValue !== nextValue) {
			return props.onUpdateAttributeValue(props.item.id, key, prevValue, nextValue);
		} else {
			return Promise.resolve();
		}
	}

	function attributeKey(attribute: AttributeDTO): string {
		const parts: string[] = attribute.key.split(/\.(.+)/);
		if (parts.length >= 2) {
			return parts[1];
		} else {
			return attribute.key;
		}
	}

}
