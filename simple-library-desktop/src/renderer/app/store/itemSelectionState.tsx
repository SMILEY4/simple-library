import {
	buildGlobalStateContext,
	GenericGlobalStateContext,
	genericStateProvider,
	IStateHookResult,
	ReducerConfigMap,
	useGlobalState
} from "../../components/utils/storeUtils";
import React, {Context} from "react";
import {unique} from "../common/arrayUtils";


export interface ItemSelectionState {
	selectedItemIds: number[],
	lastSelectedItemId: number | null,
}

const initialState: ItemSelectionState = {
	selectedItemIds: [],
	lastSelectedItemId: null
};

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


const stateContext: Context<GenericGlobalStateContext<ItemSelectionState, ItemSelectionActionType>> = buildGlobalStateContext()

export function ItemSelectionStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, stateContext)
}

export function useItemSelectionState(): IStateHookResult<ItemSelectionState, ItemSelectionActionType> {
	return useGlobalState(stateContext, "item-selection")
}

