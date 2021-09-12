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
import {unique} from "../common/arrayUtils";


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
		expandedNodes: unique<number>([...state.expandedNodes, payload]),
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

function useCollectionSidebarStateDispatch(): IStateHookResultWriteOnly<CollectionSidebarActionType> {
	return useGlobalStateWriteOnly<CollectionSidebarActionType>(dispatchContext)
}

export function useDispatchExpandNode(): (nodeId: number) => void {
	const dispatch = useCollectionSidebarStateDispatch();
	return (nodeId: number) => {
		dispatch({
			type: CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_ADD,
			payload: nodeId
		});
	}
}

export function useDispatchCollapseNode(): (nodeId: number) => void {
	const dispatch = useCollectionSidebarStateDispatch();
	return (nodeId: number) => {
		dispatch({
			type: CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_REMOVE,
			payload: nodeId
		});
	}
}

export function useDispatchSetExpandedNodes(): (nodeIds: number[]) => void {
	const dispatch = useCollectionSidebarStateDispatch();
	return (nodeIds: number[]) => {
		dispatch({
			type: CollectionSidebarActionType.COLLECTION_SIDEBAR_EXPANDED_SET,
			payload: nodeIds
		});
	}
}
