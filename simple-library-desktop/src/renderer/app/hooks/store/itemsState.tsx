import {
    buildContext,
    GenericContextProvider,
    IStateHookResultReadWrite,
    IStateHookResultWriteOnly,
    ReducerConfigMap,
    useGlobalStateReadWrite,
    useGlobalStateWriteOnly
} from "../../../components/utils/storeUtils";
import React from "react";
import {AttributeDTO, ItemDTO} from "../../../../common/events/dtoModels";


// STATE

export interface ItemsState {
    items: ItemDTO[];
    page: {
        index: number,
        size: number,
        total: number
    };
}

const initialState: ItemsState = {
    items: [],
    page: {index: 0, size: 0, total: 0}
};


// REDUCER

enum ItemsActionType {
    SET_ITEMS = "items.set",
    UPDATE_ITEM_ATTRIBUTE = "items.attributes.update",
    REMOVE_ITEM_ATTRIBUTE = "items.attributes.remove",
    CLEAR_ATTRIBUTE_MODIFIED_FLAGS = "items.attributes.clear-modified-flags",
    SET_PAGE = "items.page.set",
}

const reducerConfigMap: ReducerConfigMap<ItemsActionType, ItemsState> = new ReducerConfigMap([
    [ItemsActionType.SET_ITEMS, (state, payload) => ({
        ...state,
        items: payload.items,
        page: payload.page
    })],
    [ItemsActionType.UPDATE_ITEM_ATTRIBUTE, (state, payload) => {
        const newItems: ItemDTO[] = state.items.map((item: ItemDTO) => {
            if (item.id === payload.itemId) {
                return {
                    ...item,
                    attributes: item.attributes.map((attribute: AttributeDTO) => {
                        if (attribute.attId === payload.attId) {
                            return {
                                ...attribute,
                                value: payload.newValue,
                                modified: payload.modified
                            };
                        } else {
                            return attribute;
                        }
                    })
                };
            } else {
                return item;
            }
        });
        return {
            ...state,
            items: newItems
        };
    }],
    [ItemsActionType.REMOVE_ITEM_ATTRIBUTE, (state, payload) => {
        const newItems: ItemDTO[] = state.items.map((item: ItemDTO) => {
            if (item.id === payload.itemId) {
                return {
                    ...item,
                    attributes: item.attributes.map((attribute: AttributeDTO) => {
                        if (attribute.attId === payload.attId) {
                            return {
                                ...attribute,
                                value: null,
                                modified: false
                            };
                        } else {
                            return attribute;
                        }
                    })
                };
            } else {
                return item;
            }
        });
        return {
            ...state,
            items: newItems
        };
    }],
    [ItemsActionType.CLEAR_ATTRIBUTE_MODIFIED_FLAGS, (state, payload) => {
        const newItems: ItemDTO[] = state.items.map((item: ItemDTO) => {
            if (payload.clearAll || payload.itemIds.indexOf(item.id) !== -1) {
                return {
                    ...item,
                    attributes: item.attributes.map((attribute: AttributeDTO) => ({
                        ...attribute,
                        modified: false
                    }))
                };
            } else {
                return item;
            }
        });
        return {
            ...state,
            items: newItems
        };
    }],
    [ItemsActionType.SET_PAGE, (state, payload) => ({
        ...state,
        page: payload
    })]
]);


// CONTEXT

const [
    stateContext,
    dispatchContext
] = buildContext<ItemsActionType, ItemsState>();

export function ItemsStateProvider(props: { children: any }) {
    return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useItemsContext(): IStateHookResultReadWrite<ItemsState, ItemsActionType> {
    return useGlobalStateReadWrite<ItemsState, ItemsActionType>(stateContext, dispatchContext);
}

function useItemsDispatch(): IStateHookResultWriteOnly<ItemsActionType> {
    return useGlobalStateWriteOnly<ItemsActionType>(dispatchContext);
}

export function useDispatchSetItems(): (items: ItemDTO[], page: { index: number, size: number, total: number }) => void {
    const dispatch = useItemsDispatch();
    return (items: ItemDTO[], page: { index: number, size: number }) => {
        dispatch({
            type: ItemsActionType.SET_ITEMS,
            payload: {
                items: items,
                page: page
            }
        });
    };
}

export function useDispatchUpdateItemAttribute(): (itemId: number, attribute: AttributeDTO) => void {
    const dispatch = useItemsDispatch();
    return (itemId: number, attribute: AttributeDTO) => {
        dispatch({
            type: ItemsActionType.UPDATE_ITEM_ATTRIBUTE,
            payload: {
                itemId: itemId,
                attId: attribute.attId,
                newValue: attribute.value,
                modified: attribute.modified
            }
        });
    };
}

export function useDispatchRemoveItemAttribute(): (itemId: number, attributeId: number) => void {
    const dispatch = useItemsDispatch();
    return (itemId: number, attributeId: number) => {
        dispatch({
            type: ItemsActionType.REMOVE_ITEM_ATTRIBUTE,
            payload: {
                itemId: itemId,
                attId: attributeId
            }
        });
    };
}

export function useDispatchItemsClearAttributeModifiedFlags(): (itemIds: number[]) => void {
    const dispatch = useItemsDispatch();
    return (itemIds: number[] | null) => {
        dispatch({
            type: ItemsActionType.CLEAR_ATTRIBUTE_MODIFIED_FLAGS,
            payload: {
                clearAll: itemIds === null,
                itemIds: itemIds
            }
        });
    };
}

// export function useDispatchSetItemPage(): (page: { index: number, size: number, total: number }) => void {
//     const dispatch = useItemsDispatch();
//     return (page: { index: number, size: number, total: number }) => {
//         dispatch({
//             type: ItemsActionType.SET_PAGE,
//             payload: page
//         });
//     };
// }

export function useItems() {
    const [itemsState] = useItemsContext();
    return itemsState.items;
}


export function useItemPage() {
    // TODO: move to own state -> no updates for components that just want to "re-loadItems" (-> that use the hook) / or create new hook "useReloadItems"
    const [itemsState] = useItemsContext();
    return itemsState.page;
}

export function useGetItemIds() {
    const [itemsState] = useItemsContext();
    return () => itemsState.items.map((item: ItemDTO) => item.id);
}


