import {
	buildGlobalStateContext,
	GenericGlobalStateContext,
	genericStateProvider,
	IStateHookResult,
	ReducerConfigMap,
	useGlobalState
} from "../../components/utils/storeUtils";
import React, {Context} from "react";
import {CollectionType} from "../../../common/commonModels";


export interface CollectionActiveState {
	activeCollectionId: number | null,
}

const initialState: CollectionActiveState = {
	activeCollectionId: null,
};

export enum CollectionActiveActionType {
	SET_CURRENT_COLLECTION_ID = "collection.set",
}

const reducerConfigMap: ReducerConfigMap<CollectionActiveActionType, CollectionActiveState> = new ReducerConfigMap([
	[CollectionActiveActionType.SET_CURRENT_COLLECTION_ID, (state, payload) => ({
		...state,
		activeCollectionId: payload,
	})],
])

const stateContext: Context<GenericGlobalStateContext<CollectionActiveState, CollectionActiveActionType>> = buildGlobalStateContext()

export function CollectionActiveStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, stateContext)
}

export function useCollectionActiveState(): IStateHookResult<CollectionActiveState, CollectionActiveActionType> {
	return useGlobalState(stateContext, "collection-active")
}

