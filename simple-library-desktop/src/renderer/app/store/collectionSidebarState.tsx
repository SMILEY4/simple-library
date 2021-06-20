import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {CollectionActiveActionType} from "./collectionActiveState";
import {ItemSelectionState} from "./itemSelectionState";


// STATE

export interface CollectionSidebarState {
	expandedNodes: string[]
}

const initialState: CollectionSidebarState = {
	expandedNodes: [],
};


// REDUCER

export enum CollectionSidebarActionType {
	COLLECTION_SIDEBAR_EXPANDED_SET = "ui.sidebar.collections.expanded.set",
	COLLECTION_SIDEBAR_EXPANDED_ADD = "ui.sidebar.collections.expanded.add",
	COLLECTION_SIDEBAR_EXPANDED_REMOVE = "ui.sidebar.collections.expanded.remove",

}

const reducerConfigMap: ReducerConfigMap<CollectionSidebarActionType, CollectionSidebarState> = new ReducerConfigMap([
	[CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_SET, (state, payload) => ({
		...state,
		expandedNodes: payload,
	})],
	[CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_ADD, (state, payload) => ({
		...state,
		expandedNodes: [...state.expandedNodes, payload],
	})],
	[CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_REMOVE, (state, payload) => ({
		...state,
		expandedNodes: state.expandedNodes.filter(id => id !== payload),
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<CollectionSidebarActionType, CollectionSidebarState>()

export function CollectionSidebarStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useCollectionSidebarState(): IStateHookResultReadWrite<CollectionSidebarState, CollectionSidebarActionType> {
	return useGlobalStateReadWrite<CollectionSidebarState, CollectionSidebarActionType>(stateContext, dispatchContext)
}

export function useCollectionSidebarStateDispatch(): IStateHookResultWriteOnly<CollectionSidebarActionType> {
	return useGlobalStateWriteOnly<CollectionSidebarActionType>(dispatchContext)
}