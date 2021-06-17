import {
	buildGlobalStateContext,
	GenericGlobalStateContext,
	genericStateProvider,
	IStateHookResult,
	ReducerConfigMap, useGlobalState
} from "../../components/utils/storeUtils";
import React, {Context, useContext} from "react";
import {ItemData} from "../../../common/commonModels";


export interface ItemsState {
	items: ItemData[]
}

const initialState: ItemsState = {
	items: [],
};

export enum ItemsActionType {
	SET_ITEMS = "items.set",
}

const reducerConfigMap: ReducerConfigMap<ItemsActionType, ItemsState> = new ReducerConfigMap([
	[ItemsActionType.SET_ITEMS, (state, payload) => ({
		...state,
		items: payload,
	})],
])

const stateContext: Context<GenericGlobalStateContext<ItemsState,ItemsActionType>> = buildGlobalStateContext()

export function ItemsStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, stateContext)
}

export function useItemsState(): IStateHookResult<ItemsState, ItemsActionType> {
	return useGlobalState(stateContext, "items")

}

