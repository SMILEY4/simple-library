import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap, useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React, {Context} from "react";
import {Group} from "../../../common/commonModels";
import {CollectionActiveActionType, CollectionActiveState} from "./collectionActiveState";
import {CollectionSidebarActionType} from "./collectionSidebarState";
import {ItemSelectionState} from "./itemSelectionState";


// STATE

export interface CollectionsState {
	rootGroup: Group | null,
}

const initialState: CollectionsState = {
	rootGroup: null,
};


// REDUCER

export enum CollectionsActionType {
	SET_ROOT_GROUP = "rootgroup.set",
}

const reducerConfigMap: ReducerConfigMap<CollectionsActionType, CollectionsState> = new ReducerConfigMap([
	[CollectionsActionType.SET_ROOT_GROUP, (state, payload) => ({
		...state,
		rootGroup: payload,
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<CollectionsActionType, CollectionsState>()

export function CollectionsStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useCollectionsContext(): IStateHookResultReadWrite<CollectionsState, CollectionsActionType> {
	return useGlobalStateReadWrite<CollectionsState, CollectionsActionType>(stateContext, dispatchContext)
}

export function useCollectionsDispatch(): IStateHookResultWriteOnly<CollectionsActionType> {
	return useGlobalStateWriteOnly<CollectionsActionType>(dispatchContext)
}
