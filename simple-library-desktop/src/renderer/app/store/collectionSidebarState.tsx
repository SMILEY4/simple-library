import {
	buildGlobalStateContext,
	GenericGlobalStateContext,
	genericStateProvider,
	IStateHookResult,
	ReducerConfigMap,
	useGlobalState
} from "../../components/utils/storeUtils";
import React, {Context} from "react";


export interface CollectionSidebarState {
	expandedNodes: string[]
}

const initialState: CollectionSidebarState = {
	expandedNodes: [],
};

export enum CollectionSidebarActionType {
	COLLECTION_SIDEBAR_SET_EXPANDED = "ui.sidebar.collections.expanded.set"
}

const reducerConfigMap: ReducerConfigMap<CollectionSidebarActionType, CollectionSidebarState> = new ReducerConfigMap([
	[CollectionSidebarActionType.COLLECTION_SIDEBAR_SET_EXPANDED, (state, payload) => ({
		...state,
		expandedNodes: payload,
	})],
])


const stateContext: Context<GenericGlobalStateContext<CollectionSidebarState, CollectionSidebarActionType>> = buildGlobalStateContext()

export function CollectionSidebarStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, stateContext)
}

export function useCollectionSidebarState(): IStateHookResult<CollectionSidebarState, CollectionSidebarActionType> {
	return useGlobalState(stateContext, "collection-sidebar")
}

