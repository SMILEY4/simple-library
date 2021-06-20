import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {ItemData} from "../../../common/commonModels";
import {ItemSelectionActionType, ItemSelectionState} from "./itemSelectionState";


// STATE

export interface ItemsState {
	items: ItemData[]
}

const initialState: ItemsState = {
	items: [],
};


// REDUCER

export enum ItemsActionType {
	SET_ITEMS = "items.set",
}

const reducerConfigMap: ReducerConfigMap<ItemsActionType, ItemsState> = new ReducerConfigMap([
	[ItemsActionType.SET_ITEMS, (state, payload) => ({
		...state,
		items: payload,
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<ItemsActionType, ItemsState>()

export function ItemsStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useItemsState(): IStateHookResultReadWrite<ItemsState, ItemsActionType> {
	return useGlobalStateReadWrite<ItemsState, ItemsActionType>(stateContext, dispatchContext)
}

export function useItemsStateDispatch(): IStateHookResultWriteOnly<ItemsActionType> {
	return useGlobalStateWriteOnly<ItemsActionType>(dispatchContext)
}