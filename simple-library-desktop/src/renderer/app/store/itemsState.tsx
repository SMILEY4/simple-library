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

export enum ItemsActionType {
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

export function useItemsDispatch(): IStateHookResultWriteOnly<ItemsActionType> {
    return useGlobalStateWriteOnly<ItemsActionType>(dispatchContext);
}
