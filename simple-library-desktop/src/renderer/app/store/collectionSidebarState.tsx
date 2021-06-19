import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {CollectionActiveActionType} from "./collectionActiveState";


// STATE

export interface CollectionSidebarState {
	expandedNodes: string[]
}

const initialState: CollectionSidebarState = {
	expandedNodes: [],
};


// REDUCER

export enum CollectionSidebarActionType {
	COLLECTION_SIDEBAR_SET_EXPANDED = "ui.sidebar.collections.expanded.set"
}

const reducerConfigMap: ReducerConfigMap<CollectionSidebarActionType, CollectionSidebarState> = new ReducerConfigMap([
	[CollectionSidebarActionType.COLLECTION_SIDEBAR_SET_EXPANDED, (state, payload) => ({
		...state,
		expandedNodes: payload,
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