import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";
import {NotificationActionType, NotificationState} from "./notificationState";


// STATE

export interface CollectionActiveState {
	activeCollectionId: number | null,
}

const initialState: CollectionActiveState = {
	activeCollectionId: null,
};


// REDUCER

export enum CollectionActiveActionType {
	SET_CURRENT_COLLECTION_ID = "collection.set",
}

const reducerConfigMap: ReducerConfigMap<CollectionActiveActionType, CollectionActiveState> = new ReducerConfigMap([
	[CollectionActiveActionType.SET_CURRENT_COLLECTION_ID, (state, payload) => ({
		...state,
		activeCollectionId: payload,
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<CollectionActiveActionType, CollectionActiveState>()

export function CollectionActiveStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useCollectionActiveState(): IStateHookResultReadWrite<CollectionActiveState, CollectionActiveActionType> {
	return useGlobalStateReadWrite<CollectionActiveState, CollectionActiveActionType>(stateContext, dispatchContext)
}

export function useCollectionActiveStateDispatch(): IStateHookResultWriteOnly<CollectionActiveActionType> {
	return useGlobalStateWriteOnly<CollectionActiveActionType>(dispatchContext)
}

