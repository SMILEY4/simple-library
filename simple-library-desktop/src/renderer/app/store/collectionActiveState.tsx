import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite, IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite, useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React from "react";


// STATE

export interface CollectionActiveState {
	activeCollectionId: number | null,
}

const initialState: CollectionActiveState = {
	activeCollectionId: null,
};


// REDUCER

enum CollectionActiveActionType {
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

export function useCollectionActiveContext(): IStateHookResultReadWrite<CollectionActiveState, CollectionActiveActionType> {
	return useGlobalStateReadWrite<CollectionActiveState, CollectionActiveActionType>(stateContext, dispatchContext)
}

function useCollectionActiveDispatch(): IStateHookResultWriteOnly<CollectionActiveActionType> {
	return useGlobalStateWriteOnly<CollectionActiveActionType>(dispatchContext)
}

export function useDispatchSetActiveCollection(): (collectionId: number) => void {
	const dispatch = useCollectionActiveDispatch();
	return (collectionId: number) => {
		dispatch({
			type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
			payload: collectionId
		});
	}
}

export function useDispatchClearActiveCollection(): () => void {
	const dispatch = useCollectionActiveDispatch();
	return () => {
		dispatch({
			type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
			payload: null
		});
	}
}

export function useActiveCollection() {
	const [activeCollectionState] = useCollectionActiveContext();
	return activeCollectionState.activeCollectionId;
}
