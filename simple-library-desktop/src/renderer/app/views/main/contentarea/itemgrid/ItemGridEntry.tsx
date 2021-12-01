import React, {CSSProperties} from "react";
import {VBox} from "../../../../../components/layout/box/Box";
import {concatClasses, getIf, getSelectModifier, SelectModifier} from "../../../../../components/utils/common";
import "./itemGridEntry.css";
import {AttributeValueDTO, CollectionTypeDTO, ItemDTO} from "../../../../../../common/events/dtoModels";
import {Label} from "../../../../../components/base/label/Label";
import {ArrayUtils} from "../../../../../../common/arrayUtils";

interface ItemGridEntryProps {
	item: ItemDTO,
	activeCollectionType: CollectionTypeDTO,
	selected: boolean,
	onSelect: (itemId: number, selectMod: SelectModifier) => void,
	onOpen: (itemId: number) => void,
	onDragStart: (itemId: number, event: React.DragEvent) => void
	onContextMenu: (itemId: number, event: React.MouseEvent) => void,
	onUpdateAttributeValue: (itemId: number, attributeId: number, prevValue: AttributeValueDTO, nextValue: AttributeValueDTO) => Promise<void>
	onLoadImage?: () => void,
	style?: CSSProperties
}

export function ItemGridEntry(props: React.PropsWithChildren<ItemGridEntryProps>): React.ReactElement {

	return (
		<div
			style={props.style}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			draggable
			onDragStart={handleOnDragStart}
			onContextMenu={handleContextMenu}
		>
			<VBox
				alignMain="center"
				alignCross="stretch"
				className={concatClasses(
					"grid-item-entry",
					getIf(props.selected, "grid-item-entry-selected")
				)}
			>
				<div className={"grid-item-thumbnail-container"}>
					<img
						className={"grid-item-thumbnail"}
						src={props.item.thumbnail}
						alt="img"
						draggable={false}
						onLoad={props.onLoadImage}
					/>
				</div>
				<Label className={"grid-item-label"}>
					{ArrayUtils.last(props.item.filepath.split("\\"))}
				</Label>
			</VBox>
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

	function handleUpdateAttributeValue(attributeId: number, prevValue: AttributeValueDTO, nextValue: AttributeValueDTO): Promise<void> {
		if (prevValue !== nextValue) {
			return props.onUpdateAttributeValue(props.item.id, attributeId, prevValue, nextValue);
		} else {
			return Promise.resolve();
		}
	}

}
