import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite,
	IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite,
	useGlobalStateWriteOnly
} from "../../../components/utils/storeUtils";
import React from "react";


// STATE
export const DEFAULT_PAGE_SIZE = 50;

export interface CollectionActiveState {
	activeCollectionId: number | null,
	page: {
		index: number,
		size: number,
		total: number
	}
}

const initialState: CollectionActiveState = {
	activeCollectionId: null,
	page: {
		index: 0,
		size: DEFAULT_PAGE_SIZE,
		total: 0
	}
};


// REDUCER

enum CollectionActiveActionType {
	SET_CURRENT_COLLECTION_ID = "collection.active.set",
	SET_PAGE = "collection.page.set",
}

const reducerConfigMap: ReducerConfigMap<CollectionActiveActionType, CollectionActiveState> = new ReducerConfigMap([
	[CollectionActiveActionType.SET_CURRENT_COLLECTION_ID, (state, payload) => ({
		...state,
		activeCollectionId: payload
	})],
	[CollectionActiveActionType.SET_PAGE, (state, payload) => ({
		...state,
		page: payload
	})]
]);


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<CollectionActiveActionType, CollectionActiveState>();


export function CollectionActiveStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useCollectionActiveContext(): IStateHookResultReadWrite<CollectionActiveState, CollectionActiveActionType> {
	return useGlobalStateReadWrite<CollectionActiveState, CollectionActiveActionType>(stateContext, dispatchContext);
}

function useCollectionActiveDispatch(): IStateHookResultWriteOnly<CollectionActiveActionType> {
	return useGlobalStateWriteOnly<CollectionActiveActionType>(dispatchContext);
}

export function useDispatchSetActiveCollection(): (collectionId: number) => void {
	const dispatch = useCollectionActiveDispatch();
	return (collectionId: number) => {
		dispatch({
			type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
			payload: collectionId
		});
	};
}

export function useDispatchClearActiveCollection(): () => void {
	const dispatch = useCollectionActiveDispatch();
	return () => {
		dispatch({
			type: CollectionActiveActionType.SET_CURRENT_COLLECTION_ID,
			payload: null
		});
	};
}

export function useActiveCollection() {
	const [activeCollectionState] = useCollectionActiveContext();
	return activeCollectionState.activeCollectionId;
}


export function useDispatchSetItemPage(): (page: { index: number, size: number, total: number }) => void {
	const dispatch = useCollectionActiveDispatch();
	return (page: { index: number, size: number, total: number }) => {
		dispatch({
			type: CollectionActiveActionType.SET_PAGE,
			payload: page
		});
	};
}

export function useItemPage() {
	const [state] = useCollectionActiveContext();
	return state.page;
}
