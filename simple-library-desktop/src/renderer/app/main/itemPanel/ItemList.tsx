import * as React from 'react';
import { VBox } from '../../../components/layout/Box';
import { AlignCross, Size } from '../../../components/common';
import { useRootGroup } from '../../../common/hooks/groupHooks';
import { ItemData } from '../../../../common/commonModels';
import { ItemEntry } from './ItemEntry';
import { SelectMode } from '../../../common/utils/utils';
import { DragAndDropItems } from '../../../common/dragAndDrop';
import { ItemContextMenu } from './ItemContextMenu';
import { useActiveCollection } from '../../../common/hooks/collectionHooks';
import { useItems, useItemSelection } from '../../../common/hooks/itemHooks';


export function ItemList(): React.ReactElement {

    const { rootGroup } = useRootGroup();
    const { items, moveItems, copyItems, removeItems } = useItems();
    const { activeCollectionId } = useActiveCollection();
    const { selectedItemIds, isSelected, setSelection, toggleSelection, selectRangeTo } = useItemSelection();

    return (
        <>
            <VBox spacing={Size.S_0_5} alignCross={AlignCross.STRETCH} className={"item-container"} style={{ overflow: "auto" }}>
                {
                    items.map((item: ItemData) =>
                        <ItemEntry item={item}
                                   isSelected={isSelected(item.id)}
                                   onSelectAction={handleSelectAction}
                                   onDragStart={handleDragStart}
                        />)
                }
            </VBox>
            <ItemContextMenu
                collectionId={activeCollectionId}
                rootGroup={rootGroup}
                onActionMove={handleMoveItems}
                onActionCopy={handleCopyItems}
                onActionRemove={handleRemoveItems}
            />
        </>
    );

    function handleMoveItems(targetCollectionId: number, triggerItemId: number) {
        const itemIds: number[] = [...selectedItemIds];
        if (itemIds.indexOf(triggerItemId) === -1) {
            itemIds.push(triggerItemId);
        }
        moveItems(itemIds, activeCollectionId, targetCollectionId);
    }


    function handleCopyItems(targetCollectionId: number, triggerItemId: number) {
        const itemIds: number[] = [...selectedItemIds];
        if (itemIds.indexOf(triggerItemId) === -1) {
            itemIds.push(triggerItemId);
        }
        copyItems(itemIds, activeCollectionId, targetCollectionId);
    }


    function handleRemoveItems(triggerItemId: number) {
        const itemIds: number[] = [...selectedItemIds];
        if (itemIds.indexOf(triggerItemId) === -1) {
            itemIds.push(triggerItemId);
        }
        removeItems(itemIds, activeCollectionId);
    }

    function handleSelectAction(itemId: number, selectMode: SelectMode): void {
        switch (selectMode) {
            case SelectMode.DEFAULT: {
                setSelection([itemId]);
                break;
            }
            case SelectMode.ADDITIVE: {
                toggleSelection([itemId]);
                break;
            }
            case SelectMode.RANGE: {
                selectRangeTo(itemId, false);
                break;
            }
            case SelectMode.ADDITIVE_RANGE: {
                selectRangeTo(itemId, true);
                break;
            }
        }
    }

    function handleDragStart(itemId: number, event: React.DragEvent, copyMode: boolean): void {
        let itemsIdsToDrag: number[];
        if (selectedItemIds.indexOf(itemId) === -1) {
            itemsIdsToDrag = [itemId];
        } else {
            itemsIdsToDrag = [...selectedItemIds];
        }
        DragAndDropItems.setDragData(event.dataTransfer, activeCollectionId, itemsIdsToDrag, copyMode);
        DragAndDropItems.setDragLabel(event.dataTransfer, copyMode, itemsIdsToDrag.length);
    }

}

