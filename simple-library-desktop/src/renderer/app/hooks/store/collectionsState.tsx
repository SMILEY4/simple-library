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
import {CollectionDTO, GroupDTO} from "../../../../common/events/dtoModels";


// STATE

export interface CollectionsState {
	rootGroup: GroupDTO | null,
}

const initialState: CollectionsState = {
	rootGroup: null
};


// REDUCER

enum CollectionsActionType {
	SET_ROOT_GROUP = "rootgroup.set",
}

const reducerConfigMap: ReducerConfigMap<CollectionsActionType, CollectionsState> = new ReducerConfigMap([
	[CollectionsActionType.SET_ROOT_GROUP, (state, payload) => ({
		...state,
		rootGroup: payload
	})]
]);


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<CollectionsActionType, CollectionsState>();

export function CollectionsStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useCollectionsContext(): IStateHookResultReadWrite<CollectionsState, CollectionsActionType> {
	return useGlobalStateReadWrite<CollectionsState, CollectionsActionType>(stateContext, dispatchContext);
}

function useCollectionsDispatch(): IStateHookResultWriteOnly<CollectionsActionType> {
	return useGlobalStateWriteOnly<CollectionsActionType>(dispatchContext);
}

export function useDispatchSetRootGroup(): (group: GroupDTO) => void {
	const collectionsDispatch = useCollectionsDispatch();
	return (group: GroupDTO) => {
		collectionsDispatch({
			type: CollectionsActionType.SET_ROOT_GROUP,
			payload: group,
		});
	}
}

export function useRootGroup() {
	const [collectionsState] = useCollectionsContext();
	return collectionsState.rootGroup;
}

export function useFindCollection() {
	const [collectionsState] = useCollectionsContext();

	function find(collectionId: number): CollectionDTO | null {
		if (collectionId) {
			const result: CollectionDTO | undefined = extractCollections(collectionsState.rootGroup).find(collection => collection.id === collectionId);
			return result ? result : null;
		} else {
			return null;
		}
	}

	return find;
}


export function useFindGroup() {
	const [collectionsState] = useCollectionsContext();

	function find(groupId: number): GroupDTO | null {
		const result: GroupDTO | undefined = extractGroups(collectionsState.rootGroup).find(group => group.id === groupId);
		return result ? result : null;
	}

	return find;
}

function extractCollections(group: GroupDTO | null): CollectionDTO[] {
	const collections: CollectionDTO[] = [];
	if (group) {
		collections.push(...group.collections);
		group.children.forEach((child: GroupDTO) => {
			collections.push(...extractCollections(child));
		});
	}
	return collections;
}

function extractGroups(group: GroupDTO | null): GroupDTO[] {
	const groups: GroupDTO[] = [];
	if (group) {
		groups.push(...group.children);
		group.children.forEach((child: GroupDTO) => {
			groups.push(...extractGroups(child));
		});
	}
	return groups;
}
