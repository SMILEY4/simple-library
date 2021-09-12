import {
    buildContext,
    GenericContextProvider,
    IStateHookResultReadWrite,
    IStateHookResultWriteOnly,
    ReducerConfigMap,
    useGlobalStateReadWrite,
    useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {AttributeDTO, ItemDTO} from "../../../common/events/dtoModels";


// STATE

export interface ItemsState {
    items: ItemDTO[]
}

const initialState: ItemsState = {
    items: []
};


// REDUCER

enum ItemsActionType {
    SET_ITEMS = "items.set",
    UPDATE_ITEM_ATTRIBUTE = "items.update-attribute"
}

const reducerConfigMap: ReducerConfigMap<ItemsActionType, ItemsState> = new ReducerConfigMap([
    [ItemsActionType.SET_ITEMS, (state, payload) => ({
        ...state,
        items: payload
    })],
    [ItemsActionType.UPDATE_ITEM_ATTRIBUTE, (state, payload) => {
        const newItems: ItemDTO[] = state.items.map((item: ItemDTO) => {
            if (item.id === payload.itemId) {
                return {
                    ...item,
                    attributes: item.attributes.map((attribute: AttributeDTO) => {
                        if (attribute.key === payload.key) {
                            return {
                                ...attribute,
                                value: payload.newValue
                            }
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
    }]
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

export function useDispatchSetItems(): (items: ItemDTO[]) => void {
    const dispatch = useItemsDispatch();
    return (items: ItemDTO[]) => {
        dispatch({
            type: ItemsActionType.SET_ITEMS,
            payload: items
        })
    }
}

export function useDispatchClearItems(): () => void {
    const dispatchSetItems = useDispatchSetItems();
    return () => dispatchSetItems([]);
}

export function useDispatchUpdateItemAttribute(): (itemId: number, attributeKey: string, newValue: string) => void {
    const dispatch = useItemsDispatch();
    return (itemId: number, attributeKey: string, newValue: string) => {
        dispatch({
            type: ItemsActionType.UPDATE_ITEM_ATTRIBUTE,
            payload: {
                itemId: itemId,
                key: attributeKey,
                newValue: newValue
            }
        })
    }
}
