import React from "react";
import {HBox, VBox} from "../../../../components/layout/box/Box";
import {concatClasses, getIf, getSelectModifier, SelectModifier} from "../../../../components/utils/common";
import "./listItemEntry.css"
import {AttributeDTO, CollectionTypeDTO, ItemDTO} from "../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../components/misc/keyvaluepair/KeyValuePair";
import {Label} from "../../../../components/base/label/Label";

interface ItemListEntryProps {
    item: ItemDTO,
    activeCollectionType: CollectionTypeDTO,
    selected: boolean,
    onSelect: (itemId: number, selectMod: SelectModifier) => void,
    onOpen: (itemId: number) => void,
    onDragStart: (itemId: number, event: React.DragEvent) => void
    onContextMenu: (itemId: number, event: React.MouseEvent) => void,
}

export function ItemListEntry(props: React.PropsWithChildren<ItemListEntryProps>): React.ReactElement {

    return (
        <div
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
                <img src={props.item.thumbnail} alt='img' draggable={false} style={{padding: "var(--s-0-5)"}}/>

                <VBox spacing="0-5" padding="0-75" alignMain="start" alignCross="stretch" fill>
                    {props.item.attributes
                        .sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()))
                        .map((entry: AttributeDTO) => (
                            <KeyValuePair key={entry.key} keyValue={attributeKey(entry)} keySize={30}
                                          styleType="focus-value">
                                {entry.type === "none" || entry.value === null || entry.value === undefined
                                    ? <Label overflow="nowrap-hidden" italic disabled>none</Label>
                                    : <Label overflow="nowrap-hidden">{entry.value}</Label>}
                            </KeyValuePair>
                        ))}
                </VBox>
            </HBox>
        </div>
    );

    function handleOnDragStart(event: React.DragEvent): void {
        props.onDragStart(props.item.id, event)
    }

    function handleClick(event: React.MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        props.onSelect(props.item.id, getSelectModifier(event))
    }

    function handleDoubleClick(): void {
        props.onOpen(props.item.id);
    }

    function handleContextMenu(event: React.MouseEvent): void {
        props.onContextMenu(props.item.id, event)
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
