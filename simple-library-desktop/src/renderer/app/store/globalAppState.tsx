import {buildGlobalStateContext, GenericGlobalStateContext, genericStateProvider, ReducerConfigMap} from "./storeUtils";
import React, {Context, useContext} from "react";
import {Group, ItemData} from "../../../common/commonModels";
import {unique} from "../common/arrayUtils";


export interface GlobalApplicationState {
	collectionSidebarExpandedNodes: string[]

	rootGroup: Group | null,
	activeCollectionId: number | null,

	items: ItemData[],
	selectedItemIds: number[],
	lastSelectedItemId: number | null
}

const initialState: GlobalApplicationState = {
	collectionSidebarExpandedNodes: [],
	rootGroup: null,
	activeCollectionId: null,

	items: [],
	selectedItemIds: [],
	lastSelectedItemId: null,
};


export enum AppActionType {
	SET_CURRENT_COLLECTION_ID = "collection.set",
	SET_ITEMS = "items.set",
	SET_ROOT_GROUP = "rootgroup.set",
	ITEM_SELECTION_SET = "items.selection.set",
	ITEM_SELECTION_ADD = "items.selection.add",
	ITEM_SELECTION_REMOVE = "items.selection.remove",
	ITEM_SELECTION_SET_LAST = "item.selection.set-last",
	COLLECTION_SIDEBAR_SET_EXPANDED = "ui.sidebar.collections.expanded.set"
}

const reducerConfigMap: ReducerConfigMap<AppActionType, GlobalApplicationState> = new ReducerConfigMap([

	[AppActionType.SET_CURRENT_COLLECTION_ID, (state, payload) => ({
		...state,
		activeCollectionId: payload,
	})],
	[AppActionType.SET_ITEMS, (state, payload) => ({
		...state,
		items: payload,
	})],
	[AppActionType.SET_ROOT_GROUP, (state, payload) => ({
		...state,
		rootGroup: payload,
	})],


	[AppActionType.COLLECTION_SIDEBAR_SET_EXPANDED, (state, payload) => ({
		...state,
		collectionSidebarExpandedNodes: payload,
	})],


	[AppActionType.ITEM_SELECTION_SET, (state, payload) => ({
		...state,
		selectedItemIds: payload,
	})],
	[AppActionType.ITEM_SELECTION_ADD, (state, payload) => ({
		...state,
		selectedItemIds: unique<number>([...state.selectedItemIds, ...payload]),
	})],
	[AppActionType.ITEM_SELECTION_REMOVE, (state, payload) => ({
		...state,
		selectedItemIds: state.selectedItemIds.filter(itemId => payload.indexOf(itemId) === -1),
	})],
	[AppActionType.ITEM_SELECTION_SET_LAST, (state, payload) => ({
		...state,
		lastSelectedItemId: payload,
	})],

])


const globalAppStateContext: Context<GenericGlobalStateContext<GlobalApplicationState>> = buildGlobalStateContext<GlobalApplicationState>()

export function GlobalAppStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, globalAppStateContext)
}

export function useAppState() {
	const {state, dispatch} = useContext(globalAppStateContext);
	if (state) {
		return {state, dispatch};
	} else {
		console.error("Error: No global app state found.");
	}
}

