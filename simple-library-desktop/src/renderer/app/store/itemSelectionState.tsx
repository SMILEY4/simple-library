import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {unique} from "../common/arrayUtils";
import {CollectionsActionType} from "./collectionsState";


// STATE

export interface ItemSelectionState {
	selectedItemIds: number[],
	lastSelectedItemId: number | null,
}

const initialState: ItemSelectionState = {
	selectedItemIds: [],
	lastSelectedItemId: null
};


// REDUCER

export enum ItemSelectionActionType {
	ITEM_SELECTION_SET = "items.selection.set",
	ITEM_SELECTION_ADD = "items.selection.add",
	ITEM_SELECTION_REMOVE = "items.selection.remove",
	ITEM_SELECTION_SET_LAST = "item.selection.set-last",
}

const reducerConfigMap: ReducerConfigMap<ItemSelectionActionType, ItemSelectionState> = new ReducerConfigMap([
	[ItemSelectionActionType.ITEM_SELECTION_SET, (state, payload) => ({
		...state,
		selectedItemIds: payload,
	})],
	[ItemSelectionActionType.ITEM_SELECTION_ADD, (state, payload) => ({
		...state,
		selectedItemIds: unique<number>([...state.selectedItemIds, ...payload]),
	})],
	[ItemSelectionActionType.ITEM_SELECTION_REMOVE, (state, payload) => ({
		...state,
		selectedItemIds: state.selectedItemIds.filter(itemId => payload.indexOf(itemId) === -1),
	})],
	[ItemSelectionActionType.ITEM_SELECTION_SET_LAST, (state, payload) => ({
		...state,
		lastSelectedItemId: payload,
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<ItemSelectionActionType, ItemSelectionState>()

export function ItemSelectionStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useItemSelectionState(): IStateHookResultReadWrite<ItemSelectionState, ItemSelectionActionType> {
	return useGlobalStateReadWrite<ItemSelectionState, ItemSelectionActionType>(stateContext, dispatchContext)
}

export function useItemSelectionStateDispatch(): IStateHookResultWriteOnly<ItemSelectionActionType> {
	return useGlobalStateWriteOnly<ItemSelectionActionType>(dispatchContext)
}
