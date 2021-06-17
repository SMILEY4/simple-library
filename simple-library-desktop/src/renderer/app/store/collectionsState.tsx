import {
	buildGlobalStateContext,
	GenericGlobalStateContext,
	genericStateProvider,
	IStateHookResult,
	ReducerConfigMap, useGlobalState
} from "../../components/utils/storeUtils";
import React, {Context, useContext} from "react";
import {Group} from "../../../common/commonModels";


export interface CollectionsState {
	rootGroup: Group | null,
}

const initialState: CollectionsState = {
	rootGroup: null,
};

export enum CollectionsActionType {
	SET_ROOT_GROUP = "rootgroup.set",
}

const reducerConfigMap: ReducerConfigMap<CollectionsActionType, CollectionsState> = new ReducerConfigMap([
	[CollectionsActionType.SET_ROOT_GROUP, (state, payload) => ({
		...state,
		rootGroup: payload,
	})],
])


const stateContext: Context<GenericGlobalStateContext<CollectionsState, CollectionsActionType>> = buildGlobalStateContext()

export function CollectionsStateProvider(props: { children: any }) {
	return genericStateProvider(props.children, initialState, reducerConfigMap, stateContext)
}

export function useCollectionsState(): IStateHookResult<CollectionsState, CollectionsActionType> {
	return useGlobalState(stateContext, "collections")

}

